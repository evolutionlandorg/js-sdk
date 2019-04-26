import to from "await-to-js";
import EthereumTx from "ethereumjs-tx";
import Utils from "./utils";
import IteringId from "../iteringid";

export default class Ethereum extends Utils {
  constructor({ status, isIteringId, blockchain, languge }) {
    super(status, isIteringId);
    // 定义itering id
    this.iteringId = new IteringId({
      agent: this.agent,
      sha3: this.sha3,
      blockchain,
      status,
      languge
    });
  }

  /**
   * 通过tx获取是否成功完成合约
   * @param {string} tid  交易hash值
   * @param {function} success 成功回调
   * @param {function} fail 失败回调   *
   */
  getTransaction(tid, success, fail) {
    this.instance &&
      this.instance.eth.getTransactionReceipt(tid).then(res => {
        if (!res) {
          setTimeout(() => {
            this.getTransaction(tid, success, fail);
          }, 1000);
        } else {
          const { blockNumber, status } = res;
          if (!blockNumber) {
            setTimeout(() => {
              this.getTransaction(tid, success, fail);
            }, 1000);
          } else {
            this.instance.eth.getBlockNumber().then(number => {
              if (number - blockNumber < 1) {
                setTimeout(() => {
                  this.getTransaction(tid, success, fail);
                }, 1000);
              } else {
                if (status) {
                  success && success(res);
                } else {
                  fail && fail(res);
                }
              }
            });
          }
        }
      });
  }

  /**
   * 改方法的参数
   * @param contractSendBackResponse 合约交互后的返回值，里面如果没有logs属性的话，默认错误
   * @param address 合约地址
   * @param eventName 事件名称
   */
  getTransactionCallBackInfo(
    { contractSendBackResponse = {}, address = "", eventName = "" },
    { success, fail }
  ) {
    const { logs } = contractSendBackResponse;
    if (!logs) throw new Error("Invalid parameter");

    let isSuccess = false;
    let successEvents = [];

    if (Array.isArray(logs) && logs.length) {
      const filterLogs = logs.filter(
        item => item.address.toLowerCase() === address.toLowerCase()
      );
      if (filterLogs.length) {
        filterLogs.map(item => {
          const topics = item.topics;
          if (Array.isArray(topics) && topics.length) {
            const data = topics[0];
            if (data === this.encodeEventSignature(eventName)) {
              successEvents.push(item);
            }
          }
          return item;
        });
      }
    }
    if (successEvents.length) {
      isSuccess = true;
      success && success(successEvents);
    }

    if (!isSuccess) {
      fail && fail();
    }
  }

  // 动态检测钱包环境
  async runtimeValidate() {
    let err,
      account = "",
      network = "";

    if (!this.isInstalled()) {
      this.installed = false;
      return -1; // 未安装
    } else {
      [err, account] = await to(this.getAccounts());

      // 账户锁定
      if (!Array.isArray(account) || account.length === 0) {
        this.wallet = "";
        return -2;
      }
      if (err) throw new Error(err);

      [err, network] = await to(this.getNetWork());
      // 网络错误
      if (String(network) !== this.blockConfig.CONF_NETWORK) {
        this.validNetWork = false;
        return -3; // 网络错误
      }
      if (err) throw new Error(err);
    }
    // success
    this.validNetWork = true;
    this.wallet = account[0];
    this.installed = true;
    // 成功返回
    return 1;
  }

  // metamask 特有的方法
  async validateMetamaskPrivacy() {
    let err,
      account = "";
    if (window.ethereum) {
      [err, account] = await to(window.ethereum.enable());
      if (!Array.isArray(account) || account.length === 0) {
        this.wallet = "";
        return false;
      }
      if (err) throw new Error(err);
    }
    this.wallet = account[0];
    return true;
  }

  /**
   * 静态环境检测，由于环境变化的可能性大
   * 建议在关键合约交互时用runtimeValidate
   */
  staticValidate() {
    if (!this.installed) return -1;
    if (!this.wallet) return -2;
    if (!this.validNetWork) return -3;
    return 1;
  }

  /**
   * @abstract 获得 gas 费用
   * @param {function} contractMethod 合约方法
   * @param {number} gasLimit 默认 gas limit
   * @param {bool} force 是否强制使用默认gas limit
   * @param {number} addLimit 防止gas limit 计算的值不足，额外添加，默认 100000 *
   * @param {number}  defultGasLimit 如果计算gas limit 失败，使用默认gas limit
   */
  async _getGas({
    wallet,
    contractMethod,
    addGasLimit = 200000,
    defultGasLimit = 600000,
    force = false
  }) {
    if (this.gaslimitCache[contractMethod]) {
      return this.gaslimitCache[contractMethod];
    }
    const gas_limit = await this._getGasLimit({
      contractMethod,
      wallet,
      addGasLimit,
      defultGasLimit,
      force
    });

    const gasPrice = await this._getGasPrice(wallet);

    const result = (this.gaslimitCache[contractMethod] = {
      gas_limit,
      gas_price: gasPrice.gas_price.standard,
      nonce: gasPrice.nonce
    });

    return result;
  }

  /**
   * for itering id
   */
  _createEthereumTx({ wallet = this.wallet, to, value = 0 }) {
    return txParams => {
      const eth = this.toHex(this.toWei(value));
      return new Promise(resolve => {
        const resultTxParams = {
          ...txParams,
          to,
          value: eth
        };
        const tx = new EthereumTx(resultTxParams);
        const result = {
          rlp: tx.serialize().toString("hex"),
          address: wallet,
          callback: this.blockConfig.CONF_ITERING_CALLBACK
        };
        resolve(result);
      });
    };
  }

