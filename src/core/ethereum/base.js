import Web3 from "web3";
import to from "await-to-js";
import Agent from "../agent";
import { getCurrentContract } from "../../config/contract";

export default class Base {
  constructor(status, isIteringId) {
    this.isIteringId = isIteringId; // 是否是itering id
    this.status = status; // 主网 main 测试网 test
    this.wallet = ""; // 以太坊账户
    this.validNetWork = true; // main kovan
    this.installed = true; // 浏览器是否安装web3
    this.blockConfig = getCurrentContract(status, 1); // 获得配置文件
    this.contractCache = {}; // 合约数据的缓存

    // 定义实例对象
    if (this.isIteringId) {
      this.instance = new Web3(
        new Web3.providers.HttpProvider(
          getCurrentContract(this.status, 1).CONF_PROVIDER
        )
      );
    } else {
      this.instance = Web3.givenProvider && new Web3(Web3.givenProvider);
    }

    // 定义agent
    this.agent = new Agent({ status, blockchain: 1 });
  }
  // 是否安装web3
  isInstalled() {
    return (
      typeof window.web3 !== "undefined" ||
      typeof window.ethereum !== "undefined"
    );
  }
  // 获得账户
  getAccounts() {
    return this.instance && this.instance.eth.getAccounts();
  }
  /**
   * 获得网络节点名称
   */
  getNetWork() {
    return this.instance && this.instance.eth.net.getId();
  }

  // 生成合约对象
  createContract({ tokenABI, tokenAddr }) {
    if (this.contractCache[tokenAddr]) {
      return this.contractCache[tokenAddr];
    }
    return (this.contractCache[tokenAddr] = {
      tokenABI,
      tokenAddr,
      default: new this.instance.eth.Contract(tokenABI, tokenAddr)
    });
  }

  /**
   * @param {string} wallet 钱包地址
   * @param {function} contractMethod 合约的方法
   * @param {number} addGasLimit 添加的gas limit (防止方法获得的gas limit 值比实际消耗少了点)
   * @param {number} defultGasLimit 默认gas limit
   * @param {boolean}} force 是否强制使用 defultGasLimit
   */
  async _getGasLimit({
    wallet,
    contractMethod,
    addGasLimit = 100000,
    defultGasLimit = 600000,
    force = false
  }) {
    if (this.gaslimitCache[contractMethod]) {
      return this.gaslimitCache[contractMethod];
    } else {
      if (!this.instance) throw new Error("Can't find web3");
      let limit = 0;
      try {
        if (force) {
          throw new Error();
        }

        limit =
          (await (contractMethod || this.instance.eth).estimateGas({
            from: wallet
          })) + addGasLimit;
      } catch (e) {
        limit = defultGasLimit;
        console.log(e);
      }

      return limit;
    }
  }

  /**
   * 获取gas price 以及 nonce
   * @param {string} wallet  钱包地址
   */
  async _getGasPrice(wallet) {
    let err, response;
    [err, response] = await to(this.agent.apiGasPrice({ wallet }));
    if (err) {
      throw new Error(err);
    }
    const { code, data } = response || {};
    if (code === 0) {
      const { gas_price, nonce } = data;
      return {
        gas_price,
        nonce
      };
    }
    return {
      gas_price: 9000000000, // 默认 gas price 一般用不到
      nonce: -1
    };
  }
}
