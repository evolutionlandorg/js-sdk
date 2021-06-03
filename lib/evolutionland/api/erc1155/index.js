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

var Erc1155Api = {
  /**
   * Check if uniswap has sufficient transfer authority
   * @param {*} tokenAddressOrType
   * @param {*} account
   */
  erc1155IsApprovedForAll: function erc1155IsApprovedForAll(owner, operator, contractAddress) {
    var _arguments = arguments,
        _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var callback;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              callback = _arguments.length > 3 && _arguments[3] !== undefined ? _arguments[3] : {};
              return _context.abrupt("return", _this.callContract({
                methodName: "isApprovedForAll",
                abiKey: contractAddress,
                abiString: _this.ABIs["erc1155"].abi,
                contractParams: [owner, operator]
              }, callback));

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  erc1155SetApprovalForAll: function erc1155SetApprovalForAll(operator, approved, contractAddress) {
    var _arguments2 = arguments,
        _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var callback;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              callback = _arguments2.length > 3 && _arguments2[3] !== undefined ? _arguments2[3] : {};
              return _context2.abrupt("return", _this2.triggerContract({
                methodName: "setApprovalForAll",
                abiKey: contractAddress,
                abiString: _this2.ABIs["erc1155"].abi,
                contractParams: [operator, approved]
              }, callback));

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }
};
var _default = Erc1155Api;
exports["default"] = _default;