  async _triggerIteringIdMethod({
    gas_limit,
    gas_price,
    tokenAddr,
    nonce,
    value = 0,
    wallet = this.wallet,
    method,
    tokenId,
    onTransactionHash = () => {},
    onSuccess = () => {},
    onFail = () => {},
    onError = () => {},
    callback = () => {}
  }) {
    const self = this;
    const data = method ? this.createABIdata(method) : "";
    const txParams = {
      nonce: nonce,
      gasPrice: gas_price,
      gasLimit: gas_limit,
      from: wallet,
      data,
      chainId: +this.blockConfig.CONF_NETWORK
    };

    let err, result;
    [err, result] = await to(
      this._createEthereumTx(wallet, tokenAddr, value)(txParams)
    );
    if (err) {
      onError && onError();
      throw new Error(err);
    }

    function afterGetSignature(data) {
      const { tx_id } = data;
      onTransactionHash && onTransactionHash(tx_id);

      //  回调给后端
      self.agent.apiCallbaclTransaction({
        tx: tx_id,
        to: tokenAddr,
        token_id: tokenId || "",
        nonce: -1
      });
      self.getTransaction(
        tx_id,
        res => {
          onSuccess({
            ...res,
            hash: tx_id
          });
        },
        () => {
          onFail({
            hash: tx_id
          });
        }
      );
    }

    if (result) {
      // 需要介入itering id 的某些操作，后续添加
      this.iteringId.onTransaction({
        message: result,
        callback,
        afterGetSignature
      });
    }
  }

  async _triggerWalletPluginMethod({
    func,
    wallet,
    gas_limit,
    tokenAddr,
    takenId,
    value = 0,
    onSuccess = () => {},
    onFail = () => {},
    onError = () => {},
    onTransactionHash = () => {}
  }) {
    /**
     * fix web3 52 版本 payable 问题
     */
    let data = { from: wallet, gas: gas_limit };
    if (+value > 0) {
      data = Object.assign({}, data, { value: this.toWei(value) });
    }

    return func
      .send(data)
      .on("transactionHash", hash => {
        this.agent.apiCallbaclTransaction({
          tx: hash,
          to: tokenAddr,
          token_id: takenId || "",
          nonce: -1
        });
        onTransactionHash && onTransactionHash(hash);
        this.getTransaction(
          hash,
          res => {
            onSuccess({
              ...res,
              hash
            });
          },
          () => {
            onFail({
              hash
            });
          }
        );
      })
      .on("error", onError);
  }

  // 合约交互
  // 如果是调用网页钱包，可以考虑在该方法之前调用 runtimeValidate 方法验证是否是可交互环境
  triggerContractMethod({
    wallet = this.wallet,
    tokenABI,
    tokenAddr,
    methodName,
    methodParams = [],
    value = 0,
    tokenId = "",
    defultGasLimit,
    force = false // 一般不用改
  }) {
    return async ({
      callback,
      onSendBefore,
      onTransactionHash,
      onSuccess,
      onFail,
      onError
    }) => {
      let err, gas_limit;
      // 生成合约方法
      const result = await this.createContract({
        tokenABI,
        tokenAddr
      });

      const func = result.default.methods[methodName].apply(this, methodParams);
      // 开始交互
      onSendBefore && onSendBefore();

      // 如果通过的话。则获取gas limit
      [err, gas_limit] = await to(
        this._getGasLimit({
          contractMethod: func,
          wallet,
          defultGasLimit,
          func,
          force
        })
      );
      if (err) {
        onError && onError();
        throw new Error(err);
      }

      if (this.isIteringId) {
        let err, gasPrice;
        [err, gasPrice] = await to(this._getGasPrice(wallet));
        if (err) {
          onError && onError();
          throw new Error(err);
        }

        this._triggerIteringIdMethod({
          gas_limit,
          gas_price: gasPrice.gas_price.standard,
          nonce: gasPrice.gas_price.nonce,
          wallet,
          tokenAddr,
          method: func,
          tokenId,
          value,
          onTransactionHash,
          onSuccess,
          onFail,
          onError,
          callback
        });
      } else {
        // 钱包插件方式
        // 判断是否是可运行的环境
        let err, code, gas_limit;
        [err, code] = await to(this.runtimeValidate());
        if (err) {
          onError && onError();
          throw new Error(err);
        }
        if (code !== 1) {
          return code;
        }

        this._triggerWalletPluginMethod({
          func,
          wallet,
          gas_limit,
          tokenAddr,
          takenId: tokenId || "",
          value,
          onTransactionHash,
          onSuccess,
          onFail,
          onError
        });
      }
    };
  }

  /**
   * 签名
   */
  async _sign({ data, name, wallet }) {
    let signature;
    try {
      signature = await this.instance.eth.personal.sign(
        name + " " + data,
        wallet
      );
    } catch (e) {
      console.log(e);
    }

    return {
      address: wallet,
      signature
    };
  }

  _getSignWithchallenge(wallet) {
    const param = wallet ? { wallet } : "";
    return new Promise((resolve, reject) => {
      this.agent.apiChallenge(param).then(res => {
        const { code, data, name } = res;
        if (code === 0) {
          this.instance.eth.personal
            .sign(name + " " + data, wallet, "")
            .then(signature => {
              if (signature) {
                resolve(signature);
              } else {
                resolve();
              }
            })
            .catch(err => {
              console.log(err);
              reject(err);
            });
        } else {
          resolve();
        }
      });
    });
  }

  // 签名
  async sign(wallet) {
    let err, signature;
    [err, signature] = await to(this._getSignWithchallenge(wallet));
    if (err) {
      console.log(err);
      return;
    }
    if (signature) {
      return this.agent.apiLogin({ wallet, sign: signature });
    }
    return false;
  }
}
