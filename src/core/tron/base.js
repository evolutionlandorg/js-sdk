import TronWeb from "tronweb";
import Agent from "../agent";
import { getCurrentContract } from "../../config/contract";

export default class Base {
  constructor(status, isIteringId) {
    this.isIteringId = isIteringId; // 是否是itering id
    this.status = status; // 主网或者测试网
    this.wallet = ""; // 账户
    this.validNetWork = true; // 网络是否正确
    this.installed = true; // 是否安装
    this.blockConfig = getCurrentContract(status, 2);
    this.contractCache = {}; // 合约数据的缓存

    // 定义ajax
    this.agent = new Agent({ status, blockchain: 2 });

    // 检测账户
    this._detectTronWeb();
  }

  _initTronWeb() {
    if (window.tronWeb) {
      this.instance = this.tron ? this.tron : window.tronWeb;
      this.installed = !!window.tronWeb;
      this.unlocked = window.tronWeb && window.tronWeb.ready;
      const wallet = this.unlocked && window.tronWeb.defaultAddress;
      if (wallet) {
        this.wallet = wallet.base58;
        this.base64Wllet = wallet.hex;
      }
    }
  }

  _detectTronWeb() {
    if (this.isIteringId) {
      this.instance = new TronWeb(
        getCurrentContract(this.status, 2).CONF_PROVIDER,
        getCurrentContract(this.status, 2).CONF_PROVIDER,
        getCurrentContract(this.status, 2).CONF_PROVIDER
      );
    } else {
      const currentTime = +new Date();
      const detectTronWebWallet = () => {
        let lastedTime = +new Date();
        if (lastedTime - currentTime > 10 * 1000) {
          if (window.tronWeb) {
            clearTimeout(this.timer);
            this._initTronWeb();
          } else {
            this.installed = false;
            this.unlocked = false;
            this.wallet = "";
          }
        } else {
          if (window.tronWeb) {
            clearTimeout(this.timer);
            this._initTronWeb();
          } else {
            this.timer = setTimeout(detectTronWebWallet, 1000);
          }
        }
      };
      detectTronWebWallet();
    }
  }

  // 创建合约
  async createContract(tokenAddr) {
    if (!this.instance) return false;

    let result = {
      tokenAddr
    };
    if (this.contractCache[tokenAddr]) {
      result = {
        ...result,
        default: this.contractCache[tokenAddr]
      };
    } else {
      try {
        result = {
          ...result,
          default: await this.instance.contract().at(tokenAddr)
        };
      } catch (err) {
        console.log(err);
      }
    }

    return (this.contractCache[tokenAddr] = result);
  }
}
