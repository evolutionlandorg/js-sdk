"use strict";

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime.js");

var _index = _interopRequireDefault(require("../../utils/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var FurnaceApi = {
  /**
   * buy lucky box
   * @param {*} to - the recipient of lucky box
   * @param {*} goldBoxAmount - gold box amount
   * @param {*} silverBoxAmount - silver box amount
   */
  buyFurnaceTreasure: function buyFurnaceTreasure(to) {
    var _arguments = arguments,
        _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var goldBoxAmount, silverBoxAmount, callback, treasurePrice, cost;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              goldBoxAmount = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : 0;
              silverBoxAmount = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : 0;
              callback = _arguments.length > 3 ? _arguments[3] : undefined;
              _context.next = 5;
              return _this.getFurnaceTreasurePrice();

            case 5:
              treasurePrice = _context.sent;
              cost = _index["default"].toBN(treasurePrice.priceGoldBox).muln(goldBoxAmount).add(_index["default"].toBN(treasurePrice.priceSilverBox).muln(silverBoxAmount));
              return _context.abrupt("return", _this.triggerContract({
                methodName: "buyBox",
                abiKey: _this.ABIs["itemTreasure"].address,
                abiString: _this.ABIs["drillLuckyBoxV2"].abi,
                contractParams: [to, goldBoxAmount, silverBoxAmount, cost.toString(10)],
                sendParams: {
                  value: 0
                }
              }, callback));

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }
};
var _default = FurnaceApi;
exports["default"] = _default;