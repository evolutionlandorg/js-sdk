import { CONF_DECIMALS } from "./config";
import isNumber from "lodash/isNumber";
import * as big from "./lib/big";

// 余额转换为代币数目
export function banance2currency(value, decimails = CONF_DECIMALS) {
  if (!isNumber(+value)) throw new Error("Invalid parameter");

  return big.div(value, big.pow(10, decimails));
}

// 代币数目转化为余额
export function currency2balance(value, decimails = CONF_DECIMALS) {
  if (!isNumber(+value)) throw new Error("Invalid parameter");

  return Math.floor(big.multiply(value, big.pow(10, decimails)));
}
