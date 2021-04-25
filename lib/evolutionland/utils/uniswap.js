"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sdk = require("@uniswap/sdk");

function calculateSlippageAmount(value, slippage) {
  if (slippage < 0 || slippage > 10000) {
    throw Error("Unexpected slippage value: ".concat(slippage));
  }

  return [_sdk.JSBI.divide(_sdk.JSBI.multiply(value, _sdk.JSBI.BigInt(10000 - slippage)), _sdk.JSBI.BigInt(10000)), _sdk.JSBI.divide(_sdk.JSBI.multiply(value, _sdk.JSBI.BigInt(10000 + slippage)), _sdk.JSBI.BigInt(10000))];
}

var _default = {
  calculateSlippageAmount: calculateSlippageAmount
};
exports["default"] = _default;