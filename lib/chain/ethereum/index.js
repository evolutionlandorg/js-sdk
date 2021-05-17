"use strict";

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime.js");

var _web = _interopRequireDefault(require("web3"));

var _detectProvider = _interopRequireDefault(require("@metamask/detect-provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function createWeb3js() {
  return _createWeb3js.apply(this, arguments);
}

function _createWeb3js() {
  _createWeb3js = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var config,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            config = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
            _context.next = 3;
            return _getWeb3js(config.provider);

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createWeb3js.apply(this, arguments);
}

function _getWeb3js(_x) {
  return _getWeb3js2.apply(this, arguments);
}

function _getWeb3js2() {
  _getWeb3js2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(provider) {
    var web3Provider, _provider;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!provider) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", new _web["default"](provider));

          case 4:
            _context2.next = 6;
            return (0, _detectProvider["default"])();

          case 6:
            _provider = _context2.sent;

            if (!_provider) {
              _context2.next = 11;
              break;
            }

            web3Provider = _provider;
            _context2.next = 12;
            break;

          case 11:
            throw 'chain::ethereum: missing web3 provider';

          case 12:
            return _context2.abrupt("return", new _web["default"](web3Provider));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getWeb3js2.apply(this, arguments);
}

var _default = {
  createWeb3js: createWeb3js
};
exports["default"] = _default;