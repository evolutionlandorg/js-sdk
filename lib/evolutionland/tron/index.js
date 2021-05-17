"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.date.now.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime.js");

var _env = require("./env");

var _abi3 = require("./env/abi");

var _clientFetch = _interopRequireDefault(require("../utils/clientFetch"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _abiAuction = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-auction"));

var _abiRing = _interopRequireDefault(require("./env/abi/tron/abi-ring"));

var _abiWithdraw = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-withdraw"));

var _abiBank = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-bank"));

var _abiKton = _interopRequireDefault(require("./env/abi/tron/abi-kton"));

var _abiLand = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-land"));

var _abiLottery = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-lottery"));

var _abiRolesUpdater = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-rolesUpdater"));

var _abiLandResource = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-landResource"));

var _abiApostleAuction = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-apostleAuction"));

var _abiTakeBack = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-takeBack"));

var _abiApostleSiring = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-apostleSiring"));

var _abiApostleBase = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-apostleBase"));

var _abiTokenUse = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-tokenUse"));

var _abiSwapBridge = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-swapBridge"));

var _abiLuckyBag = _interopRequireDefault(require("../ethereum/env/abi/ethereum/abi-luckyBag"));

var _abiJustswapExchange = _interopRequireDefault(require("../tron/env/abi/tron/abi-justswapExchange"));

var _index = _interopRequireDefault(require("../utils/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var loop = function loop() {};

var TronEvolutionLand = /*#__PURE__*/function () {
  function TronEvolutionLand(tronweb, network) {
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, TronEvolutionLand);

    this.version = '1.0.0'; // this.methods = methods

    this._tronweb = tronweb;
    this.env = (0, _env.Env)(network);
    this.ABIs = (0, _env.getABIConfig)(network);
    this.option = _objectSpread({
      sign: true,
      address: null
    }, option); // this.clientFetch = new ClientFetch({baseUrl: this.env.ABI_DOMAIN, chainId: 60})
  }
  /**
   * get tronWeb instance default address
   * @param {string} type - "base58"(default) | "hex"
   * @returns {string} empty is undefined
   */


  _createClass(TronEvolutionLand, [{
    key: "getCurrentAccount",
    value: function getCurrentAccount() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'base58';

      if (this._tronweb.defaultAddress && this._tronweb.defaultAddress[type]) {
        return this._tronweb.defaultAddress[type];
      }

      return undefined;
    } // async triggerContract({methodName, abiKey, contractParams, sendParams}) {
    //     console.log(methodName, abiKey, contractParams, sendParams)
    //     let _contract = await this._tronweb.contract().at(this.ABIs[abiKey].address)
    //     // const _method = _contract[methodName].apply(this, contractParams)
    //     return _contract[methodName](...contractParams).send({
    //         feeLimit: this._tronweb.toSun(100),
    //         callValue: 0,
    //         shouldPollResponse: false,
    //         ...sendParams
    //     })
    // }

    /**
     * Interact with a contract.
     * @param {string} methodName - contract method name
     * @param {string} abiKey - If the contract exists in the configuration file, you can use the key in the configuration to get it directly.
     * @param {json} abiString - ethereum ABI json
     * @param contractParams - contract function with arguments
     * @param sendParams - web3js send() arguments
     * @param beforeFetch
     * @param transactionHashCallback
     * @param confirmationCallback
     * @param receiptCallback
     * @param errorCallback
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "callContract",
    value: function () {
      var _callContract = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
        var methodName,
            abiKey,
            abiString,
            _ref$contractParams,
            contractParams,
            _ref2,
            _ref2$beforeFetch,
            beforeFetch,
            _ref2$errorCallback,
            errorCallback,
            _contractAddress,
            _contract,
            _method,
            res,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                methodName = _ref.methodName, abiKey = _ref.abiKey, abiString = _ref.abiString, _ref$contractParams = _ref.contractParams, contractParams = _ref$contractParams === void 0 ? [] : _ref$contractParams;
                _ref2 = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, _ref2$beforeFetch = _ref2.beforeFetch, beforeFetch = _ref2$beforeFetch === void 0 ? loop : _ref2$beforeFetch, _ref2$errorCallback = _ref2.errorCallback, errorCallback = _ref2$errorCallback === void 0 ? loop : _ref2$errorCallback;
                _context.prev = 2;
                beforeFetch && beforeFetch();
                _context.next = 6;
                return this.getContractAddress(abiKey);

              case 6:
                _contractAddress = _context.sent;
                _context.next = 9;
                return this._tronweb.contract().at(_contractAddress);

              case 9:
                _contract = _context.sent;
                _method = _contract.methods[methodName].apply(this, contractParams);
                _context.next = 13;
                return _method.call();

              case 13:
                res = _context.sent;
                console.log('tron res:', res);
                return _context.abrupt("return", res);

              case 18:
                _context.prev = 18;
                _context.t0 = _context["catch"](2);
                console.error('triggerContract', _context.t0);
                errorCallback && errorCallback(_context.t0);

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 18]]);
      }));

      function callContract(_x) {
        return _callContract.apply(this, arguments);
      }

      return callContract;
    }()
    /**
     * Interact with a contract.
     * @param {string} methodName - contract method name
     * @param {string} abiKey - If the contract exists in the configuration file, you can use the key in the configuration to get it directly.
     * @param {json} abiString - ethereum ABI json
     * @param contractParams - contract function with arguments
     * @param sendParams - web3js send() arguments
     * @param beforeFetch
     * @param transactionHashCallback
     * @param confirmationCallback
     * @param receiptCallback
     * @param errorCallback
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "triggerContract",
    value: function () {
      var _triggerContract = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
        var methodName,
            abiKey,
            abiString,
            _ref3$forceABI,
            forceABI,
            _ref3$contractParams,
            contractParams,
            _ref3$sendParams,
            sendParams,
            _ref4,
            _ref4$beforeFetch,
            beforeFetch,
            _ref4$transactionHash,
            transactionHashCallback,
            _ref4$confirmationCal,
            confirmationCallback,
            _ref4$receiptCallback,
            receiptCallback,
            _ref4$errorCallback,
            errorCallback,
            _ref4$unSignedTx,
            unSignedTx,
            _ref4$payload,
            payload,
            _contractAddress2,
            extendPayload,
            _getContractMethodsPa,
            functionSelector,
            parameter,
            _contract,
            _method,
            res,
            _abi2,
            _extendPayload,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                methodName = _ref3.methodName, abiKey = _ref3.abiKey, abiString = _ref3.abiString, _ref3$forceABI = _ref3.forceABI, forceABI = _ref3$forceABI === void 0 ? false : _ref3$forceABI, _ref3$contractParams = _ref3.contractParams, contractParams = _ref3$contractParams === void 0 ? [] : _ref3$contractParams, _ref3$sendParams = _ref3.sendParams, sendParams = _ref3$sendParams === void 0 ? {} : _ref3$sendParams;
                _ref4 = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {}, _ref4$beforeFetch = _ref4.beforeFetch, beforeFetch = _ref4$beforeFetch === void 0 ? loop : _ref4$beforeFetch, _ref4$transactionHash = _ref4.transactionHashCallback, transactionHashCallback = _ref4$transactionHash === void 0 ? loop : _ref4$transactionHash, _ref4$confirmationCal = _ref4.confirmationCallback, confirmationCallback = _ref4$confirmationCal === void 0 ? loop : _ref4$confirmationCal, _ref4$receiptCallback = _ref4.receiptCallback, receiptCallback = _ref4$receiptCallback === void 0 ? loop : _ref4$receiptCallback, _ref4$errorCallback = _ref4.errorCallback, errorCallback = _ref4$errorCallback === void 0 ? loop : _ref4$errorCallback, _ref4$unSignedTx = _ref4.unSignedTx, unSignedTx = _ref4$unSignedTx === void 0 ? loop : _ref4$unSignedTx, _ref4$payload = _ref4.payload, payload = _ref4$payload === void 0 ? {} : _ref4$payload;
                _context2.prev = 2;
                beforeFetch && beforeFetch();
                _context2.next = 6;
                return this.getContractAddress(abiKey);

              case 6:
                _contractAddress2 = _context2.sent;
                extendPayload = _objectSpread(_objectSpread({}, payload), {}, {
                  _contractAddress: _contractAddress2
                });

                if (this.option.sign) {
                  _context2.next = 12;
                  break;
                }

                _getContractMethodsPa = (0, _abi3.getContractMethodsParams)(methodName, contractParams, abiString), functionSelector = _getContractMethodsPa.functionSelector, parameter = _getContractMethodsPa.parameter;

                this._tronweb.transactionBuilder.triggerSmartContract(_abi.address, functionSelector, this._tronweb.toSun(50), sendParams.callValue || 0, parameter, this.getCurrentAccount('hex')).then(function (_ref5) {
                  var transaction = _ref5.transaction;
                  unSignedTx && unSignedTx(transaction, extendPayload);
                });

                return _context2.abrupt("return");

              case 12:
                _contract = null;

                if (!forceABI) {
                  _context2.next = 19;
                  break;
                }

                _context2.next = 16;
                return this._tronweb.contract(abiString, _contractAddress2);

              case 16:
                _contract = _context2.sent;
                _context2.next = 22;
                break;

              case 19:
                _context2.next = 21;
                return this._tronweb.contract().at(_contractAddress2);

              case 21:
                _contract = _context2.sent;

              case 22:
                _method = _contract.methods[methodName].apply(this, contractParams);
                res = _method.send(_objectSpread({
                  feeLimit: this._tronweb.toSun(60),
                  callValue: 0,
                  shouldPollResponse: false
                }, sendParams));
                res.then(function (hash) {
                  transactionHashCallback && transactionHashCallback(hash, extendPayload);
                  console.log('hash', hash);
                })["catch"](function (e) {
                  var extendPayload = _objectSpread(_objectSpread({}, payload), {}, {
                    _contractAddress: _contractAddress2
                  });

                  errorCallback && errorCallback(e, extendPayload);
                });
                console.log('tron res:', res);
                return _context2.abrupt("return", res);

              case 29:
                _context2.prev = 29;
                _context2.t0 = _context2["catch"](2);
                console.error('triggerContract', _context2.t0);
                _abi2 = this.ABIs[abiKey];
                _extendPayload = _objectSpread(_objectSpread({}, payload), {}, {
                  _contractAddress: contractAddress
                });
                errorCallback && errorCallback(_context2.t0, _extendPayload);

              case 35:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 29]]);
      }));

      function triggerContract(_x2) {
        return _triggerContract.apply(this, arguments);
      }

      return triggerContract;
    }()
    /**
     * Transfers value amount of tokens to address to
     * @param {string} value - amount of tokens
     * @param {string} to - receiving address
     * @param {string} symbol - symbol of token [ring, kton, gold, wood, water, fire, soil]
     * @param {*} callback
     */

  }, {
    key: "tokenTransfer",
    value: function () {
      var _tokenTransfer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(value, to, symbol) {
        var callback,
            abiString,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                callback = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};

                if (!(!to || to === "0x0000000000000000000000000000000000000000")) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                abiString = '';

                if (symbol === 'kton') {
                  abiString = _abiKton["default"];
                } else {
                  abiString = _abiRing["default"];
                }

                return _context3.abrupt("return", this.triggerContract({
                  methodName: 'transfer',
                  abiKey: symbol,
                  abiString: abiString,
                  contractParams: [to, value]
                }, callback));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function tokenTransfer(_x3, _x4, _x5) {
        return _tokenTransfer.apply(this, arguments);
      }

      return tokenTransfer;
    }()
    /**
     * Claim land asset
     * @param tokenId - Land tokenId
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "claimLandAsset",
    value: function claimLandAsset(tokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'claimLandAsset',
        abiKey: 'auction',
        abiString: _abiAuction["default"],
        contractParams: ['0x' + tokenId]
      }, callback);
    }
    /**
     * Sell land asset
     * @param tokenId - Land tokenId
     * @param start - start price
     * @param end - end price
     * @param duration - bid duration time in second
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "setLandPrice",
    value: function () {
      var _setLandPrice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(tokenId, start, end, duration) {
        var callback,
            from,
            _from,
            _start,
            _end,
            _duration,
            data,
            _args4 = arguments;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                callback = _args4.length > 4 && _args4[4] !== undefined ? _args4[4] : {};
                from = this.getCurrentAccount('hex');
                _from = _index["default"].padLeft(from.slice(2), 64, '0');
                _start = _index["default"].toHexAndPadLeft(start).slice(2);
                _end = _index["default"].toHexAndPadLeft(end).slice(2);
                _duration = _index["default"].toHexAndPadLeft(duration).slice(2);
                data = "0x".concat(_start).concat(_end).concat(_duration).concat(_from);
                return _context4.abrupt("return", this.triggerContract({
                  methodName: 'approveAndCall',
                  abiKey: 'land',
                  abiString: _abiLand["default"],
                  contractParams: [this.ABIs['auction'].address, '0x' + tokenId, data]
                }, callback));

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function setLandPrice(_x6, _x7, _x8, _x9) {
        return _setLandPrice.apply(this, arguments);
      }

      return setLandPrice;
    }()
    /**
     * Bid Land Assets with Ring token.
     * @param amount - bid price with ring token
     * @param tokenId - tokenid of land
     * @param referrer - Referrer address
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "buyLandContract",
    value: function buyLandContract(amount, tokenId, referrer) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var finalReferrer = referrer;
      var data = finalReferrer && this._tronweb.isAddress(finalReferrer) ? "0x".concat(tokenId).concat(_index["default"].padLeft(this._tronweb.address.toHex(finalReferrer).substring(2), 64, '0')) : "0x".concat(tokenId);
      return this.triggerContract({
        methodName: 'transferAndFallback',
        abiKey: 'ring',
        abiString: _abiRing["default"],
        contractParams: [this.ABIs['auction'].address, amount, data]
      }, callback);
    }
    /**
     *  Withdraw ring from the channel
     * @param nonce
     * @param value
     * @param hash
     * @param v
     * @param r
     * @param s
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "withdrawRing",
    value: function withdrawRing(_ref6) {
      var nonce = _ref6.nonce,
          value = _ref6.value,
          hash = _ref6.hash,
          v = _ref6.v,
          r = _ref6.r,
          s = _ref6.s;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: "takeBack",
        abiString: _abiWithdraw["default"],
        contractParams: [nonce, value, hash, v, r, s],
        abiKey: "withdraw"
      }, callback);
    }
    /**
     *  Withdraw kton from the channel
     * @param nonce
     * @param value
     * @param hash
     * @param v
     * @param r
     * @param s
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "withdrawKton",
    value: function withdrawKton(_ref7) {
      var nonce = _ref7.nonce,
          value = _ref7.value,
          hash = _ref7.hash,
          v = _ref7.v,
          r = _ref7.r,
          s = _ref7.s;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: "takeBack",
        abiString: _abiWithdraw["default"],
        contractParams: [nonce, value, hash, v, r, s],
        abiKey: "withdrawKton"
      }, callback);
    }
    /**
     *  Cancel the Land being auctioned.
     * @param {string} tokenId - tokenid of land
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "cancelAuction",
    value: function cancelAuction(tokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: "cancelAuction",
        abiString: _abiAuction["default"],
        contractParams: ['0x' + tokenId],
        abiKey: "auction"
      }, callback);
    }
    /**
     * Lock ring token to get Kton token
     * @param amount - ring amount
     * @param month - Locking time(unit: month)
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "saveRing",
    value: function saveRing(amount, month) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.triggerContract({
        methodName: 'transferAndFallback',
        abiKey: 'ring',
        abiString: _abiRing["default"],
        contractParams: [this.ABIs['bank'].address, amount, _index["default"].toTwosComplement(month)]
      }, callback);
    }
    /**
     * Redemption of unexpired ring.
     * @param amount - penalty Kton amount
     * @param id - deposit ID
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "redeemRing",
    value: function redeemRing(amount, id) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.triggerContract({
        methodName: 'transferAndFallback',
        abiKey: 'kton',
        abiString: _abiKton["default"],
        contractParams: [this.ABIs['bank'].address, amount, _index["default"].toTwosComplement(id)]
      }, callback);
    }
    /**
     * Redemption ring without penalty kton
     * @param id - deposit ID
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "withdrawBankRing",
    value: function withdrawBankRing(id) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'claimDeposit',
        abiKey: 'bank',
        abiString: _abiBank["default"],
        contractParams: [_index["default"].toTwosComplement(id)]
      }, callback);
    }
    /**
     * Play a ticket game
     * @param type - ['small':playWithSmallTicket , 'large': playWithLargeTicket]
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "lotteryFromPoint",
    value: function lotteryFromPoint() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "small";
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: type === "small" ? "playWithSmallTicket" : "playWithLargeTicket",
        abiKey: 'lottery',
        abiString: _abiLottery["default"],
        contractParams: []
      }, callback);
    }
    /**
     * Binding tester code
     * @param _nonce
     * @param _testerCodeHash
     * @param _hashmessage
     * @param _v
     * @param _r
     * @param _s
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "updateTesterRole",
    value: function updateTesterRole(_nonce, _testerCodeHash, _hashmessage, _v, _r, _s) {
      var callback = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
      return this.triggerContract({
        methodName: 'updateTesterRole',
        abiKey: 'rolesUpdater',
        abiString: _abiRolesUpdater["default"],
        contractParams: [_nonce, _testerCodeHash, _hashmessage, _v, _r, _s]
      }, callback);
    }
    /**
     * create a red package
     * @param amount - amount of red package
     * @param number - number of received
     * @param packetId - packet ID
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "createRedPackageContract",
    value: function createRedPackageContract(amount, number, packetId) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var model = 0;

      var _data = "0x".concat(_index["default"].toHexAndPadLeft(number).slice(2)).concat(_index["default"].toHexAndPadLeft(model).slice(2)).concat(_index["default"].toHexAndPadLeft(packetId).slice(2));

      return this.triggerContract({
        methodName: 'transferAndFallback',
        abiKey: 'ring',
        abiString: _abiRing["default"],
        contractParams: [this.ABIs['redPackage'].address, amount, _data]
      }, callback);
    }
    /**
     * tansfer the Land
     * @param {address} from - sender address
     * @param {address} to - receiver
     * @param {string} tokenId - Land token ID
     * @returns {*}
     */

  }, {
    key: "transferFromLand",
    value: function () {
      var _transferFromLand = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(to, tokenId) {
        var callback,
            from,
            _args5 = arguments;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                callback = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};

                if (to) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt("return", null);

              case 3:
                from = this.getCurrentAccount();
                return _context5.abrupt("return", this.triggerContract({
                  methodName: 'transferFrom',
                  abiKey: 'land',
                  abiString: _abiLand["default"],
                  contractParams: [from, this._tronweb.address.toHex(to), '0x' + tokenId]
                }, callback));

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function transferFromLand(_x10, _x11) {
        return _transferFromLand.apply(this, arguments);
      }

      return transferFromLand;
    }()
    /**
     *  claim resource on the Land
     * @param tokenId
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "resourceClaim",
    value: function resourceClaim(tokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'claimAllResource',
        abiKey: 'apostleLandResource',
        abiString: _abiLandResource["default"],
        contractParams: ['0x' + tokenId]
      }, callback);
    }
    /**
     * Bid apostle by RING token
     * @param amount - RING amount
     * @param tokenId - Apostle token ID
     * @param referrer - refer address
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "apostleBid",
    value: function apostleBid(amount, tokenId, referrer) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var finalReferrer = referrer;
      var data = finalReferrer && _index["default"].isAddress(finalReferrer) ? "0x".concat(tokenId).concat(_index["default"].padLeft(finalReferrer.substring(2), 64, '0')) : "0x".concat(tokenId);
      return this.triggerContract({
        methodName: 'transferAndFallback',
        abiKey: 'ring',
        abiString: _abiRing["default"],
        contractParams: [this.ABIs['apostleBid'].address, amount, data]
      }, callback);
    }
    /**
     * Receive apostle
     * @param tokenId - Apostle Token ID
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "apostleClaim",
    value: function apostleClaim(tokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'claimApostleAsset',
        abiKey: 'apostleAuction',
        abiString: _abiApostleAuction["default"],
        contractParams: ['0x' + tokenId]
      }, callback);
    }
    /**
     * Sell apostle
     * @param tokenId - Apostle Token ID
     * @param start - auction start price
     * @param end - auction end price
     * @param duration - duration time
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "apostleSell",
    value: function () {
      var _apostleSell = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(tokenId, start, end, duration) {
        var callback,
            from,
            _from,
            _start,
            _end,
            _duration,
            data,
            _args6 = arguments;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                callback = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : {};
                from = this.getCurrentAccount('hex');
                _from = _index["default"].padLeft(from.slice(2), 64, '0');
                _start = _index["default"].toHexAndPadLeft(start).slice(2);
                _end = _index["default"].toHexAndPadLeft(end).slice(2);
                _duration = _index["default"].toHexAndPadLeft(duration).slice(2);
                data = "0x".concat(_start).concat(_end).concat(_duration).concat(_from);
                return _context6.abrupt("return", this.triggerContract({
                  methodName: 'approveAndCall',
                  abiKey: 'land',
                  abiString: _abiLand["default"],
                  contractParams: [this.ABIs['apostleSell'].address, '0x' + tokenId, data]
                }, callback));

              case 8:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function apostleSell(_x12, _x13, _x14, _x15) {
        return _apostleSell.apply(this, arguments);
      }

      return apostleSell;
    }()
    /**
     * Cancel the auction by apostle token ID
     * @param tokenId - apostle token ID
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "apostleCancelSell",
    value: function apostleCancelSell(tokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'cancelAuction',
        abiKey: 'apostleAuction',
        abiString: _abiApostleAuction["default"],
        contractParams: ['0x' + tokenId]
      }, callback);
    }
    /**
     *
     * @param tokenId
     * @param nftData
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "apostleRewardClaim",
    value: function apostleRewardClaim(tokenId, nftData) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.triggerContract({
        methodName: 'takeBackNFT',
        abiKey: 'apostleTakeBack',
        abiString: _abiTakeBack["default"],
        contractParams: [nftData.nonce, '0x' + tokenId, this.ABIs['land'].address, nftData.expireTime, nftData.hash_text, nftData.v, nftData.r, nftData.s]
      }, callback);
    }
    /**
     * Apostle reproduction in own
     * @param tokenId
     * @param targetTokenId
     * @param amount
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "apostleBreed",
    value: function apostleBreed(tokenId, targetTokenId, amount) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.triggerContract({
        methodName: 'transferAndFallback',
        abiKey: 'ring',
        abiString: _abiRing["default"],
        contractParams: [this.ABIs["apostleBreed"].address, amount, "0x".concat(tokenId).concat(targetTokenId)]
      }, callback);
    }
    /**
     * Apostle reproduction
     * @param tokenId
     * @param targetTokenId
     * @param amount
     */

  }, {
    key: "apostleBreedBid",
    value: function apostleBreedBid(tokenId, targetTokenId, amount) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.triggerContract({
        methodName: 'transferAndFallback',
        abiKey: 'ring',
        abiString: _abiRing["default"],
        contractParams: [this.ABIs["apostleSiringAuction"].address, amount, "0x".concat(tokenId).concat(targetTokenId)]
      }, callback);
    }
    /**
     * Apostle Breed Auction
     * @param tokenId - Apostle tokenId
     * @param start - start price
     * @param end - end price
     * @param duration - auction duration time
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "apostleBreedAuction",
    value: function () {
      var _apostleBreedAuction = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(tokenId, start, end, duration) {
        var callback,
            from,
            _from,
            _start,
            _end,
            _duration,
            data,
            _args7 = arguments;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                callback = _args7.length > 4 && _args7[4] !== undefined ? _args7[4] : {};
                from = this.getCurrentAccount('hex');
                _from = _index["default"].padLeft(from.slice(2), 64, '0');
                _start = _index["default"].toHexAndPadLeft(start).slice(2);
                _end = _index["default"].toHexAndPadLeft(end).slice(2);
                _duration = _index["default"].toHexAndPadLeft(duration).slice(2);
                data = "0x".concat(_start).concat(_end).concat(_duration).concat(_from);
                return _context7.abrupt("return", this.triggerContract({
                  methodName: 'approveAndCall',
                  abiKey: 'land',
                  abiString: _abiLand["default"],
                  contractParams: [this.ABIs['apostleSiringAuction'].address, '0x' + tokenId, data]
                }, callback));

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function apostleBreedAuction(_x16, _x17, _x18, _x19) {
        return _apostleBreedAuction.apply(this, arguments);
      }

      return apostleBreedAuction;
    }()
    /**
     * Cancel apostle breed auction
     * @param tokenId
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "apostleCancelBreedAuction",
    value: function apostleCancelBreedAuction(tokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'cancelAuction',
        abiKey: 'apostleSiringCancelAuction',
        abiString: _abiApostleSiring["default"],
        contractParams: ['0x' + tokenId]
      }, callback);
    }
    /**
     * Transfer apostle
     * @param toAddress
     * @param tokenId
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "apostleTransfer",
    value: function () {
      var _apostleTransfer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(toAddress, tokenId) {
        var callback,
            from,
            _args8 = arguments;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                callback = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : {};
                from = this.getCurrentAccount('hex');
                return _context8.abrupt("return", this.triggerContract({
                  methodName: 'transferFrom',
                  abiKey: 'land',
                  abiString: _abiLand["default"],
                  contractParams: [from, toAddress, '0x' + tokenId]
                }, callback));

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function apostleTransfer(_x20, _x21) {
        return _apostleTransfer.apply(this, arguments);
      }

      return apostleTransfer;
    }()
    /**
     * Let apostle go to work
     * @param tokenId - Apostle tokenId
     * @param landTokenId - Land tokenId
     * @param element - ['gold', 'wood', 'water', 'fire' ,'soil']
     */

  }, {
    key: "apostleWork",
    value: function apostleWork(tokenId, landTokenId, element) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var elementAddress = this.ABIs[element.toLowerCase() || 'token'].address;
      return this.triggerContract({
        methodName: 'startMining',
        abiKey: 'apostleLandResource',
        abiString: _abiLandResource["default"],
        contractParams: ['0x' + tokenId, '0x' + landTokenId, elementAddress]
      }, callback);
    }
    /**
     * Stop apostle mining
     * @param tokenId - Apostle tokenId
     */

  }, {
    key: "apostleStopWorking",
    value: function apostleStopWorking(tokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'stopMining',
        abiKey: 'apostleLandResource',
        abiString: _abiLandResource["default"],
        contractParams: ['0x' + tokenId]
      }, callback);
    }
    /**
     * Claim an apostle that expires at work
     * @param tokenId - Apostle TokenId
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "apostleHireClaim",
    value: function apostleHireClaim(tokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'removeTokenUseAndActivity',
        abiKey: 'apostleTokenUse',
        abiString: _abiTokenUse["default"],
        contractParams: ['0x' + tokenId]
      }, callback);
    }
    /**
     * Renting apostles to work
     * @param tokenId - Apostle TokenId
     * @param duration - Duration in second
     * @param price - Hire Price
     */

  }, {
    key: "apostleHire",
    value: function apostleHire(tokenId, duration, price) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var address = this.ABIs['apostleLandResource'].address;

      var _resourceAddress = _index["default"].padLeft(address.slice(2), 64, '0');

      var _price = _index["default"].toHexAndPadLeft(price).slice(2);

      var _duration = _index["default"].toHexAndPadLeft(duration).slice(2);

      var data = "0x".concat(_duration).concat(_price).concat(_resourceAddress);
      return this.triggerContract({
        methodName: 'approveAndCall',
        abiKey: 'land',
        abiString: _abiLand["default"],
        contractParams: [this.ABIs['apostleTokenUse'].address, '0x' + tokenId, data]
      }, callback);
    }
    /**
     * Cancel an apostle on Renting
     * @param tokenId - Apostle tokenId
     */

  }, {
    key: "apostleCancelHire",
    value: function apostleCancelHire(tokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'cancelTokenUseOffer',
        abiKey: 'apostleTokenUse',
        abiString: _abiTokenUse["default"],
        contractParams: ['0x' + tokenId]
      }, callback);
    }
    /**
     * Bid apostle on Renting
     * @param tokenId - Apostle tokenId
     * @param price - bid price
     */

  }, {
    key: "apostleHireBid",
    value: function apostleHireBid(tokenId, price) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.triggerContract({
        methodName: 'transferAndFallback',
        abiKey: 'ring',
        abiString: _abiRing["default"],
        contractParams: [this.ABIs['apostleTokenUse'].address, price, "0x".concat(tokenId)]
      }, callback);
    }
    /**
     * Apostle Born without element
     * @param motherTokenId
     */

  }, {
    key: "apostleBorn",
    value: function apostleBorn(motherTokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'giveBirth',
        abiKey: 'apostleBase',
        abiString: _abiApostleBase["default"],
        contractParams: ['0x' + motherTokenId, _index["default"].padLeft(0, 40, '0'), 0]
      }, callback);
    }
    /**
     * Apostle Born with element
     * @param motherTokenId
     * @param element
     * @param level
     * @param levelUnitPrice
     */

  }, {
    key: "apostleBornAndEnhance",
    value: function apostleBornAndEnhance(motherTokenId, element, level, levelUnitPrice) {
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      return this.triggerContract({
        methodName: 'transferAndFallback',
        abiKey: element.toLowerCase(),
        abiString: _abiRing["default"],
        contractParams: [this.ABIs['apostleBase'].address, new _bignumber["default"](level).times(new _bignumber["default"](levelUnitPrice)).toFixed(), "0x".concat(motherTokenId).concat(_index["default"].toHexAndPadLeft(level).slice(2))]
      }, callback);
    }
    /**
     * Get the contract address of evolution land by key.
     * @param {*} tokenKey ring | kton | gold ... 
     */

  }, {
    key: "getContractAddress",
    value: function () {
      var _getContractAddress = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(tokenKey) {
        var token;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                token = this.ABIs[tokenKey] && this.ABIs[tokenKey].address || tokenKey;
                return _context9.abrupt("return", token);

              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getContractAddress(_x22) {
        return _getContractAddress.apply(this, arguments);
      }

      return getContractAddress;
    }()
    /**
     * Query if an address is an authorized operator for another address
     * @param {*} owner The address that owns the NFTs
     * @param {*} operator The address that acts on behalf of the owner
     * @param {*} contractAddress ERC721 contract address
     */

  }, {
    key: "erc721IsApprovedForAll",
    value: function erc721IsApprovedForAll(owner, operator, contractAddress) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.callContract({
        methodName: 'isApprovedForAll',
        abiKey: contractAddress,
        contractParams: [owner, operator]
      }, callback);
    }
    /**
     * Returns whether `spender` is allowed to manage `tokenId`.
     * @param {*} spender The address that acts on behalf of the owner
     * @param {*} contractAddress The factory of tokenId.
     * @param {*} tokenId ERC721 token Id;
     */

  }, {
    key: "erc721IsApprovedOrOwner",
    value: function () {
      var _erc721IsApprovedOrOwner = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(spender, contractAddress, tokenId) {
        var owner, approvedAddress, isApprovedForAll;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.callContract({
                  methodName: 'ownerOf',
                  abiKey: contractAddress,
                  contractParams: [tokenId]
                });

              case 2:
                owner = _context10.sent;
                _context10.next = 5;
                return this.callContract({
                  methodName: 'getApproved',
                  abiKey: contractAddress,
                  contractParams: [tokenId]
                });

              case 5:
                approvedAddress = _context10.sent;
                _context10.next = 8;
                return this.erc721IsApprovedForAll(owner, spender, contractAddress);

              case 8:
                isApprovedForAll = _context10.sent;
                return _context10.abrupt("return", owner.toLowerCase() === spender.toLowerCase() || approvedAddress.toLowerCase() === spender.toLowerCase() || isApprovedForAll);

              case 10:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function erc721IsApprovedOrOwner(_x23, _x24, _x25) {
        return _erc721IsApprovedOrOwner.apply(this, arguments);
      }

      return erc721IsApprovedOrOwner;
    }()
    /**
     * 
     * @param {*} owner 
     * @param {*} operator 
     * @param {*} contractAddress 
     * @param {*} callback 
     */

  }, {
    key: "erc721IsApprovedForAll",
    value: function erc721IsApprovedForAll(owner, operator, contractAddress) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.callContract({
        methodName: 'isApprovedForAll',
        abiKey: contractAddress,
        contractParams: [owner, operator]
      }, callback);
    }
    /**
     * Change or reaffirm the approved address for an NFT
     * @param {*} to The new approved NFT controller
     * @param {*} tokenId The NFT to approve
     */

  }, {
    key: "erc721Approve",
    value: function () {
      var _erc721Approve = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(to, tokenId, contractAddress) {
        var callback,
            _args11 = arguments;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                callback = _args11.length > 3 && _args11[3] !== undefined ? _args11[3] : {};
                return _context11.abrupt("return", this.triggerContract({
                  methodName: 'approve',
                  abiKey: contractAddress,
                  contractParams: [to, tokenId]
                }, callback));

              case 2:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function erc721Approve(_x26, _x27, _x28) {
        return _erc721Approve.apply(this, arguments);
      }

      return erc721Approve;
    }()
    /**
     * Enable or disable approval for a third party ("operator") to manage
     * @param {*} to Address to add to the set of authorized operators
     * @param {*} approved True if the operator is approved, false to revoke approval
     * @param {*} contractAddress ERC721 contract address
     * @param {*} callback 
     */

  }, {
    key: "erc721SetApprovalForAll",
    value: function () {
      var _erc721SetApprovalForAll = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(to, approved, contractAddress) {
        var callback,
            _args12 = arguments;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                callback = _args12.length > 3 && _args12[3] !== undefined ? _args12[3] : {};
                return _context12.abrupt("return", this.triggerContract({
                  methodName: 'setApprovalForAll',
                  abiKey: contractAddress,
                  contractParams: [to, approved]
                }, callback));

              case 2:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function erc721SetApprovalForAll(_x29, _x30, _x31) {
        return _erc721SetApprovalForAll.apply(this, arguments);
      }

      return erc721SetApprovalForAll;
    }()
    /**
     * Byzantine swap fee
     * @param {string} value amount of rings to be swaped
     * @param {*} callback 
     */

  }, {
    key: "fetchByzantineSwapFee",
    value: function () {
      var _fetchByzantineSwapFee = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(value) {
        var callback,
            result,
            _args13 = arguments;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                callback = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : {};
                _context13.next = 3;
                return this.callContract({
                  methodName: 'querySwapFee',
                  abiKey: 'swapBridge',
                  abiString: _abiSwapBridge["default"],
                  contractParams: [value]
                }, callback);

              case 3:
                result = _context13.sent;
                return _context13.abrupt("return", result.toString());

              case 5:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function fetchByzantineSwapFee(_x32) {
        return _fetchByzantineSwapFee.apply(this, arguments);
      }

      return fetchByzantineSwapFee;
    }()
  }, {
    key: "getSimpleBridgeStatus",
    value: function getSimpleBridgeStatus() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.callContract({
        methodName: 'paused',
        abiKey: 'swapBridge',
        abiString: _abiSwapBridge["default"],
        contractParams: []
      }, callback);
    }
    /**
     * Byzantine ring transfer to Atlantis
     * @param {string} value amount of rings to be swaped
     * @param {string} value ethereum address
     * @param {*} callback 
     */

  }, {
    key: "ByzantineSwapBridge",
    value: function () {
      var _ByzantineSwapBridge = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(value, targetAddress) {
        var symbol,
            callback,
            fee,
            extraData,
            _args14 = arguments;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                symbol = _args14.length > 2 && _args14[2] !== undefined ? _args14[2] : 'ring';
                callback = _args14.length > 3 && _args14[3] !== undefined ? _args14[3] : {};

                if (targetAddress) {
                  _context14.next = 4;
                  break;
                }

                throw Error('empty targetAddress');

              case 4:
                _context14.next = 6;
                return this.fetchByzantineSwapFee(value);

              case 6:
                fee = _context14.sent;
                extraData = "".concat(_index["default"].toHexAndPadLeft(value)).concat(_index["default"].toHexAndPadLeft(1).slice(2)).concat(_index["default"].padLeft(targetAddress.substring(2), 64, '0'));
                return _context14.abrupt("return", this.triggerContract({
                  methodName: 'approveAndCall',
                  abiKey: symbol.toLowerCase(),
                  abiString: _abiRing["default"],
                  contractParams: [this.ABIs['swapBridge'].address, new _bignumber["default"](fee).plus(1).plus(new _bignumber["default"](value)).toFixed(0), extraData]
                }, callback));

              case 9:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function ByzantineSwapBridge(_x33, _x34) {
        return _ByzantineSwapBridge.apply(this, arguments);
      }

      return ByzantineSwapBridge;
    }()
    /**
     * buy lucky box
     * @param {*} buyer - Receiver
     * @param {*} goldBoxAmount - gold box amount
     * @param {*} silverBoxAmount - silver box amount
     */

  }, {
    key: "buyLuckyBox",
    value: function () {
      var _buyLuckyBox = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(buyer, goldBoxAmount, silverBoxAmount, callback) {
        var luckyBoxInfo, cost;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.getLuckyBoxInfo();

              case 2:
                luckyBoxInfo = _context15.sent;
                cost = _index["default"].toBN(luckyBoxInfo[0]).muln(goldBoxAmount).add(_index["default"].toBN(luckyBoxInfo[1]).muln(silverBoxAmount));
                return _context15.abrupt("return", this.triggerContract({
                  methodName: 'buyBoxs',
                  abiKey: 'luckybag',
                  abiString: _abiLuckyBag["default"],
                  contractParams: [buyer, goldBoxAmount, silverBoxAmount],
                  sendParams: {
                    callValue: cost
                  }
                }, callback));

              case 5:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function buyLuckyBox(_x35, _x36, _x37, _x38) {
        return _buyLuckyBox.apply(this, arguments);
      }

      return buyLuckyBox;
    }()
    /**
     * lucky box information
     * @returns {Array} - promise -> [goldBoxPrice, silverBoxPrice, goldBoxAmountForSale, silverBoxAmountForSale, goldSaleLimit, silverSaleLimit]
     */

  }, {
    key: "getLuckyBoxInfo",
    value: function () {
      var _getLuckyBoxInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
        var _contract, result;

        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this._tronweb.contract().at(this.ABIs['luckybag'].address);

              case 2:
                _contract = _context16.sent;
                _context16.next = 5;
                return Promise.all([_contract.methods.goldBoxPrice().call(), _contract.methods.silverBoxPrice().call(), _contract.methods.goldBoxAmountForSale().call(), _contract.methods.silverBoxAmountForSale().call(), _contract.methods.goldSaleLimit().call(), _contract.methods.silverSaleLimit().call()]);

              case 5:
                result = _context16.sent;
                return _context16.abrupt("return", result.map(function (item) {
                  return item.toString();
                }));

              case 7:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function getLuckyBoxInfo() {
        return _getLuckyBoxInfo.apply(this, arguments);
      }

      return getLuckyBoxInfo;
    }()
    /**
     * Number of lucky box already purchased at this address
     * @param {*} address - buyer
     * @returns {Array} - promise -> [goldSalesRecord, silverSalesRecord]
     */

  }, {
    key: "getLuckyBoxSalesRecord",
    value: function () {
      var _getLuckyBoxSalesRecord = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(address) {
        var _contract, result;

        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return this._tronweb.contract().at(this.ABIs['luckybag'].address);

              case 2:
                _contract = _context17.sent;
                _context17.next = 5;
                return Promise.all([_contract.methods.goldSalesRecord(address).call(), _contract.methods.silverSalesRecord(address).call()]);

              case 5:
                result = _context17.sent;
                return _context17.abrupt("return", result.map(function (item) {
                  return item.toString();
                }));

              case 7:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function getLuckyBoxSalesRecord(_x39) {
        return _getLuckyBoxSalesRecord.apply(this, arguments);
      }

      return getLuckyBoxSalesRecord;
    }()
    /**
    * Tron Function, Approve Ring to Justswap Exchange
    * @param {*} callback 
    */

  }, {
    key: "approveRingToJustswap",
    value: function () {
      var _approveRingToJustswap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
        var callback,
            _args18 = arguments;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                callback = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : {};
                return _context18.abrupt("return", this.triggerContract({
                  methodName: 'approve',
                  abiKey: 'ring',
                  contractParams: [this.ABIs['justswapExchange'].address, '20000000000000000000000000']
                }, callback));

              case 2:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function approveRingToJustswap() {
        return _approveRingToJustswap.apply(this, arguments);
      }

      return approveRingToJustswap;
    }()
    /**
     * Allows spender to withdraw from your account multiple times, up to the value amount. If this function is called again it overwrites the current allowance with value.
     * @param {*} tokenContractOrType Erc20 token contract address
     * @param {*} spender
     * @param {*} value
     * @param {*} callback 
     */

  }, {
    key: "approveToken",
    value: function () {
      var _approveToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(tokenContractOrType, spender) {
        var value,
            callback,
            _args19 = arguments;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                value = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
                callback = _args19.length > 3 && _args19[3] !== undefined ? _args19[3] : {};

                if (spender) {
                  _context19.next = 4;
                  break;
                }

                return _context19.abrupt("return");

              case 4:
                return _context19.abrupt("return", this.triggerContract({
                  methodName: 'approve',
                  abiKey: tokenContractOrType,
                  contractParams: [spender, value]
                }, callback));

              case 5:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function approveToken(_x40, _x41) {
        return _approveToken.apply(this, arguments);
      }

      return approveToken;
    }()
    /**
     * Check if justswap has sufficient transfer authority
     * @param {*} amount 
     */

  }, {
    key: "checkJustswapAllowance",
    value: function () {
      var _checkJustswapAllowance = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(amount) {
        var from, ringContract, allowanceAmount;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return this.getCurrentAccount('hex');

              case 2:
                from = _context20.sent;
                _context20.next = 5;
                return this._tronweb.contract().at(this.ABIs['ring'].address);

              case 5:
                ringContract = _context20.sent;
                _context20.next = 8;
                return ringContract.methods.allowance(from, this.ABIs['justswapExchange'].address).call();

              case 8:
                allowanceAmount = _context20.sent;
                return _context20.abrupt("return", !_index["default"].toBN(allowanceAmount).lt(_index["default"].toBN(amount || '1000000000000000000000000')));

              case 10:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function checkJustswapAllowance(_x42) {
        return _checkJustswapAllowance.apply(this, arguments);
      }

      return checkJustswapAllowance;
    }()
    /**
     * Check if spender has sufficient transfer authority
     * @param {*} amount 
     * @param {*} tokenAddressOrType,
     * @param {*} account
     * @param {*} spender
     */

  }, {
    key: "checkTokenAllowance",
    value: function () {
      var _checkTokenAllowance = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(amount, tokenAddressOrType, account, spender) {
        var from, token, erc20Contract, allowanceAmount;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                if (!(!amount || !tokenAddressOrType || !spender)) {
                  _context21.next = 2;
                  break;
                }

                throw 'tron::checkTokenAllowance: missing param';

              case 2:
                _context21.t0 = account;

                if (_context21.t0) {
                  _context21.next = 7;
                  break;
                }

                _context21.next = 6;
                return this.getCurrentAccount();

              case 6:
                _context21.t0 = _context21.sent;

              case 7:
                from = _context21.t0;
                _context21.next = 10;
                return this.getContractAddress(tokenAddressOrType);

              case 10:
                token = _context21.sent;
                _context21.next = 13;
                return this._tronweb.contract().at(token);

              case 13:
                erc20Contract = _context21.sent;
                _context21.next = 16;
                return erc20Contract.methods.allowance(from, spender).call();

              case 16:
                allowanceAmount = _context21.sent;
                return _context21.abrupt("return", !_index["default"].toBN(allowanceAmount).lt(_index["default"].toBN(amount || '1000000000000000000000000')));

              case 18:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function checkTokenAllowance(_x43, _x44, _x45, _x46) {
        return _checkTokenAllowance.apply(this, arguments);
      }

      return checkTokenAllowance;
    }()
    /**
     * get amount of ether in justswap exchange 
     */

  }, {
    key: "getJustswapTrxBalance",
    value: function () {
      var _getJustswapTrxBalance = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
        var tradeobj;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return this._tronweb.trx.getAccount(this.ABIs['justswapExchange'].address);

              case 2:
                tradeobj = _context22.sent;
                return _context22.abrupt("return", new _bignumber["default"](tradeobj.balance).toString(10));

              case 4:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function getJustswapTrxBalance() {
        return _getJustswapTrxBalance.apply(this, arguments);
      }

      return getJustswapTrxBalance;
    }()
    /**
     * get amount of ring in justswap exchange 
     */

  }, {
    key: "getJustswapTokenBalance",
    value: function () {
      var _getJustswapTokenBalance = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
        var ring, balance;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return this._tronweb.contract().at(this.ABIs['ring'].address);

              case 2:
                ring = _context23.sent;
                _context23.next = 5;
                return ring.methods.balanceOf(this.ABIs['justswapExchange'].address).call();

              case 5:
                balance = _context23.sent;
                return _context23.abrupt("return", new _bignumber["default"](balance).toString(10));

              case 7:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function getJustswapTokenBalance() {
        return _getJustswapTokenBalance.apply(this, arguments);
      }

      return getJustswapTokenBalance;
    }()
  }, {
    key: "getOutputPrice",
    value: function getOutputPrice(outputAmount, inputReserve, outputReserve) {
      var numerator = new _bignumber["default"](inputReserve).times(outputAmount).times(1000);
      var denominator = new _bignumber["default"](outputReserve).minus(outputAmount).times(997);
      return numerator.div(denominator).plus(1);
    }
  }, {
    key: "getInputPrice",
    value: function getInputPrice(inputAmount, inputReserve, outputReserve) {
      var input_amount_with_fee = new _bignumber["default"](inputAmount).times(997);
      var numerator = input_amount_with_fee.times(outputReserve);
      var denominator = new _bignumber["default"](inputReserve).times(1000).plus(input_amount_with_fee);
      return numerator.div(denominator);
    }
    /**
     * Trx will be cost to swap 1 Ring
     * @param {*} tokens_bought
     */

  }, {
    key: "getTrxToTokenOutputPrice",
    value: function () {
      var _getTrxToTokenOutputPrice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
        var tokens_bought,
            amountInMax,
            _args24 = arguments;
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                tokens_bought = _args24.length > 0 && _args24[0] !== undefined ? _args24[0] : '1000000000000000000';
                _context24.t0 = this;
                _context24.t1 = tokens_bought;
                _context24.next = 5;
                return this.getJustswapTrxBalance();

              case 5:
                _context24.t2 = _context24.sent;
                _context24.next = 8;
                return this.getJustswapTokenBalance();

              case 8:
                _context24.t3 = _context24.sent;
                amountInMax = _context24.t0.getOutputPrice.call(_context24.t0, _context24.t1, _context24.t2, _context24.t3);
                return _context24.abrupt("return", [new _bignumber["default"](amountInMax.toString(10)).times('1000000000000000000').div(tokens_bought).toFixed(0), amountInMax.toString(10)]);

              case 11:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function getTrxToTokenOutputPrice() {
        return _getTrxToTokenOutputPrice.apply(this, arguments);
      }

      return getTrxToTokenOutputPrice;
    }()
    /**
     * Trx will be got to swap 1 Ring
     * @param {*} tokens_bought
     */

  }, {
    key: "getTokenToTrxInputPrice",
    value: function () {
      var _getTokenToTrxInputPrice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25() {
        var tokens_bought,
            amountOutMin,
            _args25 = arguments;
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                tokens_bought = _args25.length > 0 && _args25[0] !== undefined ? _args25[0] : '1000000000000000000';
                _context25.t0 = this;
                _context25.t1 = tokens_bought;
                _context25.next = 5;
                return this.getJustswapTokenBalance();

              case 5:
                _context25.t2 = _context25.sent;
                _context25.next = 8;
                return this.getJustswapTrxBalance();

              case 8:
                _context25.t3 = _context25.sent;
                amountOutMin = _context25.t0.getInputPrice.call(_context25.t0, _context25.t1, _context25.t2, _context25.t3);
                return _context25.abrupt("return", [new _bignumber["default"](amountOutMin.toString(10)).times('1000000000000000000').div(tokens_bought).toFixed(0), amountOutMin.toString(10)]);

              case 11:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function getTokenToTrxInputPrice() {
        return _getTokenToTrxInputPrice.apply(this, arguments);
      }

      return getTokenToTrxInputPrice;
    }()
    /**
      * Swap Ether to Ring token - Powered by uniswap.
      * @param {string} value - amount for Ring， unit of measurement(wei)
      * @returns {Promise<PromiEvent<any>>}
      */

  }, {
    key: "buyRingJustswap",
    value: function () {
      var _buyRingJustswap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(value) {
        var callback,
            deadline,
            _yield$this$getTrxToT,
            _yield$this$getTrxToT2,
            amountInMax,
            slippageAmountInMax,
            _args26 = arguments;

        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                callback = _args26.length > 1 && _args26[1] !== undefined ? _args26[1] : {};
                deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from the current Unix time

                _context26.next = 4;
                return this.getTrxToTokenOutputPrice(value);

              case 4:
                _yield$this$getTrxToT = _context26.sent;
                _yield$this$getTrxToT2 = _slicedToArray(_yield$this$getTrxToT, 2);
                amountInMax = _yield$this$getTrxToT2[1];
                //  slippage
                slippageAmountInMax = new _bignumber["default"](amountInMax).times(1.005);
                return _context26.abrupt("return", this.triggerContract({
                  methodName: 'trxToTokenSwapOutput',
                  abiKey: 'justswapExchange',
                  abiString: _abiJustswapExchange["default"],
                  forceABI: true,
                  contractParams: [value, deadline],
                  sendParams: {
                    callValue: slippageAmountInMax.toFixed(0)
                  }
                }, callback));

              case 9:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function buyRingJustswap(_x47) {
        return _buyRingJustswap.apply(this, arguments);
      }

      return buyRingJustswap;
    }()
    /**
     * Swap Ether to Ring token - Powered by uniswap.
     * @param {string} value - amount for Ring， unit of measurement(wei)
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "sellRingJustswap",
    value: function () {
      var _sellRingJustswap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(value) {
        var callback,
            deadline,
            _yield$this$getTokenT,
            _yield$this$getTokenT2,
            amountOutMin,
            slippageAmountOutMin,
            _args27 = arguments;

        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                callback = _args27.length > 1 && _args27[1] !== undefined ? _args27[1] : {};
                deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from the current Unix time

                _context27.next = 4;
                return this.getTokenToTrxInputPrice(value);

              case 4:
                _yield$this$getTokenT = _context27.sent;
                _yield$this$getTokenT2 = _slicedToArray(_yield$this$getTokenT, 2);
                amountOutMin = _yield$this$getTokenT2[1];
                //  slippage
                slippageAmountOutMin = new _bignumber["default"](amountOutMin).times(0.995);
                return _context27.abrupt("return", this.triggerContract({
                  methodName: 'tokenToTrxSwapInput',
                  abiKey: 'justswapExchange',
                  abiString: _abiJustswapExchange["default"],
                  forceABI: true,
                  contractParams: [value, slippageAmountOutMin.toFixed(0), deadline],
                  sendParams: {
                    callValue: 0
                  }
                }, callback));

              case 9:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function sellRingJustswap(_x48) {
        return _sellRingJustswap.apply(this, arguments);
      }

      return sellRingJustswap;
    }()
    /**
     * 'RING', 'KTON', 'GOLD'..., '0xxxxx'
     * @param {*} token 
     */

  }, {
    key: "isEvolutionLandToken",
    value: function isEvolutionLandToken(token) {
      console.log('isEvolutionLandToken', token);
      var tokenList = ['ring', 'kton', 'gold', 'wood', 'water', 'hoo', 'fire', 'soil', this.ABIs['ring'].address.toLowerCase(), this.ABIs['kton'].address.toLowerCase(), this.ABIs['gold'].address.toLowerCase(), this.ABIs['wood'].address.toLowerCase(), this.ABIs['water'].address.toLowerCase(), this.ABIs['fire'].address.toLowerCase(), this.ABIs['soil'].address.toLowerCase()];
      return tokenList.includes(token.toLowerCase());
    }
    /**
     * This function is used to join Gold Rust event through ETH/ERC20 Tokens
     * @param {*} eventId The event id which to join
     * @param {*} landId The land token id which to join
     * @param {*} amount The ring amount which to submit
     * @param {*} subAddr The dvm address for receiving the new land
     * @param {*} callback 
     */

  }, {
    key: "goldRushRaffleJoin",
    value: function goldRushRaffleJoin(eventId, landTokenId, amount, subAddr) {
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      return this.triggerContract({
        methodName: 'join',
        abiKey: 'goldRushRaffle',
        // abiString: this.ABIs['goldRushRaffle'].abi,
        contractParams: [eventId, _index["default"].pad0x(landTokenId), amount, subAddr]
      }, callback);
    }
    /**
     * This function is used to change the ring stake amount 
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to change
     * @param {*} amount The new submit ring amount 
     * @param {*} callback 
     */

  }, {
    key: "goldRushRaffleChangeAmount",
    value: function goldRushRaffleChangeAmount(eventId, landTokenId, amount) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.triggerContract({
        methodName: 'changeAmount',
        abiKey: 'goldRushRaffle',
        abiString: this.ABIs['goldRushRaffle'].abi,
        contractParams: [eventId, _index["default"].pad0x(landTokenId), amount]
      }, callback);
    }
    /**
     * This function is used to change the dvm address
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to change
     * @param {*} subAddr The new submit dvm address 
     * @param {*} callback 
     */

  }, {
    key: "goldRushRaffleChangeSubAddr",
    value: function goldRushRaffleChangeSubAddr(eventId, landTokenId, subAddr) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.triggerContract({
        methodName: 'changeSubAddr',
        abiKey: 'goldRushRaffle',
        abiString: this.ABIs['goldRushRaffle'].abi,
        contractParams: [eventId, _index["default"].pad0x(landTokenId), subAddr]
      }, callback);
    }
    /**
     * This function is used to change join info.
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to change
     * @param {*} amount The new submit amount 
     * @param {*} subAddr The new submit dvm address 
     * @param {*} callback 
     */

  }, {
    key: "goldRushRaffleChangeInfo",
    value: function goldRushRaffleChangeInfo(eventId, landTokenId, amount, subAddr) {
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      return this.triggerContract({
        methodName: 'change',
        abiKey: 'goldRushRaffle',
        abiString: this.ABIs['goldRushRaffle'].abi,
        contractParams: [eventId, _index["default"].pad0x(landTokenId), amount, subAddr]
      }, callback);
    }
    /**
     * This function is used to exit Gold Rush event
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to exit
     * @param {*} callback 
     */

  }, {
    key: "goldRushRaffleExit",
    value: function goldRushRaffleExit(eventId, landTokenId) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.triggerContract({
        methodName: 'exit',
        abiKey: 'goldRushRaffle',
        abiString: this.ABIs['goldRushRaffle'].abi,
        contractParams: [eventId, _index["default"].pad0x(landTokenId)]
      }, callback);
    }
    /**
     * This function is used to redeem prize after lottery
     * 
     * _hashmessage = hash("${address(this)}${fromChainId}${toChainId}${eventId}${_landId}${_won}")
     * 
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to draw
     * @param {*} isWon Is winner
     * @param {*} toChainId The chainId for receiving network
     * @param {*} signature _v, _r, _s are from supervisor's signature on _hashmessage while the _hashmessage is signed by supervisor.
     * @param {*} callback 
     */

  }, {
    key: "goldRushRaffleDraw",
    value: function goldRushRaffleDraw(eventId, landTokenId, isWon, _ref8) {
      var hashmessage = _ref8.hashmessage,
          v = _ref8.v,
          r = _ref8.r,
          s = _ref8.s;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      return this.triggerContract({
        methodName: 'draw',
        abiKey: 'goldRushRaffle',
        abiString: this.ABIs['goldRushRaffle'].abi,
        contractParams: [eventId, _index["default"].pad0x(landTokenId), isWon, hashmessage, v, r, s]
      }, callback);
    }
    /**
     * check the land is valid
     * @param {*} landTokenId The land token id which to check
     */

  }, {
    key: "goldRushRaffleLandCheck",
    value: function goldRushRaffleLandCheck(landTokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.callContract({
        methodName: 'check',
        abiKey: 'goldRushRaffle',
        abiString: this.ABIs['goldRushRaffle'].abi,
        contractParams: [_index["default"].pad0x(landTokenId)]
      }, callback);
    }
    /**
     * Get info of Raffle by eventId and landTokenId.
     * @param {*} eventId Gold Rush Event ID
     * @param {*} landTokenId The land token id which to query
     * @param {*} callback 
     */

  }, {
    key: "goldRushRaffleGetHistory",
    value: function goldRushRaffleGetHistory(eventId, landTokenId) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.callContract({
        methodName: 'lands',
        abiKey: 'goldRushRaffle',
        contractParams: [eventId, _index["default"].pad0x(landTokenId)]
      }, callback);
    }
  }]);

  return TronEvolutionLand;
}();

var _default = TronEvolutionLand;
exports["default"] = _default;