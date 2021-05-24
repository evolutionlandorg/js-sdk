"use strict";

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Erc20Api = {
  /**
     * Check if uniswap has sufficient transfer authority
     * @param {*} tokenAddressOrType
     * @param {*} account
     */
  erc20Allowance: function erc20Allowance() {
    var _arguments = arguments,
        _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var tokenAddressOrType, spender, from, token, erc20Contract, allowanceAmount;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              tokenAddressOrType = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : 'ring';
              spender = _arguments.length > 1 ? _arguments[1] : undefined;
              from = _arguments.length > 2 ? _arguments[2] : undefined;
              _context.t0 = from;

              if (_context.t0) {
                _context.next = 8;
                break;
              }

              _context.next = 7;
              return _this.getCurrentAccount();

            case 7:
              _context.t0 = _context.sent;

            case 8:
              from = _context.t0;
              _context.next = 11;
              return _this.getContractAddress(tokenAddressOrType);

            case 11:
              token = _context.sent;
              erc20Contract = new _this._web3js.eth.Contract(_this.ABIs["ring"].abi, token);
              _context.next = 15;
              return erc20Contract.methods.allowance(from, spender).call();

            case 15:
              allowanceAmount = _context.sent;
              return _context.abrupt("return", allowanceAmount);

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }
};
var _default = Erc20Api;
exports["default"] = _default;