"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.splice.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSolidityTypeInstance = validateSolidityTypeInstance;
exports.validateAndParseAddress = validateAndParseAddress;
exports.parseBigintIsh = parseBigintIsh;
exports.sqrt = sqrt;
exports.sortedInsert = sortedInsert;

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _tinyWarning = _interopRequireDefault(require("tiny-warning"));

var _jsbi = _interopRequireDefault(require("jsbi"));

var _address = require("@ethersproject/address");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ZERO = /*#__PURE__*/_jsbi["default"].BigInt(0);

var ONE = /*#__PURE__*/_jsbi["default"].BigInt(1);

var TWO = /*#__PURE__*/_jsbi["default"].BigInt(2);

var THREE = /*#__PURE__*/_jsbi["default"].BigInt(3);

var SolidityType;

var _SOLIDITY_TYPE_MAXIMA;

(function (SolidityType) {
  SolidityType["uint8"] = "uint8";
  SolidityType["uint256"] = "uint256";
})(SolidityType || (SolidityType = {}));

var SOLIDITY_TYPE_MAXIMA = (_SOLIDITY_TYPE_MAXIMA = {}, _SOLIDITY_TYPE_MAXIMA[SolidityType.uint8] = /*#__PURE__*/_jsbi["default"].BigInt('0xff'), _SOLIDITY_TYPE_MAXIMA[SolidityType.uint256] = /*#__PURE__*/_jsbi["default"].BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), _SOLIDITY_TYPE_MAXIMA);

function validateSolidityTypeInstance(value, solidityType) {
  (0, _tinyInvariant["default"])(_jsbi["default"].greaterThanOrEqual(value, ZERO), "".concat(value, " is not a ").concat(solidityType, "."));
  (0, _tinyInvariant["default"])(_jsbi["default"].lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]), "".concat(value, " is not a ").concat(solidityType, "."));
} // warns if addresses are not checksummed


function validateAndParseAddress(address) {
  try {
    var checksummedAddress = (0, _address.getAddress)(address);
    (0, _tinyWarning["default"])(address === checksummedAddress, "".concat(address, " is not checksummed."));
    return checksummedAddress;
  } catch (error) {
    (0, _tinyInvariant["default"])(false, "".concat(address, " is not a valid address."));
  }
}

function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof _jsbi["default"] ? bigintIsh : typeof bigintIsh === 'bigint' ? _jsbi["default"].BigInt(bigintIsh.toString()) : _jsbi["default"].BigInt(bigintIsh);
} // mock the on-chain sqrt function


function sqrt(y) {
  validateSolidityTypeInstance(y, SolidityType.uint256);
  var z = ZERO;
  var x;

  if (_jsbi["default"].greaterThan(y, THREE)) {
    z = y;
    x = _jsbi["default"].add(_jsbi["default"].divide(y, TWO), ONE);

    while (_jsbi["default"].lessThan(x, z)) {
      z = x;
      x = _jsbi["default"].divide(_jsbi["default"].add(_jsbi["default"].divide(y, x), x), TWO);
    }
  } else if (_jsbi["default"].notEqual(y, ZERO)) {
    z = ONE;
  }

  return z;
} // given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item


function sortedInsert(items, add, maxSize, comparator) {
  (0, _tinyInvariant["default"])(maxSize > 0, 'MAX_SIZE_ZERO'); // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize

  (0, _tinyInvariant["default"])(items.length <= maxSize, 'ITEMS_SIZE'); // short circuit first item add

  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    var isFull = items.length === maxSize; // short circuit if full and the additional item does not come before the last item

    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add;
    }

    var lo = 0,
        hi = items.length;

    while (lo < hi) {
      var mid = lo + hi >>> 1;

      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}