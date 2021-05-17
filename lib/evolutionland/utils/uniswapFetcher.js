"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fetcher = void 0;

require("regenerator-runtime/runtime.js");

var _contracts = require("@ethersproject/contracts");

var _networks = require("@ethersproject/networks");

var _providers = require("@ethersproject/providers");

var _sdk = require("@uniswap/sdk");

var _IUniswapV2Pair = _interopRequireDefault(require("@uniswap/v2-core/build/IUniswapV2Pair.json"));

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _uniswapPair = require("./uniswapPair");

var _uniswapErc = _interopRequireDefault(require("./uniswapErc20.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TOKEN_DECIMALS_CACHE = _defineProperty({}, _sdk.ChainId.MAINNET, {});
/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */


var Fetcher = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Fetcher() {
    _classCallCheck(this, Fetcher);
  }
  /**
   * Fetch information for a given token on the given chain, using the given ethers provider.
   * @param chainId chain of the token
   * @param address address of the token on the chain
   * @param provider provider used to fetch the token
   * @param symbol optional symbol of the token
   * @param name optional name of the token
   */


  _createClass(Fetcher, null, [{
    key: "fetchTokenData",
    value: function () {
      var _fetchTokenData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(chainId, address) {
        var _TOKEN_DECIMALS_CACHE2, _TOKEN_DECIMALS_CACHE3;

        var provider,
            symbol,
            name,
            parsedDecimals,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                provider = _args.length > 2 && _args[2] !== undefined ? _args[2] : (0, _providers.getDefaultProvider)((0, _networks.getNetwork)(chainId));
                symbol = _args.length > 3 ? _args[3] : undefined;
                name = _args.length > 4 ? _args[4] : undefined;

                if (!(typeof ((_TOKEN_DECIMALS_CACHE2 = TOKEN_DECIMALS_CACHE) === null || _TOKEN_DECIMALS_CACHE2 === void 0 ? void 0 : (_TOKEN_DECIMALS_CACHE3 = _TOKEN_DECIMALS_CACHE2[chainId]) === null || _TOKEN_DECIMALS_CACHE3 === void 0 ? void 0 : _TOKEN_DECIMALS_CACHE3[address]) === 'number')) {
                  _context.next = 7;
                  break;
                }

                _context.t0 = TOKEN_DECIMALS_CACHE[chainId][address];
                _context.next = 10;
                break;

              case 7:
                _context.next = 9;
                return new _contracts.Contract(address, _uniswapErc["default"], provider).decimals().then(function (decimals) {
                  var _TOKEN_DECIMALS_CACHE4;

                  TOKEN_DECIMALS_CACHE = _objectSpread(_objectSpread({}, TOKEN_DECIMALS_CACHE), {}, _defineProperty({}, chainId, _objectSpread(_objectSpread({}, (_TOKEN_DECIMALS_CACHE4 = TOKEN_DECIMALS_CACHE) === null || _TOKEN_DECIMALS_CACHE4 === void 0 ? void 0 : _TOKEN_DECIMALS_CACHE4[chainId]), {}, _defineProperty({}, address, decimals))));
                  return decimals;
                });

              case 9:
                _context.t0 = _context.sent;

              case 10:
                parsedDecimals = _context.t0;
                return _context.abrupt("return", new _sdk.Token(chainId, address, parsedDecimals, symbol, name));

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function fetchTokenData(_x, _x2) {
        return _fetchTokenData.apply(this, arguments);
      }

      return fetchTokenData;
    }()
    /**
     * Fetches information about a pair and constructs a pair from the given two tokens.
     * @param tokenA first token
     * @param tokenB second token
     * @param provider the provider to use to fetch the data
     */

  }, {
    key: "fetchPairData",
    value: function () {
      var _fetchPairData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(tokenA, tokenB) {
        var provider,
            address,
            _yield$Contract$getRe,
            _yield$Contract$getRe2,
            reserves0,
            reserves1,
            balances,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                provider = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : (0, _providers.getDefaultProvider)((0, _networks.getNetwork)(tokenA.chainId));
                (0, _tinyInvariant["default"])(tokenA.chainId === tokenB.chainId, 'CHAIN_ID');
                address = _uniswapPair.Pair.getAddress(tokenA, tokenB);
                _context2.next = 5;
                return new _contracts.Contract(address, _IUniswapV2Pair["default"].abi, provider).getReserves();

              case 5:
                _yield$Contract$getRe = _context2.sent;
                _yield$Contract$getRe2 = _slicedToArray(_yield$Contract$getRe, 2);
                reserves0 = _yield$Contract$getRe2[0];
                reserves1 = _yield$Contract$getRe2[1];
                balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0];
                return _context2.abrupt("return", new _uniswapPair.Pair(new _sdk.TokenAmount(tokenA, balances[0]), new _sdk.TokenAmount(tokenB, balances[1])));

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function fetchPairData(_x3, _x4) {
        return _fetchPairData.apply(this, arguments);
      }

      return fetchPairData;
    }()
  }]);

  return Fetcher;
}();

exports.Fetcher = Fetcher;