"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.date.now.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime.js");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _ethereumjsTx = _interopRequireDefault(require("ethereumjs-tx"));

var _env = require("./env");

var _clientFetch = _interopRequireDefault(require("../utils/clientFetch"));

var _index = _interopRequireDefault(require("../utils/index"));

var _uniswap = _interopRequireDefault(require("../utils/uniswap"));

var _sdk = require("@uniswap/sdk");

var _liquidityStaker = _interopRequireDefault(require("../api/liquidityStaker"));

var _erc = _interopRequireDefault(require("../api/erc20"));

var _erc2 = _interopRequireDefault(require("../api/erc1155"));

var _pets = _interopRequireDefault(require("../api/pets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var loop = function loop() {}; // fix metamask approve bug.  https://github.com/MetaMask/metamask-extension/issues/10679


var FIX_METAMASK_APPROVE = true;
/**
 * @class
 * Evolution Land for Ethereum
 */

var EthereumEvolutionLand = /*#__PURE__*/function () {
  /**
   * constructor function.
   * @param {object} web3js - web3js instance
   * @param {string} network
   */
  function EthereumEvolutionLand(web3js, network) {
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, EthereumEvolutionLand);

    this.version = '1.0.0';
    this._web3js = web3js;
    this.env = (0, _env.Env)(network);
    this.ABIs = (0, _env.getABIConfig)(network);
    this.ABIClientFetch = new _clientFetch["default"]({
      baseUrl: this.env.ABI_DOMAIN,
      evoNetwork: 'eth'
    });
    this.ClientFetch = new _clientFetch["default"]({
      baseUrl: this.env.DOMAIN,
      evoNetwork: 'eth'
    });
    this.option = _objectSpread({
      sign: true,
      address: null
    }, option);
  }

  _createClass(EthereumEvolutionLand, [{
    key: "setCustomAccount",
    value: function setCustomAccount(account) {
      this.option.address = account;
    }
    /**
     * get web3js Current address.
     * @returns {Promise<any>}
     */

  }, {
    key: "getCurrentAccount",
    value: function getCurrentAccount() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (_this.option.address) {
          resolve(_this.option.address);
        }

        _this._web3js.eth.getAccounts(function (error, accounts) {
          if (error) {
            reject(error);
          } else {
            resolve(accounts[0]);
          }
        });
      });
    }
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
      var _triggerContract = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
        var methodName,
            abiKey,
            abiString,
            _ref$contractParams,
            contractParams,
            _ref$sendParams,
            sendParams,
            _ref2,
            _ref2$beforeFetch,
            beforeFetch,
            _ref2$transactionHash,
            transactionHashCallback,
            _ref2$confirmationCal,
            confirmationCallback,
            _ref2$receiptCallback,
            receiptCallback,
            _ref2$errorCallback,
            errorCallback,
            _ref2$receiptFinal,
            receiptFinal,
            _ref2$unSignedTx,
            unSignedTx,
            _ref2$payload,
            payload,
            _contract,
            contractAddress,
            extendPayload,
            _method,
            from,
            gasRes,
            estimateGas,
            hexSendParams,
            _hexSendParams,
            tx,
            serializedTx,
            _contractAddress,
            _extendPayload,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                methodName = _ref.methodName, abiKey = _ref.abiKey, abiString = _ref.abiString, _ref$contractParams = _ref.contractParams, contractParams = _ref$contractParams === void 0 ? [] : _ref$contractParams, _ref$sendParams = _ref.sendParams, sendParams = _ref$sendParams === void 0 ? {} : _ref$sendParams;
                _ref2 = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, _ref2$beforeFetch = _ref2.beforeFetch, beforeFetch = _ref2$beforeFetch === void 0 ? loop : _ref2$beforeFetch, _ref2$transactionHash = _ref2.transactionHashCallback, transactionHashCallback = _ref2$transactionHash === void 0 ? loop : _ref2$transactionHash, _ref2$confirmationCal = _ref2.confirmationCallback, confirmationCallback = _ref2$confirmationCal === void 0 ? loop : _ref2$confirmationCal, _ref2$receiptCallback = _ref2.receiptCallback, receiptCallback = _ref2$receiptCallback === void 0 ? loop : _ref2$receiptCallback, _ref2$errorCallback = _ref2.errorCallback, errorCallback = _ref2$errorCallback === void 0 ? loop : _ref2$errorCallback, _ref2$receiptFinal = _ref2.receiptFinal, receiptFinal = _ref2$receiptFinal === void 0 ? loop : _ref2$receiptFinal, _ref2$unSignedTx = _ref2.unSignedTx, unSignedTx = _ref2$unSignedTx === void 0 ? loop : _ref2$unSignedTx, _ref2$payload = _ref2.payload, payload = _ref2$payload === void 0 ? {} : _ref2$payload;
                _context.prev = 2;
                beforeFetch && beforeFetch();
                _contract = null;
                contractAddress = this.getContractAddress(abiKey);
                _contract = new this._web3js.eth.Contract(abiString, contractAddress);
                extendPayload = _objectSpread(_objectSpread({}, payload), {}, {
                  _contractAddress: contractAddress
                });
                _method = _contract.methods[methodName].apply(this, contractParams);
                _context.next = 11;
                return this.getCurrentAccount();

              case 11:
                from = _context.sent;
                _context.next = 14;
                return this.ClientFetch.apiGasPrice({
                  wallet: this.option.address || from
                });

              case 14:
                gasRes = _context.sent;
                estimateGas = null;
                _context.prev = 16;
                hexSendParams = {
                  value: 0
                };
                Object.keys(sendParams).forEach(function (item) {
                  hexSendParams[item] = _index["default"].toHex(sendParams[item]);
                });
                _context.next = 21;
                return this.estimateGas(_method, this.option.address || from, hexSendParams.value);

              case 21:
                estimateGas = _context.sent;
                _context.next = 27;
                break;

              case 24:
                _context.prev = 24;
                _context.t0 = _context["catch"](16);
                console.log('estimateGas', _context.t0);

              case 27:
                if (this.option.sign) {
                  _context.next = 53;
                  break;
                }

                if (this.option.address) {
                  _context.next = 30;
                  break;
                }

                throw Error('from account is empty!');

              case 30:
                _hexSendParams = {};
                Object.keys(sendParams).forEach(function (item) {
                  _hexSendParams[item] = _index["default"].toHex(sendParams[item]);
                });
                _context.t1 = _ethereumjsTx["default"];
                _context.t2 = _objectSpread;
                _context.t3 = _objectSpread;
                _context.t4 = contractAddress;
                _context.t5 = gasRes.data.nonce;
                _context.t6 = _index["default"].toHex(gasRes.data.gas_price.standard);
                _context.t7 = parseInt;
                _context.next = 41;
                return this.getNetworkId();

              case 41:
                _context.t8 = _context.sent;
                _context.t9 = (0, _context.t7)(_context.t8);
                _context.t10 = _method ? _method.encodeABI() : '';
                _context.t11 = {
                  to: _context.t4,
                  value: 0,
                  nonce: _context.t5,
                  gasPrice: _context.t6,
                  chainId: _context.t9,
                  data: _context.t10
                };
                _context.t12 = estimateGas ? {
                  gasLimit: _index["default"].toHex(estimateGas + 30000)
                } : {};
                _context.t13 = (0, _context.t3)(_context.t11, _context.t12);
                _context.t14 = _hexSendParams;
                _context.t15 = (0, _context.t2)(_context.t13, _context.t14);
                tx = new _context.t1(_context.t15);
                serializedTx = tx.serialize().toString("hex");
                unSignedTx && unSignedTx(serializedTx, extendPayload);
                return _context.abrupt("return", serializedTx);

              case 53:
                _context.t16 = _method;
                _context.t17 = _objectSpread;
                _context.t18 = _objectSpread;
                _context.next = 58;
                return this.getCurrentAccount();

              case 58:
                _context.t19 = _context.sent;
                _context.t20 = {
                  from: _context.t19,
                  value: 0
                };
                _context.t21 = estimateGas ? {
                  gasLimit: _index["default"].toHex(estimateGas + 30000)
                } : {};
                _context.t22 = (0, _context.t18)(_context.t20, _context.t21);
                _context.t23 = sendParams;
                _context.t24 = (0, _context.t17)(_context.t22, _context.t23);
                return _context.abrupt("return", _context.t16.send.call(_context.t16, _context.t24).once('transactionHash', function (hash) {
                  transactionHashCallback && transactionHashCallback(hash, extendPayload);
                }).once('confirmation', function (confirmationNumber, receipt) {
                  confirmationCallback && confirmationCallback(confirmationNumber, receipt, extendPayload);
                }).once('receipt', function (receipt) {
                  receiptCallback && receiptCallback(receipt, extendPayload);
                }).once('error', function (error) {
                  errorCallback && errorCallback(error, extendPayload);
                }));

              case 67:
                _context.prev = 67;
                _context.t25 = _context["catch"](2);
                console.error('triggerContract', _context.t25);
                _contractAddress = this.getContractAddress(abiKey);
                _extendPayload = _objectSpread(_objectSpread({}, payload), {}, {
                  _contractAddress: _contractAddress
                });
                errorCallback && errorCallback(_context.t25, _extendPayload);

              case 73:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 67], [16, 24]]);
      }));

      function triggerContract(_x) {
        return _triggerContract.apply(this, arguments);
      }

      return triggerContract;
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
    key: "callContract",
    value: function () {
      var _callContract = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
        var methodName,
            abiKey,
            abiString,
            _ref3$contractParams,
            contractParams,
            _ref4,
            _ref4$beforeFetch,
            beforeFetch,
            _ref4$errorCallback,
            errorCallback,
            _contract,
            contractAddress,
            _method,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                methodName = _ref3.methodName, abiKey = _ref3.abiKey, abiString = _ref3.abiString, _ref3$contractParams = _ref3.contractParams, contractParams = _ref3$contractParams === void 0 ? [] : _ref3$contractParams;
                _ref4 = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {}, _ref4$beforeFetch = _ref4.beforeFetch, beforeFetch = _ref4$beforeFetch === void 0 ? loop : _ref4$beforeFetch, _ref4$errorCallback = _ref4.errorCallback, errorCallback = _ref4$errorCallback === void 0 ? loop : _ref4$errorCallback;
                _context2.prev = 2;
                beforeFetch && beforeFetch();
                _contract = null;
                contractAddress = this.getContractAddress(abiKey);
                _contract = new this._web3js.eth.Contract(abiString, contractAddress);
                _method = _contract.methods[methodName].apply(this, contractParams);
                _context2.t0 = _method;
                _context2.next = 11;
                return this.getCurrentAccount();

              case 11:
                _context2.t1 = _context2.sent;
                _context2.t2 = {
                  from: _context2.t1
                };
                return _context2.abrupt("return", _context2.t0.call.call(_context2.t0, _context2.t2));

              case 16:
                _context2.prev = 16;
                _context2.t3 = _context2["catch"](2);
                console.error('triggerContract', _context2.t3);
                errorCallback && errorCallback(_context2.t3);

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 16]]);
      }));

      function callContract(_x2) {
        return _callContract.apply(this, arguments);
      }

      return callContract;
    }()
    /**
     * Get the contract address of evolution land by key.
     * @param {*} tokenKey ring | kton | gold ... 
     */

  }, {
    key: "getContractAddress",
    value: function getContractAddress(tokenKey) {
      var token = this.ABIs[tokenKey] && this.ABIs[tokenKey].address || tokenKey; // if(Array.isArray(tokenKey) && tokenKey.length === 2) {
      //     const pair = await this.getDerivedPairInfo(...tokenKey)
      //     token = pair.liquidityToken.address
      // }

      return token;
    }
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
        abiString: this.ABIs['erc721'].abi,
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
      var _erc721IsApprovedOrOwner = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(spender, contractAddress, tokenId) {
        var owner, approvedAddress, isApprovedForAll;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.callContract({
                  methodName: 'ownerOf',
                  abiKey: contractAddress,
                  abiString: this.ABIs['erc721'].abi,
                  contractParams: [tokenId]
                });

              case 2:
                owner = _context3.sent;
                _context3.next = 5;
                return this.callContract({
                  methodName: 'getApproved',
                  abiKey: contractAddress,
                  abiString: this.ABIs['erc721'].abi,
                  contractParams: [tokenId]
                });

              case 5:
                approvedAddress = _context3.sent;
                _context3.next = 8;
                return this.erc721IsApprovedForAll(owner, spender, contractAddress);

              case 8:
                isApprovedForAll = _context3.sent;
                return _context3.abrupt("return", owner.toLowerCase() === spender.toLowerCase() || approvedAddress.toLowerCase() === spender.toLowerCase() || isApprovedForAll);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function erc721IsApprovedOrOwner(_x3, _x4, _x5) {
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
        abiString: this.ABIs['erc721'].abi,
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
      var _erc721Approve = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(to, tokenId, contractAddress) {
        var callback,
            _args4 = arguments;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                callback = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};
                return _context4.abrupt("return", this.triggerContract({
                  methodName: 'approve',
                  abiKey: contractAddress,
                  abiString: this.ABIs['erc721'].abi,
                  contractParams: [to, tokenId]
                }, callback));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function erc721Approve(_x6, _x7, _x8) {
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
      var _erc721SetApprovalForAll = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(to, approved, contractAddress) {
        var callback,
            _args5 = arguments;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                callback = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : {};
                return _context5.abrupt("return", this.triggerContract({
                  methodName: 'setApprovalForAll',
                  abiKey: contractAddress,
                  abiString: this.ABIs['erc721'].abi,
                  contractParams: [to, approved]
                }, callback));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function erc721SetApprovalForAll(_x9, _x10, _x11) {
        return _erc721SetApprovalForAll.apply(this, arguments);
      }

      return erc721SetApprovalForAll;
    }()
    /**
     * Atlantis swap fee
     * @param {string} value amount of rings to be swaped
     * @param {*} callback 
     */

  }, {
    key: "fetchAtlantisSwapFee",
    value: function () {
      var _fetchAtlantisSwapFee = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(value) {
        var callback,
            _args6 = arguments;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                callback = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
                return _context6.abrupt("return", this.callContract({
                  methodName: 'querySwapFee',
                  abiKey: 'swapBridge',
                  abiString: this.ABIs['swapBridge'].abi,
                  contractParams: [value]
                }, callback));

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function fetchAtlantisSwapFee(_x12) {
        return _fetchAtlantisSwapFee.apply(this, arguments);
      }

      return fetchAtlantisSwapFee;
    }()
  }, {
    key: "getSimpleBridgeStatus",
    value: function getSimpleBridgeStatus() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.callContract({
        methodName: 'paused',
        abiKey: 'swapBridge',
        abiString: this.ABIs['swapBridge'].abi,
        contractParams: []
      }, callback);
    }
    /**
     * Atlantis ring transfer to Byzantium
     * @param {string} value amount of rings to be swaped
     * @param {string} value tron address (bs58)
     * @param {*} callback 
     */

  }, {
    key: "AtlantisSwapBridge",
    value: function () {
      var _AtlantisSwapBridge = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(value, targetAddress) {
        var symbol,
            callback,
            fee,
            hexTargetAddress,
            extraData,
            _args7 = arguments;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                symbol = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : 'ring';
                callback = _args7.length > 3 && _args7[3] !== undefined ? _args7[3] : {};

                if (targetAddress) {
                  _context7.next = 4;
                  break;
                }

                throw Error('empty targetAddress');

              case 4:
                _context7.next = 6;
                return this.fetchAtlantisSwapFee(value);

              case 6:
                fee = _context7.sent;
                hexTargetAddress = _index["default"].decodeBase58Address(targetAddress);
                extraData = "".concat(_index["default"].toHexAndPadLeft(value)).concat(_index["default"].toHexAndPadLeft(2).slice(2)).concat(_index["default"].padLeft(hexTargetAddress.substring(2), 64, '0'));
                return _context7.abrupt("return", this.triggerContract({
                  methodName: 'approveAndCall',
                  abiKey: symbol.toLowerCase(),
                  abiString: this.ABIs['ring'].abi,
                  contractParams: [this.ABIs['swapBridge'].address, new _bignumber["default"](fee).plus(1).plus(new _bignumber["default"](value)).toFixed(0), extraData]
                }, callback));

              case 10:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function AtlantisSwapBridge(_x13, _x14) {
        return _AtlantisSwapBridge.apply(this, arguments);
      }

      return AtlantisSwapBridge;
    }()
    /**
     * Swap Ether to Ring token - Powered by uniswap.
     * @param {string} value - amount for Ring， unit of measurement(wei)
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "buyRingUniswap",
    value: function () {
      var _buyRingUniswap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(value) {
        var callback,
            RING,
            pair,
            route,
            amountIn,
            trade,
            slippageTolerance,
            amountInMax,
            path,
            to,
            deadline,
            outputAmount,
            _args8 = arguments;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                callback = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
                RING = new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token");
                _context8.next = 4;
                return _sdk.Fetcher.fetchPairData(_sdk.WETH[RING.chainId], RING);

              case 4:
                pair = _context8.sent;
                route = new _sdk.Route([pair], _sdk.WETH[RING.chainId]);
                amountIn = value;
                trade = new _sdk.Trade(route, new _sdk.TokenAmount(RING, amountIn), _sdk.TradeType.EXACT_OUTPUT);
                slippageTolerance = new _sdk.Percent('0', '10000'); // 30 bips, or 0.30%

                amountInMax = trade.maximumAmountIn(slippageTolerance).raw; // needs to be converted to e.g. hex

                path = [_sdk.WETH[RING.chainId].address, RING.address];
                _context8.next = 13;
                return this.getCurrentAccount();

              case 13:
                to = _context8.sent;
                // should be a checksummed recipient address
                deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

                outputAmount = trade.outputAmount.raw; // // needs to be converted to e.g. hex

                return _context8.abrupt("return", this.triggerContract({
                  methodName: 'swapETHForExactTokens',
                  abiKey: 'uniswapExchange',
                  abiString: this.ABIs['uniswapExchange'].abi,
                  contractParams: [outputAmount.toString(10), path, to, deadline],
                  sendParams: {
                    value: amountInMax.toString(10)
                  }
                }, callback));

              case 17:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function buyRingUniswap(_x15) {
        return _buyRingUniswap.apply(this, arguments);
      }

      return buyRingUniswap;
    }()
    /**
     * Swap Ring token to Ether - Powered by uniswap.
     * @param {string} value - amount for Ring， unit of measurement(wei)
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "sellRingUniswap",
    value: function () {
      var _sellRingUniswap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(value) {
        var callback,
            RING,
            pair,
            route,
            amountIn,
            trade,
            slippageTolerance,
            amountOutMin,
            path,
            to,
            deadline,
            inputAmount,
            _args9 = arguments;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                callback = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : {};
                RING = new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token");
                _context9.next = 4;
                return _sdk.Fetcher.fetchPairData(RING, _sdk.WETH[RING.chainId]);

              case 4:
                pair = _context9.sent;
                route = new _sdk.Route([pair], RING);
                amountIn = value;
                trade = new _sdk.Trade(route, new _sdk.TokenAmount(RING, amountIn), _sdk.TradeType.EXACT_INPUT);
                slippageTolerance = new _sdk.Percent('0', '10000'); // 30 bips, or 0.30%

                amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex

                path = [RING.address, _sdk.WETH[RING.chainId].address];
                _context9.next = 13;
                return this.getCurrentAccount();

              case 13:
                to = _context9.sent;
                // should be a checksummed recipient address
                deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

                inputAmount = trade.inputAmount.raw; // // needs to be converted to e.g. hex

                return _context9.abrupt("return", this.triggerContract({
                  methodName: 'swapExactTokensForETH',
                  abiKey: 'uniswapExchange',
                  abiString: this.ABIs['uniswapExchange'].abi,
                  contractParams: [inputAmount.toString(10), amountOutMin.toString(10), path, to, deadline],
                  sendParams: {
                    value: 0
                  }
                }, callback));

              case 17:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function sellRingUniswap(_x16) {
        return _sellRingUniswap.apply(this, arguments);
      }

      return sellRingUniswap;
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
      var _tokenTransfer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(value, to, symbol) {
        var callback,
            _args10 = arguments;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                callback = _args10.length > 3 && _args10[3] !== undefined ? _args10[3] : {};

                if (!(!to || to === "0x0000000000000000000000000000000000000000")) {
                  _context10.next = 3;
                  break;
                }

                return _context10.abrupt("return");

              case 3:
                return _context10.abrupt("return", this.triggerContract({
                  methodName: 'transfer',
                  abiKey: symbol,
                  abiString: this.ABIs['ring'].abi,
                  contractParams: [to, value]
                }, callback));

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function tokenTransfer(_x17, _x18, _x19) {
        return _tokenTransfer.apply(this, arguments);
      }

      return tokenTransfer;
    }()
    /**
     * Ethereum Function, Approve Ring to Uniswap Exchange
     * @param {*} callback 
     */

  }, {
    key: "approveRingToUniswap",
    value: function () {
      var _approveRingToUniswap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        var callback,
            value,
            _args11 = arguments;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                callback = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : {};
                value = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : "20000000000000000000000000";
                return _context11.abrupt("return", this.triggerContract({
                  methodName: 'approve',
                  abiKey: 'ring',
                  abiString: this.ABIs['ring'].abi,
                  contractParams: [this.ABIs['uniswapExchange'].address, value]
                }, callback));

              case 3:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function approveRingToUniswap() {
        return _approveRingToUniswap.apply(this, arguments);
      }

      return approveRingToUniswap;
    }()
    /**
     * Allows Uniswap to withdraw from your account multiple times, up to the value amount. 
     * @param {*} addressOrType ERC20 token contract address.
     * @param {*} value
     * @param {*} callback 
     */

  }, {
    key: "approveTokenToUniswap",
    value: function approveTokenToUniswap(addressOrType) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!addressOrType) {
        throw 'ethereum::approveTokenToUniswap: missing addressOrType param';
      }

      return this.triggerContract({
        methodName: 'approve',
        abiKey: addressOrType,
        abiString: this.ABIs['ring'].abi,
        contractParams: this.isEvolutionLandToken(addressOrType) && FIX_METAMASK_APPROVE ? [this.ABIs['uniswapExchange'].address] : [this.ABIs['uniswapExchange'].address, value]
      }, callback);
    }
    /**
     * Approve liquidity to uniswap
     * @param {*} tokenAType Token 0 contract address 
     * @param {*} tokenBType Token 1 contract address 
     * @param {*} value Approved value
     * @param {*} callback 
     */

  }, {
    key: "approveLiquidityTokenToUniswap",
    value: function () {
      var _approveLiquidityTokenToUniswap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(tokenAType, tokenBType) {
        var value,
            callback,
            pair,
            _args12 = arguments;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                value = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
                callback = _args12.length > 3 && _args12[3] !== undefined ? _args12[3] : {};

                if (!(!tokenAType || !tokenBType)) {
                  _context12.next = 4;
                  break;
                }

                throw 'ethereum::approveLiquidityTokenToUniswap: missing addressOrType param';

              case 4:
                _context12.next = 6;
                return this.getDerivedPairInfo(tokenAType, tokenBType);

              case 6:
                pair = _context12.sent;
                return _context12.abrupt("return", this.approveTokenToUniswap(pair.liquidityToken.address, value, callback));

              case 8:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function approveLiquidityTokenToUniswap(_x20, _x21) {
        return _approveLiquidityTokenToUniswap.apply(this, arguments);
      }

      return approveLiquidityTokenToUniswap;
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
      var _approveToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(tokenContractOrType, spender) {
        var value,
            callback,
            _args13 = arguments;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                value = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
                callback = _args13.length > 3 && _args13[3] !== undefined ? _args13[3] : {};

                if (spender) {
                  _context13.next = 4;
                  break;
                }

                return _context13.abrupt("return");

              case 4:
                return _context13.abrupt("return", this.triggerContract({
                  methodName: 'approve',
                  abiKey: tokenContractOrType,
                  abiString: this.ABIs['ring'].abi,
                  contractParams: this.isEvolutionLandToken(tokenContractOrType) && FIX_METAMASK_APPROVE ? [spender] : [spender, value]
                }, callback));

              case 5:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function approveToken(_x22, _x23) {
        return _approveToken.apply(this, arguments);
      }

      return approveToken;
    }()
    /**
     * Approve uniswap liquidity token to spender.
     * @param {*} tokenAType 
     * @param {*} tokenBType 
     * @param {*} value 
     * @param {*} callback 
     */

  }, {
    key: "approveUniswapLiquidityToken",
    value: function () {
      var _approveUniswapLiquidityToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(tokenAType, tokenBType, spender) {
        var value,
            callback,
            pair,
            _args14 = arguments;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                value = _args14.length > 3 && _args14[3] !== undefined ? _args14[3] : "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
                callback = _args14.length > 4 && _args14[4] !== undefined ? _args14[4] : {};

                if (!(!tokenAType || !tokenBType)) {
                  _context14.next = 4;
                  break;
                }

                throw 'ethereum::approveUniswapLiquidityToken: missing addressOrType param';

              case 4:
                _context14.next = 6;
                return this.getDerivedPairInfo(tokenAType, tokenBType);

              case 6:
                pair = _context14.sent;
                return _context14.abrupt("return", this.triggerContract({
                  methodName: 'approve',
                  abiKey: pair.liquidityToken.address,
                  abiString: this.ABIs['ring'].abi,
                  contractParams: [spender, value]
                }, callback));

              case 8:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function approveUniswapLiquidityToken(_x24, _x25, _x26) {
        return _approveUniswapLiquidityToken.apply(this, arguments);
      }

      return approveUniswapLiquidityToken;
    }()
    /**
     * Check if uniswap has sufficient transfer authority
     * @param {*} amount
     * @param {*} tokenAddressOrType
     * @param {*} account
     */

  }, {
    key: "checkUniswapAllowance",
    value: function () {
      var _checkUniswapAllowance = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(amount) {
        var tokenAddressOrType,
            account,
            from,
            token,
            erc20Contract,
            allowanceAmount,
            _args15 = arguments;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                tokenAddressOrType = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : 'ring';
                account = _args15.length > 2 ? _args15[2] : undefined;
                _context15.t0 = account;

                if (_context15.t0) {
                  _context15.next = 7;
                  break;
                }

                _context15.next = 6;
                return this.getCurrentAccount();

              case 6:
                _context15.t0 = _context15.sent;

              case 7:
                from = _context15.t0;
                token = this.getContractAddress(tokenAddressOrType);
                erc20Contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, token);
                _context15.next = 12;
                return erc20Contract.methods.allowance(from, this.ABIs['uniswapExchange'].address).call();

              case 12:
                allowanceAmount = _context15.sent;
                return _context15.abrupt("return", !_index["default"].toBN(allowanceAmount).lt(_index["default"].toBN(amount || '1000000000000000000000000')));

              case 14:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function checkUniswapAllowance(_x27) {
        return _checkUniswapAllowance.apply(this, arguments);
      }

      return checkUniswapAllowance;
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
      var _checkTokenAllowance = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(amount, tokenAddressOrType, account, spender) {
        var from, token, erc20Contract, allowanceAmount;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                if (!(!amount || !tokenAddressOrType || !spender)) {
                  _context16.next = 2;
                  break;
                }

                throw 'ethereum::checkTokenAllowance: missing param';

              case 2:
                _context16.t0 = account;

                if (_context16.t0) {
                  _context16.next = 7;
                  break;
                }

                _context16.next = 6;
                return this.getCurrentAccount();

              case 6:
                _context16.t0 = _context16.sent;

              case 7:
                from = _context16.t0;
                token = this.getContractAddress(tokenAddressOrType);
                erc20Contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, token);
                _context16.next = 12;
                return erc20Contract.methods.allowance(from, spender).call();

              case 12:
                allowanceAmount = _context16.sent;
                return _context16.abrupt("return", !_index["default"].toBN(allowanceAmount).lt(_index["default"].toBN(amount || '1000000000000000000000000')));

              case 14:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function checkTokenAllowance(_x28, _x29, _x30, _x31) {
        return _checkTokenAllowance.apply(this, arguments);
      }

      return checkTokenAllowance;
    }()
    /**
     * get amount of ether in uniswap exchange 
     */

  }, {
    key: "getUniswapEthBalance",
    value: function () {
      var _getUniswapEthBalance = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
        var RING, pair;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                RING = new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token");
                _context17.next = 3;
                return _sdk.Fetcher.fetchPairData(_sdk.WETH[RING.chainId], RING);

              case 3:
                pair = _context17.sent;
                return _context17.abrupt("return", pair.tokenAmounts[0].token.equals(_sdk.WETH[RING.chainId]) ? pair.tokenAmounts[0].raw.toString(10) : pair.tokenAmounts[1].raw.toString(10));

              case 5:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function getUniswapEthBalance() {
        return _getUniswapEthBalance.apply(this, arguments);
      }

      return getUniswapEthBalance;
    }()
    /**
    * get amount of ring in uniswap exchange 
    */

  }, {
    key: "getUniswapTokenBalance",
    value: function () {
      var _getUniswapTokenBalance = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
        var RING, pair;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                RING = new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token");
                _context18.next = 3;
                return _sdk.Fetcher.fetchPairData(_sdk.WETH[RING.chainId], RING);

              case 3:
                pair = _context18.sent;
                return _context18.abrupt("return", pair.tokenAmounts[0].token.equals(RING) ? pair.tokenAmounts[0].raw.toString(10) : pair.tokenAmounts[1].raw.toString(10));

              case 5:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function getUniswapTokenBalance() {
        return _getUniswapTokenBalance.apply(this, arguments);
      }

      return getUniswapTokenBalance;
    }()
    /**
     * Eth will be cost to swap 1 Ring
     * @param {*} tokens_bought
     */

  }, {
    key: "getEthToTokenOutputPrice",
    value: function () {
      var _getEthToTokenOutputPrice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
        var tokens_bought,
            RING,
            pair,
            route,
            amountIn,
            trade,
            slippageTolerance,
            amountInMax,
            _args19 = arguments;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                tokens_bought = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : '1000000000000000000';
                RING = new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token");
                _context19.next = 4;
                return _sdk.Fetcher.fetchPairData(_sdk.WETH[RING.chainId], RING);

              case 4:
                pair = _context19.sent;
                route = new _sdk.Route([pair], _sdk.WETH[RING.chainId]);
                amountIn = tokens_bought;
                trade = new _sdk.Trade(route, new _sdk.TokenAmount(RING, amountIn), _sdk.TradeType.EXACT_OUTPUT);
                slippageTolerance = new _sdk.Percent('0', '10000');
                amountInMax = trade.maximumAmountIn(slippageTolerance).raw;
                return _context19.abrupt("return", [new _bignumber["default"](amountInMax.toString(10)).times('1000000000000000000').div(tokens_bought).toFixed(0), amountInMax.toString(10)]);

              case 11:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function getEthToTokenOutputPrice() {
        return _getEthToTokenOutputPrice.apply(this, arguments);
      }

      return getEthToTokenOutputPrice;
    }()
    /**
    * Eth will be got to swap 1 Ring
    * @param {*} tokens_bought
    */

  }, {
    key: "getTokenToEthInputPrice",
    value: function () {
      var _getTokenToEthInputPrice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
        var tokens_bought,
            RING,
            pair,
            route,
            amountIn,
            trade,
            slippageTolerance,
            amountOutMin,
            _args20 = arguments;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                tokens_bought = _args20.length > 0 && _args20[0] !== undefined ? _args20[0] : '1000000000000000000';
                RING = new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token");
                _context20.next = 4;
                return _sdk.Fetcher.fetchPairData(RING, _sdk.WETH[RING.chainId]);

              case 4:
                pair = _context20.sent;
                route = new _sdk.Route([pair], RING);
                amountIn = tokens_bought; // 1 WETH

                trade = new _sdk.Trade(route, new _sdk.TokenAmount(RING, amountIn), _sdk.TradeType.EXACT_INPUT);
                slippageTolerance = new _sdk.Percent('0', '10000'); // 50 bips, or 0.50%

                amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex

                return _context20.abrupt("return", [new _bignumber["default"](amountOutMin.toString(10)).times('1000000000000000000').div(tokens_bought).toFixed(0), amountOutMin.toString(10)]);

              case 11:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function getTokenToEthInputPrice() {
        return _getTokenToEthInputPrice.apply(this, arguments);
      }

      return getTokenToEthInputPrice;
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
        abiString: this.ABIs['auction'].abi,
        contractParams: ['0x' + tokenId]
      }, callback);
    }
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
      var data = finalReferrer && _index["default"].isAddress(finalReferrer) ? "0x".concat(tokenId).concat(_index["default"].padLeft(finalReferrer.substring(2), 64, '0')) : "0x".concat(tokenId);
      return this.triggerContract({
        methodName: 'transfer',
        abiKey: 'ring',
        abiString: this.ABIs['ring'].abi,
        contractParams: [this.ABIs['auction'].address, amount, data]
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
      var _setLandPrice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(tokenId, start, end, duration) {
        var callback,
            from,
            _from,
            _start,
            _end,
            _duration,
            data,
            _args21 = arguments;

        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                callback = _args21.length > 4 && _args21[4] !== undefined ? _args21[4] : {};
                _context21.next = 3;
                return this.getCurrentAccount();

              case 3:
                from = _context21.sent;
                _from = _index["default"].padLeft(from.slice(2), 64, '0');
                _start = _index["default"].toHexAndPadLeft(start).slice(2);
                _end = _index["default"].toHexAndPadLeft(end).slice(2);
                _duration = _index["default"].toHexAndPadLeft(duration).slice(2);
                data = "0x".concat(_start).concat(_end).concat(_duration).concat(_from);
                return _context21.abrupt("return", this.triggerContract({
                  methodName: 'approveAndCall',
                  abiKey: 'land',
                  abiString: this.ABIs['land'].abi,
                  contractParams: [this.ABIs['auction'].address, '0x' + tokenId, data]
                }, callback));

              case 10:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function setLandPrice(_x32, _x33, _x34, _x35) {
        return _setLandPrice.apply(this, arguments);
      }

      return setLandPrice;
    }()
    /**
     * Bid Land Assets with Ether.
     * @param tokenId - tokenid of land
     * @param referer - Referrer address
     * @param value - bid price with ether
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "buyLandWithETHContract",
    value: function buyLandWithETHContract(tokenId, referer, value) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.triggerContract({
        methodName: "bidWithETH",
        abiString: this.ABIs['auction'].abi,
        contractParams: ['0x' + tokenId, referer],
        abiKey: "auction",
        sendParams: {
          value: value
        }
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
    value: function withdrawRing(_ref5) {
      var nonce = _ref5.nonce,
          value = _ref5.value,
          hash = _ref5.hash,
          v = _ref5.v,
          r = _ref5.r,
          s = _ref5.s;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: "takeBack",
        abiKey: "withdraw",
        abiString: this.ABIs['withdraw'].abi,
        contractParams: [nonce, value, hash, v, r, s]
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
    value: function withdrawKton(_ref6) {
      var nonce = _ref6.nonce,
          value = _ref6.value,
          hash = _ref6.hash,
          v = _ref6.v,
          r = _ref6.r,
          s = _ref6.s;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: "takeBack",
        abiKey: "withdrawKton",
        abiString: this.ABIs['withdraw'].abi,
        contractParams: [nonce, value, hash, v, r, s]
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
        abiString: this.ABIs['auction'].abi,
        contractParams: ['0x' + tokenId],
        abiKey: "auction"
      }, callback);
    }
    /**
     * Convert Ring token to Ether via bancor exchange
     * @param amount - ring token amount
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "sellRing",
    value: function sellRing(amount) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'transfer',
        abiKey: 'ring',
        abiString: this.ABIs['ring'].abi,
        contractParams: [this.ABIs['bancor'].address, amount, '0x0000000000000000000000000000000000000000000000000000000000000001']
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
        methodName: 'transfer',
        abiKey: 'ring',
        abiString: this.ABIs['ring'].abi,
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
        methodName: 'transfer',
        abiKey: 'kton',
        abiString: this.ABIs['kton'].abi,
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
        abiString: this.ABIs['bank'].abi,
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
        abiString: this.ABIs['lottery'].abi,
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
        abiString: this.ABIs['rolesUpdater'].abi,
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
        methodName: 'transfer',
        abiKey: 'ring',
        abiString: this.ABIs['ring'].abi,
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
      var _transferFromLand = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(to, tokenId) {
        var callback,
            from,
            _args22 = arguments;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                callback = _args22.length > 2 && _args22[2] !== undefined ? _args22[2] : {};

                if (to) {
                  _context22.next = 3;
                  break;
                }

                return _context22.abrupt("return", null);

              case 3:
                _context22.next = 5;
                return this.getCurrentAccount();

              case 5:
                from = _context22.sent;
                return _context22.abrupt("return", this.triggerContract({
                  methodName: 'transferFrom',
                  abiKey: 'land',
                  abiString: this.ABIs['land'].abi,
                  contractParams: [from, to, '0x' + tokenId]
                }, callback));

              case 7:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function transferFromLand(_x36, _x37) {
        return _transferFromLand.apply(this, arguments);
      }

      return transferFromLand;
    }()
    /**
     *  claim resource on the Land
     * @param tokenId Land token Id.
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "claimLandResource",
    value: function claimLandResource(tokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'claimLandResource',
        abiKey: 'apostleLandResource',
        abiString: this.ABIs['apostleLandResource'].abi,
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
        methodName: 'transfer',
        abiKey: 'ring',
        abiString: this.ABIs['ring'].abi,
        contractParams: [this.ABIs['apostleAuction'].address, amount, data]
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
        abiString: this.ABIs['apostleAuction'].abi,
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
      var _apostleSell = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(tokenId, start, end, duration) {
        var callback,
            from,
            _from,
            _start,
            _end,
            _duration,
            data,
            _args23 = arguments;

        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                callback = _args23.length > 4 && _args23[4] !== undefined ? _args23[4] : {};
                _context23.next = 3;
                return this.getCurrentAccount();

              case 3:
                from = _context23.sent;
                _from = _index["default"].padLeft(from.slice(2), 64, '0');
                _start = _index["default"].toHexAndPadLeft(start).slice(2);
                _end = _index["default"].toHexAndPadLeft(end).slice(2);
                _duration = _index["default"].toHexAndPadLeft(duration).slice(2);
                data = "0x".concat(_start).concat(_end).concat(_duration).concat(_from);
                return _context23.abrupt("return", this.triggerContract({
                  methodName: 'approveAndCall',
                  abiKey: 'land',
                  abiString: this.ABIs['land'].abi,
                  contractParams: [this.ABIs['apostleAuction'].address, '0x' + tokenId, data]
                }, callback));

              case 10:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function apostleSell(_x38, _x39, _x40, _x41) {
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
        abiString: this.ABIs['apostleAuction'].abi,
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
        abiString: this.ABIs['apostleTakeBack'].abi,
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
        methodName: 'transfer',
        abiKey: 'ring',
        abiString: this.ABIs['ring'].abi,
        contractParams: [this.ABIs["apostleBase"].address, amount, "0x".concat(tokenId).concat(targetTokenId)]
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
        methodName: 'transfer',
        abiKey: 'ring',
        abiString: this.ABIs['ring'].abi,
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
      var _apostleBreedAuction = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(tokenId, start, end, duration) {
        var callback,
            from,
            _from,
            _start,
            _end,
            _duration,
            data,
            _args24 = arguments;

        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                callback = _args24.length > 4 && _args24[4] !== undefined ? _args24[4] : {};
                _context24.next = 3;
                return this.getCurrentAccount();

              case 3:
                from = _context24.sent;
                _from = _index["default"].padLeft(from.slice(2), 64, '0');
                _start = _index["default"].toHexAndPadLeft(start).slice(2);
                _end = _index["default"].toHexAndPadLeft(end).slice(2);
                _duration = _index["default"].toHexAndPadLeft(duration).slice(2);
                data = "0x".concat(_start).concat(_end).concat(_duration).concat(_from);
                return _context24.abrupt("return", this.triggerContract({
                  methodName: 'approveAndCall',
                  abiKey: 'land',
                  abiString: this.ABIs['land'].abi,
                  contractParams: [this.ABIs['apostleSiringAuction'].address, '0x' + tokenId, data]
                }, callback));

              case 10:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function apostleBreedAuction(_x42, _x43, _x44, _x45) {
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
        abiKey: 'apostleSiringAuction',
        abiString: this.ABIs['apostleSiringAuction'].abi,
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
      var _apostleTransfer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(toAddress, tokenId) {
        var callback,
            from,
            _args25 = arguments;
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                callback = _args25.length > 2 && _args25[2] !== undefined ? _args25[2] : {};
                _context25.next = 3;
                return this.getCurrentAccount();

              case 3:
                from = _context25.sent;
                return _context25.abrupt("return", this.triggerContract({
                  methodName: 'transferFrom',
                  abiKey: 'land',
                  abiString: this.ABIs['land'].abi,
                  contractParams: [from, toAddress, '0x' + tokenId]
                }, callback));

              case 5:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function apostleTransfer(_x46, _x47) {
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
        abiString: this.ABIs['apostleLandResource'].abi,
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
        abiString: this.ABIs['apostleLandResource'].abi,
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
        abiString: this.ABIs['apostleTokenUse'].abi,
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
        abiString: this.ABIs['land'].abi,
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
        abiString: this.ABIs['apostleTokenUse'].abi,
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
        methodName: 'transfer',
        abiKey: 'ring',
        abiString: this.ABIs['ring'].abi,
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
        abiString: this.ABIs['apostleBase'].abi,
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
        methodName: 'transfer',
        abiKey: element.toLowerCase(),
        abiString: this.ABIs['ring'].abi,
        contractParams: [this.ABIs['apostleBase'].address, new _bignumber["default"](level).times(new _bignumber["default"](levelUnitPrice)).toFixed(), "0x".concat(motherTokenId).concat(_index["default"].toHexAndPadLeft(level).slice(2))]
      }, callback);
    }
    /**
     * Bind pet
     * @param originNftAddress
     * @param originTokenId
     * @param apostleTokenId
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "bridgeInAndTie",
    value: function bridgeInAndTie(originNftAddress, originTokenId, apostleTokenId) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.triggerContract({
        methodName: 'bridgeInAndTie',
        abiKey: 'petBase',
        abiString: this.ABIs['petBase'].abi,
        contractParams: [originNftAddress, originTokenId, '0x' + apostleTokenId]
      }, callback);
    }
    /**
     * Unbind pet
     * @param petTokenId
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "untiePetToken",
    value: function untiePetToken(petTokenId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.triggerContract({
        methodName: 'untiePetToken',
        abiKey: 'petBase',
        abiString: this.ABIs['petBase'].abi,
        contractParams: ['0x' + petTokenId]
      }, callback);
    }
    /**
     * buy lucky box
     * @param {*} buyer - Receiver
     * @param {*} goldBoxAmount - gold box amount
     * @param {*} silverBoxAmount - silver box amount
     */

  }, {
    key: "buyLuckyBox",
    value: function () {
      var _buyLuckyBox = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(buyer, goldBoxAmount, silverBoxAmount, callback) {
        var luckyBoxInfo, cost;
        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.next = 2;
                return this.getLuckyBoxInfo();

              case 2:
                luckyBoxInfo = _context26.sent;
                cost = _index["default"].toBN(luckyBoxInfo[0]).muln(goldBoxAmount).add(_index["default"].toBN(luckyBoxInfo[1]).muln(silverBoxAmount));
                return _context26.abrupt("return", this.triggerContract({
                  methodName: 'buyBoxs',
                  abiKey: 'luckybag',
                  abiString: this.ABIs['luckybag'].abi,
                  contractParams: [buyer, goldBoxAmount, silverBoxAmount],
                  sendParams: {
                    value: cost
                  }
                }, callback));

              case 5:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function buyLuckyBox(_x48, _x49, _x50, _x51) {
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
    value: function getLuckyBoxInfo() {
      var _contract = new this._web3js.eth.Contract(this.ABIs['luckybag'].abi, this.ABIs['luckybag'].address);

      return Promise.all([_contract.methods.goldBoxPrice().call(), _contract.methods.silverBoxPrice().call(), _contract.methods.goldBoxAmountForSale().call(), _contract.methods.silverBoxAmountForSale().call(), _contract.methods.goldSaleLimit().call(), _contract.methods.silverSaleLimit().call()]);
    }
    /**
     * Number of lucky box already purchased at this address
     * @param {*} address - buyer
     * @returns {Array} - promise -> [goldSalesRecord, silverSalesRecord]
     */

  }, {
    key: "getLuckyBoxSalesRecord",
    value: function getLuckyBoxSalesRecord(address) {
      var _contract = new this._web3js.eth.Contract(this.ABIs['luckybag'].abi, this.ABIs['luckybag'].address);

      return Promise.all([_contract.methods.goldSalesRecord(address).call(), _contract.methods.silverSalesRecord(address).call()]);
    }
    /**
     * get furnace treasure price
     * @returns {} - promise -> {0: "1026000000000000000000", 1: "102000000000000000000", priceGoldBox: "1026000000000000000000", priceSilverBox: "102000000000000000000"}
     */

  }, {
    key: "getFurnaceTreasurePrice",
    value: function getFurnaceTreasurePrice() {
      var _contract = new this._web3js.eth.Contract(this.ABIs['itemTreasure'].abi, this.ABIs['itemTreasure'].address);

      return _contract.methods.getPrice().call();
    }
  }, {
    key: "getFurnaceTakeBackNonce",
    value: function getFurnaceTakeBackNonce(address) {
      var _contract = new this._web3js.eth.Contract(this.ABIs['itemTakeBack'].abi, this.ABIs['itemTakeBack'].address);

      return _contract.methods.userToNonce(address).call();
    }
    /**
     * buy lucky box
     * @param {*} goldBoxAmount - gold box amount
     * @param {*} silverBoxAmount - silver box amount
     */

  }, {
    key: "buyFurnaceTreasure",
    value: function () {
      var _buyFurnaceTreasure = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27() {
        var goldBoxAmount,
            silverBoxAmount,
            callback,
            treasurePrice,
            cost,
            data,
            _args27 = arguments;
        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                goldBoxAmount = _args27.length > 0 && _args27[0] !== undefined ? _args27[0] : 0;
                silverBoxAmount = _args27.length > 1 && _args27[1] !== undefined ? _args27[1] : 0;
                callback = _args27.length > 2 ? _args27[2] : undefined;
                _context27.next = 5;
                return this.getFurnaceTreasurePrice();

              case 5:
                treasurePrice = _context27.sent;
                cost = _index["default"].toBN(treasurePrice.priceGoldBox).muln(goldBoxAmount).add(_index["default"].toBN(treasurePrice.priceSilverBox).muln(silverBoxAmount)); // Function: transfer(address _to, uint256 _value, bytes _data) ***
                // data
                // 0000000000000000000000000000000000000000000000000000000000000001 gold box amount
                // 0000000000000000000000000000000000000000000000000000000000000002 silver box amount

                data = _index["default"].toTwosComplement(goldBoxAmount) + _index["default"].toTwosComplement(silverBoxAmount).substring(2, 66);
                return _context27.abrupt("return", this.triggerContract({
                  methodName: 'transfer',
                  abiKey: 'ring',
                  abiString: this.ABIs['ring'].abi,
                  contractParams: [this.ABIs['itemTreasure'].address, cost.toString(10), data],
                  sendParams: {
                    value: 0
                  }
                }, callback));

              case 9:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function buyFurnaceTreasure() {
        return _buyFurnaceTreasure.apply(this, arguments);
      }

      return buyFurnaceTreasure;
    }()
    /**
    *  open furnace treasure
    * @returns {Promise<PromiEvent<any>>}
    */

  }, {
    key: "openFurnaceTreasure",
    value: function openFurnaceTreasure(_ref7) {
      var boxIds = _ref7.boxIds,
          amounts = _ref7.amounts,
          hashmessage = _ref7.hashmessage,
          v = _ref7.v,
          r = _ref7.r,
          s = _ref7.s;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // During the process of opening the treasure chest, there is the logic of randomly gifting rings, 
      // which leads to inaccurate gas estimation, so manually set it to avoid out of gas.
      // https://etherscan.io/tx/0xe71f54aee8f7ab1dd15df955d09c79af5060f20e91c0c5ecfcf17f20c9bf02b3
      // https://etherscan.io/tx/0x7b04df9b55f33b6edcc402a5733dbc753a6bbe2f78af7c7bef6f3f4d8dce7491
      // no return ring - gas used - 229,289
      // https://etherscan.io/tx/0x4e1fc1dcec64bb497405126e55ab743368f1cb1cede945936937e0cde1d254e7
      // prize ring - gas used - 254,776 
      // https://etherscan.io/tx/0xd2b3f05b19e74627940edfe98daee31eeab84b67e88dcf0e77d595430b3b1afc
      var silverBoxGasLimit = this.env.NETWORK === '1' ? new _bignumber["default"](260000) : new _bignumber["default"](350000);
      var goldBoxGasLimit = this.env.NETWORK === '1' ? new _bignumber["default"](300000) : new _bignumber["default"](400000);
      var gasLimit = new _bignumber["default"](amounts[0]).lt('1000000000000000000000') ? silverBoxGasLimit : goldBoxGasLimit;

      if (amounts.length > 1) {
        for (var index = 1; index < amounts.length; index++) {
          var amount = amounts[index];
          gasLimit = gasLimit.plus(new _bignumber["default"](amount).lt('1000000000000000000000') ? silverBoxGasLimit : silverBoxGasLimit);
        }
      }

      return this.triggerContract({
        methodName: "openBoxes",
        abiString: this.ABIs['itemTakeBack'].abi,
        contractParams: [boxIds, amounts, hashmessage, v, r, s],
        sendParams: {
          value: 0,
          gasLimit: gasLimit.toFixed(0)
        },
        abiKey: "itemTakeBack"
      }, callback);
    }
  }, {
    key: "checkFurnaceTreasureStatus",
    value: function checkFurnaceTreasureStatus(id) {
      var _contract = new this._web3js.eth.Contract(this.ABIs['itemTakeBack'].abi, this.ABIs['itemTakeBack'].address);

      return _contract.methods.ids(id).call();
    }
    /**
     * Returns the amount of RING owned by account
     * @param {*} address 
     */

  }, {
    key: "getRingBalance",
    value: function getRingBalance(address) {
      var _contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, this.ABIs['ring'].address);

      return _contract.methods.balanceOf(address).call();
    }
    /**
     * Returns the amount of KTON owned by account
     * @param {*} address 
     */

  }, {
    key: "getKtonBalance",
    value: function getKtonBalance(address) {
      var _contract = new this._web3js.eth.Contract(this.ABIs['kton'].abi, this.ABIs['kton'].address);

      return _contract.methods.balanceOf(address).call();
    }
    /**
     * Returns the amount of tokens owned by account
     * @param {*} account 
     * @param {*} contractAddress 
     */

  }, {
    key: "getTokenBalance",
    value: function getTokenBalance(account, contractAddress) {
      var _contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, contractAddress);

      return _contract.methods.balanceOf(account).call();
    }
    /**
     * Get total supply of erc20 token
     * @param {*} contractAddress Erc20 contract address
     */

  }, {
    key: "getTokenTotalSupply",
    value: function getTokenTotalSupply(contractAddress) {
      var _contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, contractAddress);

      return _contract.methods.totalSupply().call();
    }
    /**
     * transfer evo land 721 object
     * @param {*} to recevier
     * @param {*} tokenId 721 tokenid
     * @param {*} callback 
     */

  }, {
    key: "transferFromObjectOwnership",
    value: function () {
      var _transferFromObjectOwnership = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(to, tokenId) {
        var callback,
            from,
            _args28 = arguments;
        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                callback = _args28.length > 2 && _args28[2] !== undefined ? _args28[2] : {};

                if (to) {
                  _context28.next = 3;
                  break;
                }

                return _context28.abrupt("return", null);

              case 3:
                _context28.next = 5;
                return this.getCurrentAccount();

              case 5:
                from = _context28.sent;
                return _context28.abrupt("return", this.triggerContract({
                  methodName: 'transferFrom',
                  abiKey: 'land',
                  abiString: this.ABIs['land'].abi,
                  contractParams: [from, to, '0x' + tokenId]
                }, callback));

              case 7:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function transferFromObjectOwnership(_x52, _x53) {
        return _transferFromObjectOwnership.apply(this, arguments);
      }

      return transferFromObjectOwnership;
    }()
    /**
     * Get uniswap Token info by lowercase symbol
     * 
     * Token - https://uniswap.org/docs/v2/SDK/token/
     * 
     * @param {*} tokenType  ring kton gold wood water fire soil
     */

  }, {
    key: "getUniswapToken",
    value: function getUniswapToken(tokenType) {
      switch (tokenType.toLowerCase()) {
        case 'ring':
          return new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token");

        case 'kton':
          return new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_KTON, 18, "KTON", "KTON");

        case 'gold':
          return new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_ELEMENT_GOLD, 18, "GOLD", "GOLD");

        case 'wood':
          return new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_ELEMENT_WOOD, 18, "WOOD", "WOOD");

        case 'water':
        case 'hoo':
          return new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_ELEMENT_WATER, 18, "WATER", "WATER");

        case 'fire':
          return new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_ELEMENT_FIRE, 18, "FIRE", "FIRE");

        case 'soil':
          return new _sdk.Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_ELEMENT_SOIL, 18, "SOIL", "SOIL");

        default:
          break;
      }
    }
    /**
     * Get uniswap pair info
     * @param {*} tokenA token address or lowercase symbol (ring kton gold wood water fire soil)
     * @param {*} tokenB token address or lowercase symbol (ring kton gold wood water fire soil)
     * @returns { pair } pair - https://uniswap.org/docs/v2/SDK/pair/
     */

  }, {
    key: "getDerivedPairInfo",
    value: function () {
      var _getDerivedPairInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(tokenA, tokenB) {
        var currencyA, currencyB, pair;
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                if (!(!tokenA || !tokenB)) {
                  _context29.next = 2;
                  break;
                }

                return _context29.abrupt("return");

              case 2:
                currencyA = this.getUniswapToken(tokenA);
                currencyB = this.getUniswapToken(tokenB);
                _context29.next = 6;
                return _sdk.Fetcher.fetchPairData(currencyA, currencyB);

              case 6:
                pair = _context29.sent;
                return _context29.abrupt("return", pair);

              case 8:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function getDerivedPairInfo(_x54, _x55) {
        return _getDerivedPairInfo.apply(this, arguments);
      }

      return getDerivedPairInfo;
    }()
    /**
     * Support for addUniswapLiquidity function, and the return router pair instances and elements are returned.
     * 
     * Only one account needs to be provided, and the other quantity needs to be provided according to the current pool price
     * 
     * tokenType - token address or lowercase symbol (ring kton gold wood water fire soil)
     * 
     * amount - amount in WEI
     * 
     * @param {*} param0 {token: tokenAType, amount: amountA}  
     * @param {*} param1 {token: tokenBType, amount: amountB}
     * @returns {*} {pair, parsedAmounts}  pair - https://uniswap.org/docs/v2/SDK/pair/   parsedAmounts - {token0address: amount, token1address: amount}
     */

  }, {
    key: "getDerivedMintInfo",
    value: function () {
      var _getDerivedMintInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(_ref8, _ref9) {
        var _parsedAmounts;

        var tokenAType, amountA, tokenBType, amountB, pair, totalSupply, independentToken, parsedAmounts;
        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                tokenAType = _ref8.token, amountA = _ref8.amount;
                tokenBType = _ref9.token, amountB = _ref9.amount;
                _context30.next = 4;
                return this.getDerivedPairInfo(tokenAType, tokenBType);

              case 4:
                pair = _context30.sent;
                _context30.t0 = _sdk.TokenAmount;
                _context30.t1 = pair.liquidityToken;
                _context30.next = 9;
                return this.getTokenTotalSupply(pair.liquidityToken.address);

              case 9:
                _context30.t2 = _context30.sent;
                totalSupply = new _context30.t0(_context30.t1, _context30.t2);
                independentToken = amountA ? {
                  token: this.getUniswapToken(tokenAType),
                  amount: amountA
                } : {
                  token: this.getUniswapToken(tokenBType),
                  amount: amountB
                };
                parsedAmounts = (_parsedAmounts = {}, _defineProperty(_parsedAmounts, pair.liquidityToken.address, totalSupply), _defineProperty(_parsedAmounts, pair.token0.address, new _sdk.TokenAmount(pair.token0, independentToken.token.equals(pair.token0) ? _sdk.JSBI.BigInt(independentToken.amount) : pair.priceOf(independentToken.token).quote(new _sdk.CurrencyAmount(independentToken.token, _sdk.JSBI.BigInt(independentToken.amount))).raw)), _defineProperty(_parsedAmounts, pair.token1.address, new _sdk.TokenAmount(pair.token1, independentToken.token.equals(pair.token1) ? _sdk.JSBI.BigInt(independentToken.amount) : pair.priceOf(independentToken.token).quote(new _sdk.CurrencyAmount(independentToken.token, _sdk.JSBI.BigInt(independentToken.amount))).raw)), _parsedAmounts);
                return _context30.abrupt("return", {
                  pair: pair,
                  parsedAmounts: parsedAmounts
                });

              case 14:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function getDerivedMintInfo(_x56, _x57) {
        return _getDerivedMintInfo.apply(this, arguments);
      }

      return getDerivedMintInfo;
    }()
    /**
     * Support for removeUniswapLiquidity function, assuming removal percentage of liquidity and the return router pair instances and elements are returned.
     * 
     * tokenType - token address or lowercase symbol (ring kton gold wood water fire soil)
     * 
     * pair - https://uniswap.org/docs/v2/SDK/pair/
     * 
     * TokenAmount - https://github.com/Uniswap/uniswap-sdk/blob/v2/src/entities/fractions/tokenAmount.ts
     * 
     * parsedAmounts - {
     * 
     *  LIQUIDITY_PERCENT: percent,
     * 
     *  liquidityTokenAddress: TokenAmount,
     * 
     *  token0Address: TokenAmount,
     * 
     *  token1Address: TokenAmount
     * 
     * }
     * 
     * @param {*} tokenAType 
     * @param {*} tokenBType 
     * @param {*} liquidityValue The value of liquidity removed
     * @param {*} to 
     * @returns {*} {pair, parsedAmounts}
     */

  }, {
    key: "getDerivedBurnInfo",
    value: function () {
      var _getDerivedBurnInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(tokenAType, tokenBType, liquidityValue, to) {
        var _parsedAmounts2;

        var pair, lpBalanceStr, userLiquidity, totalSupply, liquidityValueA, liquidityValueB, percentToRemove, parsedAmounts;
        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.next = 2;
                return this.getDerivedPairInfo(tokenAType, tokenBType);

              case 2:
                pair = _context31.sent;

                if (to) {
                  _context31.next = 7;
                  break;
                }

                _context31.next = 6;
                return this.getCurrentAccount();

              case 6:
                to = _context31.sent;

              case 7:
                _context31.next = 9;
                return this.getTokenBalance(to, pair.liquidityToken.address);

              case 9:
                lpBalanceStr = _context31.sent;
                userLiquidity = new _sdk.TokenAmount(pair.liquidityToken, _sdk.JSBI.BigInt(lpBalanceStr));
                _context31.t0 = _sdk.TokenAmount;
                _context31.t1 = pair.liquidityToken;
                _context31.next = 15;
                return this.getTokenTotalSupply(pair.liquidityToken.address);

              case 15:
                _context31.t2 = _context31.sent;
                totalSupply = new _context31.t0(_context31.t1, _context31.t2);
                liquidityValueA = pair && totalSupply && userLiquidity && pair.token0 && new _sdk.TokenAmount(pair.token0, pair.getLiquidityValue(pair.token0, totalSupply, userLiquidity, false).raw);
                liquidityValueB = pair && totalSupply && userLiquidity && pair.token1 && new _sdk.TokenAmount(pair.token1, pair.getLiquidityValue(pair.token1, totalSupply, userLiquidity, false).raw);
                percentToRemove = new _sdk.Percent(_sdk.JSBI.BigInt(liquidityValue), userLiquidity.raw);
                parsedAmounts = (_parsedAmounts2 = {
                  LIQUIDITY_PERCENT: percentToRemove
                }, _defineProperty(_parsedAmounts2, pair.liquidityToken.address, new _sdk.TokenAmount(userLiquidity.token, percentToRemove.multiply(userLiquidity.raw).quotient)), _defineProperty(_parsedAmounts2, pair.token0.address, new _sdk.TokenAmount(pair.token0, percentToRemove.multiply(liquidityValueA.raw).quotient)), _defineProperty(_parsedAmounts2, pair.token1.address, new _sdk.TokenAmount(pair.token1, percentToRemove.multiply(liquidityValueB.raw).quotient)), _parsedAmounts2);
                return _context31.abrupt("return", {
                  pair: pair,
                  parsedAmounts: parsedAmounts
                });

              case 22:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      function getDerivedBurnInfo(_x58, _x59, _x60, _x61) {
        return _getDerivedBurnInfo.apply(this, arguments);
      }

      return getDerivedBurnInfo;
    }()
    /**
     * Adds liquidity to an ERC-20⇄ERC-20 pool
     * 
     * msg.sender should have already given the router an allowance of at least amount on tokenA/tokenB.
     * 
     * Always adds assets at the ideal ratio, according to the price when the transaction is executed.
     * 
     * @param {*} param0 {token: tokenAType, amount: amountA}
     * @param {*} param1 {token: tokenBType, amount: amountB}
     * @param {*} to Recipient of the liquidity tokens.
     * @param {*} slippage The amount the price moves in a trading pair between when a transaction is submitted and when it is executed.
     * @param {*} callback 
     */

  }, {
    key: "addUniswapLiquidity",
    value: function () {
      var _addUniswapLiquidity = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(_ref10, _ref11, to) {
        var _amountsMin;

        var tokenAType,
            amountA,
            tokenBType,
            amountB,
            slippage,
            callback,
            _yield$this$getDerive,
            pair,
            parsedAmounts,
            amountsMin,
            deadline,
            _args32 = arguments;

        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                tokenAType = _ref10.token, amountA = _ref10.amount;
                tokenBType = _ref11.token, amountB = _ref11.amount;
                slippage = _args32.length > 3 && _args32[3] !== undefined ? _args32[3] : 100;
                callback = _args32.length > 4 && _args32[4] !== undefined ? _args32[4] : {};
                _context32.next = 6;
                return this.getDerivedMintInfo({
                  token: tokenAType,
                  amount: amountA
                }, {
                  token: tokenBType,
                  amount: amountB
                });

              case 6:
                _yield$this$getDerive = _context32.sent;
                pair = _yield$this$getDerive.pair;
                parsedAmounts = _yield$this$getDerive.parsedAmounts;

                if (!(!pair || !pair.token0.address || !pair.token1.address)) {
                  _context32.next = 11;
                  break;
                }

                return _context32.abrupt("return");

              case 11:
                if (to) {
                  _context32.next = 15;
                  break;
                }

                _context32.next = 14;
                return this.getCurrentAccount();

              case 14:
                to = _context32.sent;

              case 15:
                amountsMin = (_amountsMin = {}, _defineProperty(_amountsMin, pair.token0.address, _uniswap["default"].calculateSlippageAmount(parsedAmounts[pair.token0.address].raw, slippage)[0]), _defineProperty(_amountsMin, pair.token1.address, _uniswap["default"].calculateSlippageAmount(parsedAmounts[pair.token1.address].raw, slippage)[0]), _amountsMin);
                deadline = Math.floor(Date.now() / 1000) + 60 * 120; // 120 minutes from the current Unix time
                //  https://uniswap.org/docs/v2/smart-contracts/router02/#addliquidity

                return _context32.abrupt("return", this.triggerContract({
                  methodName: 'addLiquidity',
                  abiKey: 'uniswapExchange',
                  abiString: this.ABIs['uniswapExchange'].abi,
                  contractParams: [pair.token0.address, pair.token1.address, parsedAmounts[pair.token0.address].raw.toString(), parsedAmounts[pair.token1.address].raw.toString(), amountsMin[pair.token0.address].toString(), amountsMin[pair.token1.address].toString(), to, deadline],
                  sendParams: {
                    value: 0
                  }
                }, callback));

              case 18:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));

      function addUniswapLiquidity(_x62, _x63, _x64) {
        return _addUniswapLiquidity.apply(this, arguments);
      }

      return addUniswapLiquidity;
    }()
    /**
     * Removes liquidity from an ERC-20⇄ERC-20 pool.
     * 
     * msg.sender should have already given the router an allowance of at least liquidity on the pool.
     * 
     * @param {*} tokenAType A pool token.
     * @param {*} tokenBType A pool token.
     * @param {*} liquidityValue The value of liquidity tokens to remove.
     * @param {*} to Recipient of the underlying assets.
     * @param {*} slippage The amount the price moves in a trading pair between when a transaction is submitted and when it is executed.
     * @param {*} callback 
     */

  }, {
    key: "removeUniswapLiquidity",
    value: function () {
      var _removeUniswapLiquidity = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(tokenAType, tokenBType, liquidityValue, to) {
        var _amountsMin2;

        var slippage,
            callback,
            _yield$this$getDerive2,
            pair,
            parsedAmounts,
            amountsMin,
            deadline,
            _args33 = arguments;

        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                slippage = _args33.length > 4 && _args33[4] !== undefined ? _args33[4] : 100;
                callback = _args33.length > 5 && _args33[5] !== undefined ? _args33[5] : {};

                if (to) {
                  _context33.next = 6;
                  break;
                }

                _context33.next = 5;
                return this.getCurrentAccount();

              case 5:
                to = _context33.sent;

              case 6:
                _context33.next = 8;
                return this.getDerivedBurnInfo(tokenAType, tokenBType, liquidityValue, to);

              case 8:
                _yield$this$getDerive2 = _context33.sent;
                pair = _yield$this$getDerive2.pair;
                parsedAmounts = _yield$this$getDerive2.parsedAmounts;

                if (!(!pair || !pair.token0.address || !pair.token1.address)) {
                  _context33.next = 13;
                  break;
                }

                return _context33.abrupt("return");

              case 13:
                amountsMin = (_amountsMin2 = {}, _defineProperty(_amountsMin2, pair.token0.address, _uniswap["default"].calculateSlippageAmount(parsedAmounts[pair.token0.address].raw, slippage)[0]), _defineProperty(_amountsMin2, pair.token1.address, _uniswap["default"].calculateSlippageAmount(parsedAmounts[pair.token1.address].raw, slippage)[0]), _amountsMin2);
                deadline = Math.floor(Date.now() / 1000) + 60 * 120; // 20 minutes from the current Unix time
                // https://uniswap.org/docs/v2/smart-contracts/router02/#removeliquidity

                return _context33.abrupt("return", this.triggerContract({
                  methodName: 'removeLiquidity',
                  abiKey: 'uniswapExchange',
                  abiString: this.ABIs['uniswapExchange'].abi,
                  contractParams: [pair.token0.address, pair.token1.address, parsedAmounts[pair.liquidityToken.address].raw.toString(), amountsMin[pair.token0.address].toString(), amountsMin[pair.token1.address].toString(), to, deadline],
                  sendParams: {
                    value: 0
                  }
                }, callback));

              case 16:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function removeUniswapLiquidity(_x65, _x66, _x67, _x68) {
        return _removeUniswapLiquidity.apply(this, arguments);
      }

      return removeUniswapLiquidity;
    }()
    /**
     * Use nft and elements or LP tokens in the furnace formula to the props.
     * @param {*} formulaIndex Formula for props - https://github.com/evolutionlandorg/furnace/blob/dev/src/Formula.sol
     * @param {*} majorTokenId ERC721 token Id
     * @param {*} minorTokenAddress Elements or LP tokens contract address
     * @param {*} callback callback
     */

  }, {
    key: "enchantFurnanceProps",
    value: function enchantFurnanceProps(formulaIndex, majorTokenId, minorTokenAddress) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.triggerContract({
        methodName: 'enchant',
        abiKey: 'furnaceItemBase',
        abiString: this.ABIs['furnaceItemBase'].abi,
        contractParams: [formulaIndex, majorTokenId, minorTokenAddress],
        sendParams: {
          value: 0
        }
      }, callback);
    }
    /**
     * Disenchant furnace props, and will get elements or LP and nft
     * @param {*} propsTokenId Token Id of the Props
     * @param {*} depth Supports one-time decomposition of high-level props. If a prop is in the second level, it needs to be restored to its original state, and the depth needs to be passed in 2
     * @param {*} callback 
     */

  }, {
    key: "disenchantFurnanceProps",
    value: function disenchantFurnanceProps(propsTokenId, depth) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.triggerContract({
        methodName: 'disenchant',
        abiKey: 'furnaceItemBase',
        abiString: this.ABIs['furnaceItemBase'].abi,
        contractParams: [propsTokenId, depth],
        sendParams: {
          value: 0
        }
      }, callback);
    }
    /**
     * Transfers the ownership of an NFT from one address to another address
     * @param {*} from The current owner of the NFT
     * @param {*} to The new owner
     * @param {*} tokenId The NFT to transfer
     * @param {*} callback 
     */

  }, {
    key: "safeTransferFromEvoErc721",
    value: function safeTransferFromEvoErc721(from, to, tokenId) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.triggerContract({
        methodName: 'safeTransferFrom',
        abiKey: 'objectOwnership',
        abiString: this.ABIs['erc721'].abi,
        contractParams: [from, to, tokenId]
      }, callback);
    }
    /**
     * Equip function, A NFT can equip to EVO Bar (LandBar or ApostleBar).
     * @param {*} tokenId Land token Id which to be quiped.
     * @param {*} resource Which resouce appply to.
     * @param {*} index Index of the Bar.
     * @param {*} token Props token address which to quip.
     * @param {*} id Props token Id which to quip.
     * @param {*} callabck 
     */

  }, {
    key: "equipLandResource",
    value: function equipLandResource(tokenId, resource, index, token, id) {
      var callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
      var resourceAddress = this.getContractAddress(resource);
      return this.triggerContract({
        methodName: 'equip',
        abiKey: 'apostleLandResource',
        abiString: this.ABIs['apostleLandResource'].abi,
        contractParams: [tokenId, resourceAddress, index, token, id]
      }, callback);
    }
    /**
     * Divest the props on the index slot on the tokenid land
     * @param {*} tokenId The tokenId of land
     * @param {*} index The index slot
     * @param {*} callback 
     */

  }, {
    key: "divestLandProps",
    value: function divestLandProps(tokenId, index) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.triggerContract({
        methodName: 'divest',
        abiKey: 'apostleLandResource',
        abiString: this.ABIs['apostleLandResource'].abi,
        contractParams: [tokenId, index]
      }, callback);
    }
    /**
     *  claim resource on the Land
     * @param tokenAddress The nft of props contract address
     * @param tokenId Land token Id
     * @returns {Promise<PromiEvent<any>>}
     */

  }, {
    key: "claimFurnaceItemResource",
    value: function claimFurnaceItemResource(tokenAddress, tokenId) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.triggerContract({
        methodName: 'claimItemResource',
        abiKey: 'apostleLandResource',
        abiString: this.ABIs['apostleLandResource'].abi,
        contractParams: [tokenAddress, _index["default"].pad0x(tokenId)]
      }, callback);
    }
    /**
     * Get the amount of resources available.
     * @param {*} ContractTokenAddress  The contract address of props.
     * @param {*} tokenId The token id of props.
     * @param {*} resources The contract address of resources.
     * @param {*} callback 
     */

  }, {
    key: "getAvailableFurnaceItemResources",
    value: function getAvailableFurnaceItemResources(ContractTokenAddress, tokenId, resources) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.callContract({
        methodName: 'availableItemResources',
        abiKey: 'apostleLandResource',
        abiString: this.ABIs['apostleLandResource'].abi,
        contractParams: [ContractTokenAddress, _index["default"].pad0x(tokenId), resources]
      }, callback);
    }
    /**
     * Get the Land Id where the item is located
     * @param {*} ContractTokenAddress The nft token contract address
     * @param {*} tokenId The token Id of nft
     * @param {*} callback 
     */

  }, {
    key: "getLandIdByFurnaceItem",
    value: function getLandIdByFurnaceItem(ContractTokenAddress, tokenId) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.callContract({
        methodName: 'getLandIdByItem',
        abiKey: 'apostleLandResource',
        abiString: this.ABIs['apostleLandResource'].abi,
        contractParams: [ContractTokenAddress, _index["default"].pad0x(tokenId)]
      }, callback);
    }
    /**
     * Get the amount of resources that the props can be mined daily.
     * @param {*} landTokenId The token Id of land.
     * @param {*} resourceAddress Resource contract address.
     * @param {*} slotIndex The index of land slot.
     * @param {*} callback 
     */

  }, {
    key: "getLandBarMiningStrength",
    value: function getLandBarMiningStrength(landTokenId, resourceAddress, slotIndex) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.callContract({
        methodName: 'getBarMiningStrength',
        abiKey: 'apostleLandResource',
        abiString: this.ABIs['apostleLandResource'].abi,
        contractParams: [_index["default"].pad0x(landTokenId), resourceAddress, slotIndex]
      }, callback);
    }
  }, {
    key: "estimateGas",
    value: function estimateGas(method, address) {
      var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      if (!this._web3js) return;
      return (method || this._web3js.eth).estimateGas({
        from: address,
        value: value
      });
    }
  }, {
    key: "getNetworkId",
    value: function getNetworkId() {
      return this._web3js.eth.net.getId();
    }
    /**
     * check address info
     * @param address - Ethereum address
     */

  }, {
    key: "checkAddress",
    value: function checkAddress(address) {
      return this.ClientFetch.$get('/api/verified_wallet', {
        wallet: address
      });
    }
  }, {
    key: "challengeAddress",
    value: function challengeAddress(address) {
      return this.ClientFetch.$get('/api/challenge', {
        wallet: address
      });
    }
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
        abiString: this.ABIs['goldRushRaffle'].abi,
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
    value: function goldRushRaffleDraw(eventId, landTokenId, isWon, _ref12) {
      var hashmessage = _ref12.hashmessage,
          v = _ref12.v,
          r = _ref12.r,
          s = _ref12.s;
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
        abiString: this.ABIs['goldRushRaffle'].abi,
        contractParams: [eventId, landTokenId]
      }, callback);
    }
  }, {
    key: "_sign",
    value: function () {
      var _sign2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34(_ref13, from) {
        var data, name, signature;
        return regeneratorRuntime.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                data = _ref13.data, name = _ref13.name;
                _context34.prev = 1;
                _context34.next = 4;
                return this._web3js.eth.personal.sign(name + " " + data, from);

              case 4:
                signature = _context34.sent;
                _context34.next = 9;
                break;

              case 7:
                _context34.prev = 7;
                _context34.t0 = _context34["catch"](1);

              case 9:
                return _context34.abrupt("return", {
                  address: from,
                  signature: signature
                });

              case 10:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this, [[1, 7]]);
      }));

      function _sign(_x69, _x70) {
        return _sign2.apply(this, arguments);
      }

      return _sign;
    }()
    /**
     * Login Evolution Land
     * @param address - Ethereum address
     * @returns {Promise<*>}
     */

  }, {
    key: "login",
    value: function () {
      var _login = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(address) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                return _context35.abrupt("return", new Promise(function (resolve, reject) {
                  _this2.challengeAddress(address).then(function (res) {
                    var code = res.code,
                        data = res.data,
                        name = res.name;

                    if (code === 0) {
                      _this2._sign({
                        data: data,
                        name: name
                      }, address).then(function (info) {
                        if (info.signature) {
                          _this2.ClientFetch.$post('/api/login', {
                            wallet: address,
                            sign: info.signature
                          }).then(function (res) {
                            resolve(res);
                          });
                        } else {
                          reject({
                            code: code,
                            data: data
                          });
                        }
                      })["catch"](function (err) {
                        return reject(err);
                      });
                    }
                  });
                }));

              case 1:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35);
      }));

      function login(_x71) {
        return _login.apply(this, arguments);
      }

      return login;
    }()
  }]);

  return EthereumEvolutionLand;
}();

Object.assign(EthereumEvolutionLand.prototype, _liquidityStaker["default"]);
Object.assign(EthereumEvolutionLand.prototype, _erc["default"]);
Object.assign(EthereumEvolutionLand.prototype, _erc2["default"]);
Object.assign(EthereumEvolutionLand.prototype, _pets["default"]);
var _default = EthereumEvolutionLand;
exports["default"] = _default;