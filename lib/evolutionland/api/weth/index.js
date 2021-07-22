"use strict";

require("core-js/modules/es.parse-int.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sdk = require("@uniswap/sdk");

var WethApi = {
  wethGetToken: function wethGetToken() {
    return new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_WETH, 18, 'WHT', "Wrapped HT");
  }
};
var _default = WethApi;
exports["default"] = _default;