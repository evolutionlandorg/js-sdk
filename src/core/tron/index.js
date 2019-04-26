import TronWeb from "tronweb";
import to from "await-to-js";
import isObject from "lodash/isObject";
import { CONF_CONTRACT_STATUS_MAIN } from "../../config";
import Utils from "./utils";
import IteringId from "../iteringid";

export default class Tron extends Utils {
  static TronWeb = TronWeb;
  constructor({ status, isIteringId, blockchain, languge }) {
    super(status, isIteringId);

    this.fee_limit =
      status === CONF_CONTRACT_STATUS_MAIN ? 50000000 : 100000000; // 测试网络 100 trx ： 主网 50trx
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
   * 通过tx获取
   * 轮询回调
   */
  getTransaction(tid, success, fail) {
    let timer;
    this.instance &&
      this.instance.trx
        .getTransaction(tid)
        .then(res => {
          const { ret } = res;
          if (!ret) {
            clearTimeout(timer);
            timer = setTimeout(() => {
              this.getTransaction(tid, success, fail);
            }, 500);
          } else {
            if (Array.isArray(ret) && ret.length) {
              if (ret[0].contractRet === "SUCCESS") {
                success && success(res);
              } else if (ret[0].contractRet === "OUT_OF_ENERGY") {
                fail && fail("OUT_OF_ENERGY");
              } else if (ret[0].contractRet === "OUT_OF_BANDWITH") {
                fail && fail("OUT_OF_BANDWITH");
              } else {
                fail && fail(res);
              }
            }
          }
        })
        .catch(() => {
          this.getTransaction(tid, success, fail);
        });
  }

  getEventByTransactionID(txid) {
    return this.instance.getEventByTransactionID(txid);
  }

  getTransactionCallBackInfo(
    { transactionHash, eventName, amountName },
    { success, fail }
  ) {
    this.getEventByTransactionID(transactionHash)
      .then(({ code, data }) => {
        if (code === 0) {
          if (Array.isArray(data)) {
            const items = data.filter(item => item.event_name === eventName);
            if (items && items.length) {
              const total = items.reduce((all, currentValue) => {
                return all + +currentValue.result[amountName];
              }, 0);
              success({ amount: total });
            } else {
              fail && fail(data);
            }
          } else {
            success({ amount: 0 });
          }
          return;
        } else {
          success({ amount: 0 });
        }
      })
      .catch(err => {
        fail && fail(err);
      });
  }

  // 动态检测钱包环境
  async runtimeValidate() {
    this._initTronWeb();
    this.validNetWork = true;
    if (!this.isInstalled()) {
      this.installed = false;
      return -1; // 未安装
    } else if (!this.isUnlocked()) {
      this.wallet = "";
      this.base64Wllet = "";
      return -2; // 未解锁
    } else if (!(await this.detectNetWork())) {
      this.validNetWork = false;
      return -3; // 错误的网络
    }
    return 1;
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

  async _triggerIteringIdMethod({
    wallet,
    function_selector,
    parameter,
    tokenAddr,
    tokenId,
    value = 0,
    onTransactionHash = () => {},
    onSuccess = () => {},
    onFail = () => {},
    onError = () => {},
    callback = () => {}
  }) {
    const self = this;
    this.instance.transactionBuilder
      .triggerSmartContract(
        tokenAddr,
        function_selector,
        this.fee_limit,
        +Math.ceil(this.toSun(value)),
        parameter,
        this.instance.address.toHex(wallet)
      )
      .then(({ transaction }) => {
        this.iteringId.onTransaction({
          message: {
            rlp: transaction,
            address: wallet,
            callback: this.blockConfig.CONF_ITERING_CALLBACK
          },
          callback,
          afterGetSignature
        });
      });

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
  }

  async _triggerWalletPluginMethod({
    token,
    function_selector,
    params,
    fee_limit,
    tokenAddr,
    tokenId,
    value = 0,
    onTransactionHash = () => {},
    onSuccess = () => {},
    onFail = () => {},
    onError = () => {}
  }) {
    return token[function_selector](...params)
      .send({
        feeLimit: fee_limit,
        callValue: Math.ceil(+this.toSun(value)),
        shouldPollResponse: false
      })
      .then(hash => {
        this.agent.apiCallbaclTransaction({
          tx: hash,
          to: tokenAddr,
          token_id: tokenId || "",
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
      .catch(e => {
        console.log(e);
        if (e && typeof e === "string") {
          if (e.indexOf("CONTRACT_VALIDATE_ERROR") > -1) {
            onError &&
              onError({
                message: "CONTRACT_VALIDATE_ERROR",
                error: e
              });
          }
          if (e.indexOf("BANDWITH_ERROR") > -1) {
            onError &&
              onError({
                message: "BANDWITH_ERROR",
                error: e
              });
          }
          if (e.indexOf("ENERGY_ERROR") > -1) {
            onError &&
              onError({
                message: "ENERGY_ERROR",
                error: e
              });
          }
        } else if (e && isObject(e)) {
          if (e.error === "CONTRACT_VALIDATE_ERROR") {
            onError &&
              onError({
                message: "CONTRACT_VALIDATE_ERROR",
                error: e
              });
          }
          if (e.error === "BANDWITH_ERROR") {
            onError &&
              onError({
                message: "BANDWITH_ERROR",
                error: e
              });
          }
          if (e.error === "ENERGY_ERROR") {
            onError &&
              onError({
                message: "ENERGY_ERROR",
                error: e
              });
          }
        } else {
          onError &&
            onError({
              message: "",
              error: e
            });
        }
      });
  }

  // 合约交互的方法
  // 如果是调用网页钱包，可以考虑在该方法之前调用 runtimeValidate 方法验证是否是可交互环境
  triggerContractMethod({
    wallet = this.wallet,
    tokenAddr,
    methodName,
    methodParams = [],
    value = 0,
    tokenId = ""
  }) {
    return async ({
      callback,
      onSendBefore,
      onTransactionHash,
      onSuccess,
      onFail,
      onError
    }) => {
      // 生成合约方法
      const result = await this.createContract(tokenAddr);
      // const func = result.default.methods[methodName].apply(this, methodParams);
      const { function_selector, parameter } = this.getContractMethodsParams(
        methodName,
        methodParams,
        result.default.abi
      );
      // 开始交互
      onSendBefore && onSendBefore();

      if (this.isIteringId) {
        this._triggerIteringIdMethod({
          wallet,
          function_selector,
          parameter,
          tokenAddr,
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

        let err, code;
        [err, code] = await to(this.runtimeValidate());
        if (err) {
          onError && onError(err);
          throw new Error(err);
        }
        if (code !== 1) {
          return code;
        }

        this._triggerWalletPluginMethod({
          token: result.default,
          function_selector,
          params: methodParams,
          fee_limit: this.fee_limit,
          tokenAddr,
          tokenId,
          value,
          onTransactionHash,
          onSuccess,
          onFail,
          onError
        });
      }
    };
  }

  _getSignWithchallenge(wallet) {
    const param = wallet ? { wallet } : "";
    return new Promise((resolve, reject) => {
      this.agent.apiChallenge(param).then(res => {
        const { code, data, name } = res;
        if (code === 0) {
          this.instance.trx
            .sign(this.sha3(`${name} ${data}`))
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
