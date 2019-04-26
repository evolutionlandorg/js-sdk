import TronWeb from "tronweb";
import * as ethjsUnit from "ethjs-unit";
import BN from "bn.js";
import Base from "./base";
import isInteger from "lodash/isInteger";
import numberToBN from "number-to-bn";
import { banance2currency } from "../../tools";

export default class Tools extends Base {
  constructor(status, isIteringId) {
    super(status, isIteringId);

    this.gaslimitCache = {};
    this.contractCache = {};
  }
  isBN = object => {
    return (
      object instanceof BN ||
      (object && object.constructor && object.constructor.name === "BN")
    );
  };
  toBN = number => {
    try {
      return numberToBN(number);
    } catch (error) {
      throw new Error(`${error} Given value: "${number}"`);
    }
  };

  leftPad = (string, chars, sign) => {
    const hasPrefix = /^0x/i.test(string) || typeof string === "number";
    string = string.toString(16).replace(/^0x/i, "");
    const padding =
      chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;
    return (
      (hasPrefix ? "0x" : "") + new Array(padding).join(sign || "0") + string
    );
  };

  getContractMethodsParams(methodName, params, json) {
    const result = json.filter(item => {
      if (Array.isArray(item.inputs)) {
        return (
          (item.type === "Function" || item.type === "function") &&
          item.name === methodName &&
          item.inputs.length === params.length
        );
      }
      return (
        (item.type === "Function" || item.type === "function") &&
        item.name === methodName
      );
    })[0];

    let function_selector;
    let parameter;

    if (Array.isArray(result.inputs)) {
      const types = result.inputs.reduce((total, item) => {
        return total + item.type + ",";
      }, "");
      function_selector = `${methodName}(${types.substring(
        0,
        types.length - 1
      )})`;

      parameter = params.map((item, index) => {
        const obj = {};
        obj.type = result.inputs[index].type;
        obj.value = item;
        return obj;
      });
    } else {
      function_selector = `${methodName}()`;
      parameter = [];
    }
    return {
      function_selector,
      parameter
    };
  }

  // 是否安装tron
  isInstalled() {
    return !!window.tronWeb;
  }

  // 是否解锁tron
  isUnlocked() {
    return window.tronWeb && window.tronWeb.ready;
  }

  // 网络是否正确
  // 根据目前遇到的三种情况写了几种兼容
  detectNetWork() {
    return new Promise(resolve => {
      const { eventServer } = this.instance || {};
      const { host } = eventServer || {};
      // 如果有host的情况下，优先判断host
      if (host) {
        // 未登录时，host为127.0.0.1
        const isHostTrue =
          ["https://api.shasta.trongrid.io", "https://api.trongrid.io"].indexOf(
            host
          ) > -1;
        if (isHostTrue) {
          resolve(host === this.blockConfig.CONF_NETWORK ? true : false);
        }
        resolve(false);
      } else if (this.instance && this.instance.trx) {
        // 方法二。根据p2pVersion判断
        if (this.instance.trx.getNodeInfo) {
          this.instance.trx.getNodeInfo().then(res => {
            const { configNodeInfo } = res || {};
            const { p2pVersion } = configNodeInfo || {};
            if (p2pVersion === this.blockConfig.CONF_NETWORK_NODE) {
              resolve(true);
            }
            resolve(false);
          });
        } else if (this.instance.trx.getContract) {
          // 方法三。根据已部署的合约判断
          this.instance.trx
            .getContract(this.blockConfig.CONF_TOKEN_RING)
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              resolve(false);
            });
        }
      }
      resolve(false);
    });
  }

  sha3(data) {
    return TronWeb.sha3(data, true);
  }

  toTwosComplement(str, number) {
    const toTwosComplement = () =>
      `0x${this.toBN(str)
        .toTwos(256)
        .toString(16, 64)}`;
    return isInteger(number)
      ? toTwosComplement(str).substring(number)
      : toTwosComplement(str);
  }

  padLeft(str, number = 64) {
    return this.leftPad(str, number);
  }

  paddStartHex64(str) {
    return this.padLeft(str).substring(2);
  }
  /**
   * 16进制
   */
  toHex(num) {
    return TronWeb.toHex(num);
  }

  /**
   * 10的18次方
   */
  toWei(number) {
    return this.isBN(number)
      ? ethjsUnit.toWei(number, "ether")
      : ethjsUnit.toWei(number, "ether").toString(10);
  }

  hexToNumberString = value => {
    if (!value) return value;
    return this.toBN(value).toString(10);
  };

  fromHex(address) {
    return TronWeb.address.fromHex(address);
  }
  toHexAddress(address) {
    return TronWeb.address.toHex(address);
  }
  toSun(num) {
    return TronWeb.toSun(num);
  }

  fromSun(num) {
    return TronWeb.fromSun(num);
  }

  toDecimal(hex) {
    let num = "0";
    if (typeof hex === "string") {
      try {
        num = banance2currency(this.tron.toDecimal(hex)) || "0";
      } catch {}
    }
    return num;
  }

  /**
   * 是否是地址
   */
  isAddress(address) {
    return TronWeb.isAddress(address);
  }

  toCurrency(num) {
    return TronWeb.fromSun(num);
  }
}
