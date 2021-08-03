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
  erc20Allowance: function erc20Allowance(tokenAddressOrType, spender, from) {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var token, erc20Contract, allowanceAmount;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = from;

              if (_context.t0) {
                _context.next = 5;
                break;
              }

              _context.next = 4;
              return _this.getCurrentAccount();

            case 4:
              _context.t0 = _context.sent;

            case 5:
              from = _context.t0;
              token = _this.getContractAddress(tokenAddressOrType);
              erc20Contract = new _this._web3js.eth.Contract(_this.ABIs["ring"].abi, token);
              _context.next = 10;
              return erc20Contract.methods.allowance(from, spender).call();

            case 10:
              allowanceAmount = _context.sent;
              return _context.abrupt("return", allowanceAmount);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  erc20Approve: function erc20Approve(tokenAddressOrType, spender) {
    var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var token = this.getContractAddress(tokenAddressOrType);
    return this.triggerContract({
      methodName: "approve",
      abiKey: token,
      abiString: this.ABIs["ring"].abi,
      contractParams: [spender, value]
    }, callback);
  }
};
var _default = Erc20Api;
exports["default"] = _default;