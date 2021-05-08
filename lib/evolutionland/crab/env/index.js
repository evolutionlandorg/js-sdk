"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Env = Env;
exports.getABIConfig = getABIConfig;

var _dev = _interopRequireDefault(require("./dev"));

var _prod = _interopRequireDefault(require("./prod"));

var _abi = _interopRequireDefault(require("./abi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Env(env) {
  switch (env) {
    case 'crab':
      return _dev["default"];

    case 'main':
      return _prod["default"];

    default:
      return;
  }
}

function getABIConfig(env) {
  return (0, _abi["default"])(env);
}