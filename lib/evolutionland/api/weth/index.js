"use strict";

require("core-js/modules/es.parse-int.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sdk = require("@uniswap/sdk");

var WethApi = {
  wethGetToken: function wethGetToken() {
    var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'WEHT';
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Wrapped ether';
    return new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_WETH, 18, symbol, name);
  }
};
var _default = WethApi;
exports["default"] = _default;