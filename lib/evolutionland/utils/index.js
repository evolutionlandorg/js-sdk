"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _web = _interopRequireDefault(require("web3"));

var _tronweb = _interopRequireDefault(require("tronweb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function toHexAndPadLeft(o) {
  return _web["default"].utils.padLeft(_web["default"].utils.toHex(o), 64, '0');
}

function decodeBase58Address(base58Sting) {
  return _tronweb["default"].address.toHex(base58Sting);
}

function pad0x(str) {
  if (str.substring(0, 2) === '0x') {
    return str;
  }

  return '0x' + str;
}

var _default = _objectSpread({
  toHexAndPadLeft: toHexAndPadLeft,
  decodeBase58Address: decodeBase58Address,
  pad0x: pad0x
}, _web["default"].utils);

exports["default"] = _default;