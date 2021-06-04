"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pair = void 0;

var _sdk = require("@uniswap/sdk");

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _jsbi = _interopRequireDefault(require("jsbi"));

var _solidity = require("@ethersproject/solidity");

var _address = require("@ethersproject/address");

var _uniswapUtils = require("./uniswapUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ZERO = /*#__PURE__*/_jsbi["default"].BigInt(0);

var ONE = /*#__PURE__*/_jsbi["default"].BigInt(1);

var FIVE = /*#__PURE__*/_jsbi["default"].BigInt(5);

var _997 = /*#__PURE__*/_jsbi["default"].BigInt(997);

var _1000 = /*#__PURE__*/_jsbi["default"].BigInt(1000);

var PAIR_ADDRESS_CACHE = {// '0x2f6aE7fDbB7c0c613F7923Ddce3E5b71aFE71f78': {
  //   '0xD4C2F962B8b94cdD2e0B2e8E765d39f32980a1c1': '0x5a5B56EE7F615Ca4f9676703f9aB8AD4C4954092'
  // }
};
var FACTORY_ADDRESS = {
  '1': '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  '3': '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  '56': '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  '97': '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
  '128': '0xb0b670fc1F7724119963018DB0BfA86aDb22d941',
  '256': '0xA19a691EB6dE729758BFCef165e117C830483eF0'
}; // https://github.com/Uniswap/uniswap-v2-core/issues/102
// We can use create LP to calculate the hash using the generated lp contract bytescode.

var INIT_CODE_HASH = {
  '1': '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
  '3': '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
  '56': '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  '97': '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66',
  '128': '0x2ad889f82040abccb2649ea6a874796c1601fb67f91a747a80e08860c73ddf24',
  '256': '0x6fcc083b512761e9f65d41be84dbc66f5afb698ad320a8b0e1e6d2d0e4d10930'
};

var Pair = /*#__PURE__*/function () {
  _createClass(Pair, null, [{
    key: "getAddress",
    value: function getAddress(tokenA, tokenB) {
      var _PAIR_ADDRESS_CACHE, _PAIR_ADDRESS_CACHE$t;

      var tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]; // does safety checks

      if (((_PAIR_ADDRESS_CACHE = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE$t = _PAIR_ADDRESS_CACHE[tokens[0].address]) === null || _PAIR_ADDRESS_CACHE$t === void 0 ? void 0 : _PAIR_ADDRESS_CACHE$t[tokens[1].address]) === undefined) {
        var _PAIR_ADDRESS_CACHE2;

        PAIR_ADDRESS_CACHE = _objectSpread(_objectSpread({}, PAIR_ADDRESS_CACHE), {}, _defineProperty({}, tokens[0].address, _objectSpread(_objectSpread({}, (_PAIR_ADDRESS_CACHE2 = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE2 === void 0 ? void 0 : _PAIR_ADDRESS_CACHE2[tokens[0].address]), {}, _defineProperty({}, tokens[1].address, (0, _address.getCreate2Address)(FACTORY_ADDRESS[tokens[0].chainId], (0, _solidity.keccak256)(['bytes'], [(0, _solidity.pack)(['address', 'address'], [tokens[0].address, tokens[1].address])]), INIT_CODE_HASH[tokens[0].chainId])))));
      }

      return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address];
    }
  }]);

  function Pair(tokenAmountA, tokenAmountB) {
    _classCallCheck(this, Pair);

    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    this.liquidityToken = new _sdk.Token(tokenAmounts[0].token.chainId, Pair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token), 18, 'UNI-V2', 'Uniswap V2');
    this.tokenAmounts = tokenAmounts;
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */


  _createClass(Pair, [{
    key: "involvesToken",
    value: function involvesToken(token) {
      return token.equals(this.token0) || token.equals(this.token1);
    }
    /**
     * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
     */

  }, {
    key: "priceOf",

    /**
     * Return the price of the given token in terms of the other token in the pair.
     * @param token token to return price of
     */
    value: function priceOf(token) {
      (0, _tinyInvariant["default"])(this.involvesToken(token), 'TOKEN');
      return token.equals(this.token0) ? this.token0Price : this.token1Price;
    }
    /**
     * Returns the chain ID of the tokens in the pair.
     */

  }, {
    key: "reserveOf",
    value: function reserveOf(token) {
      (0, _tinyInvariant["default"])(this.involvesToken(token), 'TOKEN');
      return token.equals(this.token0) ? this.reserve0 : this.reserve1;
    }
  }, {
    key: "getOutputAmount",
    value: function getOutputAmount(inputAmount) {
      (0, _tinyInvariant["default"])(this.involvesToken(inputAmount.token), 'TOKEN');

      if (_jsbi["default"].equal(this.reserve0.raw, ZERO) || _jsbi["default"].equal(this.reserve1.raw, ZERO)) {
        throw new _sdk.InsufficientReservesError();
      }

      var inputReserve = this.reserveOf(inputAmount.token);
      var outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);

      var inputAmountWithFee = _jsbi["default"].multiply(inputAmount.raw, _997);

      var numerator = _jsbi["default"].multiply(inputAmountWithFee, outputReserve.raw);

      var denominator = _jsbi["default"].add(_jsbi["default"].multiply(inputReserve.raw, _1000), inputAmountWithFee);

      var outputAmount = new _sdk.TokenAmount(inputAmount.token.equals(this.token0) ? this.token1 : this.token0, _jsbi["default"].divide(numerator, denominator));

      if (_jsbi["default"].equal(outputAmount.raw, ZERO)) {
        throw new _sdk.InsufficientInputAmountError();
      }

      return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
    }
  }, {
    key: "getInputAmount",
    value: function getInputAmount(outputAmount) {
      (0, _tinyInvariant["default"])(this.involvesToken(outputAmount.token), 'TOKEN');

      if (_jsbi["default"].equal(this.reserve0.raw, ZERO) || _jsbi["default"].equal(this.reserve1.raw, ZERO) || _jsbi["default"].greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)) {
        throw new _sdk.InsufficientReservesError();
      }

      var outputReserve = this.reserveOf(outputAmount.token);
      var inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);

      var numerator = _jsbi["default"].multiply(_jsbi["default"].multiply(inputReserve.raw, outputAmount.raw), _1000);

      var denominator = _jsbi["default"].multiply(_jsbi["default"].subtract(outputReserve.raw, outputAmount.raw), _997);

      var inputAmount = new _sdk.TokenAmount(outputAmount.token.equals(this.token0) ? this.token1 : this.token0, _jsbi["default"].add(_jsbi["default"].divide(numerator, denominator), ONE));
      return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
    }
  }, {
    key: "getLiquidityMinted",
    value: function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
      (0, _tinyInvariant["default"])(totalSupply.token.equals(this.liquidityToken), 'LIQUIDITY');
      var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
      (0, _tinyInvariant["default"])(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1), 'TOKEN');
      var liquidity;

      if (_jsbi["default"].equal(totalSupply.raw, ZERO)) {
        liquidity = _jsbi["default"].subtract((0, _uniswapUtils.sqrt)(_jsbi["default"].multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), _sdk.MINIMUM_LIQUIDITY);
      } else {
        var amount0 = _jsbi["default"].divide(_jsbi["default"].multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw);

        var amount1 = _jsbi["default"].divide(_jsbi["default"].multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw);

        liquidity = _jsbi["default"].lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
      }

      if (!_jsbi["default"].greaterThan(liquidity, ZERO)) {
        throw new _sdk.InsufficientInputAmountError();
      }

      return new _sdk.TokenAmount(this.liquidityToken, liquidity);
    }
  }, {
    key: "getLiquidityValue",
    value: function getLiquidityValue(token, totalSupply, liquidity) {
      var feeOn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var kLast = arguments.length > 4 ? arguments[4] : undefined;
      (0, _tinyInvariant["default"])(this.involvesToken(token), 'TOKEN');
      (0, _tinyInvariant["default"])(totalSupply.token.equals(this.liquidityToken), 'TOTAL_SUPPLY');
      (0, _tinyInvariant["default"])(liquidity.token.equals(this.liquidityToken), 'LIQUIDITY');
      (0, _tinyInvariant["default"])(_jsbi["default"].lessThanOrEqual(liquidity.raw, totalSupply.raw), 'LIQUIDITY');
      var totalSupplyAdjusted;

      if (!feeOn) {
        totalSupplyAdjusted = totalSupply;
      } else {
        (0, _tinyInvariant["default"])(!!kLast, 'K_LAST');
        var kLastParsed = (0, _uniswapUtils.parseBigintIsh)(kLast);

        if (!_jsbi["default"].equal(kLastParsed, ZERO)) {
          var rootK = (0, _uniswapUtils.sqrt)(_jsbi["default"].multiply(this.reserve0.raw, this.reserve1.raw));
          var rootKLast = (0, _uniswapUtils.sqrt)(kLastParsed);

          if (_jsbi["default"].greaterThan(rootK, rootKLast)) {
            var numerator = _jsbi["default"].multiply(totalSupply.raw, _jsbi["default"].subtract(rootK, rootKLast));

            var denominator = _jsbi["default"].add(_jsbi["default"].multiply(rootK, FIVE), rootKLast);

            var feeLiquidity = _jsbi["default"].divide(numerator, denominator);

            totalSupplyAdjusted = totalSupply.add(new _sdk.TokenAmount(this.liquidityToken, feeLiquidity));
          } else {
            totalSupplyAdjusted = totalSupply;
          }
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      }

      return new _sdk.TokenAmount(token, _jsbi["default"].divide(_jsbi["default"].multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw));
    }
  }, {
    key: "token0Price",
    get: function get() {
      return new _sdk.Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw);
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */

  }, {
    key: "token1Price",
    get: function get() {
      return new _sdk.Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "token0",
    get: function get() {
      return this.tokenAmounts[0].token;
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokenAmounts[1].token;
    }
  }, {
    key: "reserve0",
    get: function get() {
      return this.tokenAmounts[0];
    }
  }, {
    key: "reserve1",
    get: function get() {
      return this.tokenAmounts[1];
    }
  }]);

  return Pair;
}();

exports.Pair = Pair;