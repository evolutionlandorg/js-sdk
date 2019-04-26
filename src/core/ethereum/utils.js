import Base from "./base";
import isString from "lodash/isString";
import isObject from "lodash/isObject";
import isNumber from "lodash/isNumber";
import isInteger from "lodash/isInteger";
import { banance2currency } from "../../tools";

export default class Tools extends Base {
  constructor(status, isIteringId) {
    super(status, isIteringId);
    this.gaslimitCache = {};
  }
  sha3 = data => {
    return this.instance && this.instance.utils.sha3(data);
  };
  /**
   * 是否是以太坊地址
   */
  isAddress(address) {
    return this.instance && this.instance.utils.isAddress(address);
  }

  toTwosComplement(str, number) {
    return isInteger(number)
      ? this.instance &&
          this.instance.utils.toTwosComplement(str).substring(number)
      : this.instance && this.instance.utils.toTwosComplement(str);
  }

  padLeft(str, number = 64) {
    return this.instance && this.instance.utils.padLeft(str, number);
  }
  paddStartHex64(str) {
    return this.padLeft(str).substring(2);
  }
  /**
   * 16进制
   */
  toHex(num) {
    return this.instance && this.instance.utils.toHex(num);
  }

  toWei(num) {
    return this.instance && this.instance.utils.toWei(`${num}`, "ether");
  }

  fromWei(num) {
    if (!isNumber(+num)) throw new Error("Invalid parameter");
    return banance2currency(num);
  }

  hexToNumberString(hex) {
    return this.instance && this.instance.utils.hexToNumberString(hex);
  }

  /**
   * 获取交易成功后的值
   */
  encodeEventSignature(eventName) {
    if (!isObject(eventName) && !isString(eventName))
      throw new Error("Invalid parameter");

    return (
      this.instance && this.instance.eth.abi.encodeEventSignature(eventName)
    );
  }

  /**
   * 生成data
   */
  createABIdata(func) {
    return func.encodeABI();
  }
}
