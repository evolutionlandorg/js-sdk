"use strict";

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime.js");

var _index = _interopRequireDefault(require("../../utils/index"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var FurnaceV1Api = {
  /**
   * get furnace treasure price
   * @returns {} - promise -> {0: "1026000000000000000000", 1: "102000000000000000000", priceGoldBox: "1026000000000000000000", priceSilverBox: "102000000000000000000"}
   */
  getFurnaceTreasurePrice: function getFurnaceTreasurePrice() {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _contract;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this._tronweb.contract().at(_this.getContractAddress('itemTreasure'));

            case 2:
              _contract = _context.sent;
              return _context.abrupt("return", _contract.methods.getPrice().call());

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  getFurnaceTakeBackNonce: function getFurnaceTakeBackNonce(address) {
    var _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var _contract;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this2._tronweb.contract().at(_this2.getContractAddress('itemTakeBack'));

            case 2:
              _contract = _context2.sent;
              return _context2.abrupt("return", _contract.methods.userToNonce(address).call());

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },

  /**
   * buy lucky box
   * @param {*} goldBoxAmount - gold box amount
   * @param {*} silverBoxAmount - silver box amount
   */
  buyFurnaceTreasure: function buyFurnaceTreasure() {
    var _arguments = arguments,
        _this3 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var goldBoxAmount, silverBoxAmount, callback, treasurePrice, cost, data;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              goldBoxAmount = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : 0;
              silverBoxAmount = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : 0;
              callback = _arguments.length > 2 ? _arguments[2] : undefined;
              _context3.next = 5;
              return _this3.getFurnaceTreasurePrice();

            case 5:
              treasurePrice = _context3.sent;
              cost = _index["default"].toBN(treasurePrice.priceGoldBox).muln(goldBoxAmount).add(_index["default"].toBN(treasurePrice.priceSilverBox).muln(silverBoxAmount)); // Function: transfer(address _to, uint256 _value, bytes _data) ***
              // data
              // 0000000000000000000000000000000000000000000000000000000000000001 gold box amount
              // 0000000000000000000000000000000000000000000000000000000000000002 silver box amount

              data = _index["default"].toTwosComplement(goldBoxAmount) + _index["default"].toTwosComplement(silverBoxAmount).substring(2, 66);
              return _context3.abrupt("return", _this3.triggerContract({
                methodName: _this3.ERC20TRANSFERMETHOD,
                abiKey: "ring",
                abiString: _this3.ABIs["ring"].abi,
                contractParams: [_this3.ABIs["itemTreasure"].address, cost.toString(10), data],
                sendParams: {
                  value: 0
                }
              }, callback));

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  },

  /**
   *  open furnace treasure
   * @returns {Promise<PromiEvent<any>>}
   */
  openFurnaceTreasure: function openFurnaceTreasure(_ref) {
    var boxIds = _ref.boxIds,
        amounts = _ref.amounts,
        hashmessage = _ref.hashmessage,
        v = _ref.v,
        r = _ref.r,
        s = _ref.s;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // During the process of opening the treasure chest, there is the logic of randomly gifting rings,
    // which leads to inaccurate gas estimation, so manually set it to avoid out of gas.
    // https://etherscan.io/tx/0xe71f54aee8f7ab1dd15df955d09c79af5060f20e91c0c5ecfcf17f20c9bf02b3
    // https://etherscan.io/tx/0x7b04df9b55f33b6edcc402a5733dbc753a6bbe2f78af7c7bef6f3f4d8dce7491
    // no return ring - gas used - 229,289
    // https://etherscan.io/tx/0x4e1fc1dcec64bb497405126e55ab743368f1cb1cede945936937e0cde1d254e7
    // prize ring - gas used - 254,776
    // https://etherscan.io/tx/0xd2b3f05b19e74627940edfe98daee31eeab84b67e88dcf0e77d595430b3b1afc
    var chainGasLimit = {
      // ethereum - mainnet
      "1": {
        silver: new _bignumber["default"](260000),
        gold: new _bignumber["default"](300000)
      },
      // ethereum - ropsten
      "3": {
        silver: new _bignumber["default"](350000),
        gold: new _bignumber["default"](400000)
      },
      // heco - mainnet
      "256": {
        silver: new _bignumber["default"](350000),
        gold: new _bignumber["default"](400000)
      },
      // heco - testnet
      "128": {
        silver: new _bignumber["default"](350000),
        gold: new _bignumber["default"](400000)
      },
      // tron - shasta 30trx
      "tron-1": {
        silver: new _bignumber["default"](30000000),
        gold: new _bignumber["default"](30000000)
      },
      // tron - mainnet 30trx
      "tron-11111": {
        silver: new _bignumber["default"](30000000),
        gold: new _bignumber["default"](30000000)
      }
    };
    var silverBoxGasLimit = chainGasLimit[this.env.CONTRACT.NETWORK].silver;
    var goldBoxGasLimit = chainGasLimit[this.env.CONTRACT.NETWORK].gold;
    var gasLimit = new _bignumber["default"](amounts[0]).lt("1000000000000000000000") ? silverBoxGasLimit : goldBoxGasLimit;

    if (amounts.length > 1) {
      for (var index = 1; index < amounts.length; index++) {
        var amount = amounts[index];
        gasLimit = gasLimit.plus(new _bignumber["default"](amount).lt("1000000000000000000000") ? silverBoxGasLimit : silverBoxGasLimit);
      }
    }

    return this.triggerContract({
      methodName: "openBoxes",
      abiString: this.ABIs["itemTakeBack"].abi,
      contractParams: [boxIds, amounts, hashmessage, v, r, s],
      sendParams: {
        value: 0
      },
      abiKey: "itemTakeBack",
      gasLimit: gasLimit.toFixed(0)
    }, callback);
  },
  checkFurnaceTreasureStatus: function checkFurnaceTreasureStatus(id) {
    var _this4 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var _contract;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _this4._tronweb.contract().at(_this4.getContractAddress('itemTakeBack'));

            case 2:
              _contract = _context4.sent;
              return _context4.abrupt("return", _contract.methods.ids(id).call());

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }))();
  }
};
var _default = FurnaceV1Api;
exports["default"] = _default;