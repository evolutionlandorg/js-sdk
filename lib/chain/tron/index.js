"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tronweb2 = _interopRequireDefault(require("tronweb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function createTronweb() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _tronweb = _getTronweb(config);

  if (config.address) {
    _tronweb.setAddress(config.address);
  }

  return _tronweb;
}

function _getTronweb(config) {
  if (config && config.fullHost) {
    return new _tronweb2["default"](config);
  }

  if (window.tronWeb) {
    return window.tronWeb;
  }
}

var _default = {
  createTronweb: createTronweb
};
exports["default"] = _default;