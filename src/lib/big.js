import { BigNumber } from "bignumber.js";

// 截取
const format = {
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: " ",
  fractionGroupSize: 0
};
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN, FORMAT: format });

function transformNumber(obj) {
  return obj.toString();
}

function toString(num) {
  return `${num}`;
}

export function toFixed(num, digit = 8) {
  return new BigNumber(toString(num)).toFixed(digit);
}

/**
 * 加法
 */
export function plus(num1, num2) {
  const x = new BigNumber(toString(num1));
  return transformNumber(x.plus(toString(num2)));
}

/**
 * 减法
 */
export function minus(num1, num2) {
  const x = new BigNumber(toString(num1));
  return transformNumber(x.minus(toString(num2)));
}

/**
 * 除法
 */
export function div(num1, num2) {
  const result = new BigNumber(toString(num1)).div(toString(num2));
  return transformNumber(result);
}

/**
 * 乘法
 */
export function multiply(num1, num2) {
  const x = new BigNumber(toString(num1));
  return transformNumber(x.multipliedBy(toString(num2)));
}

export function pow(num1, num2) {
  const x = new BigNumber(toString(num1));
  return transformNumber(x.exponentiatedBy(toString(num2)));
}

export function toFormat(num1) {
  const x = new BigNumber(toString(num1));
  return x.toFormat();
}
