"use strict";

require("core-js/modules/es.number.to-fixed.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("../../utils/index"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ApostleApi = {
  apostleRingApproveToClockAuction: function apostleRingApproveToClockAuction() {
    var tokenAddressOrType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ring";
    var value = arguments.length > 1 ? arguments[1] : undefined;
    return this.erc20Approve(tokenAddressOrType, this.ABIs["apostleAuction"].address, value);
  },
  apostleAllowanceToClockAuction: function apostleAllowanceToClockAuction(from) {
    // tokenAddressOrType, spender, from
    return this.erc20Allowance("ring", this.ABIs["apostleAuction"].address, from);
  },
  apostleTokenApproveToApostleBase: function apostleTokenApproveToApostleBase() {
    var tokenAddressOrType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ring";
    var value = arguments.length > 1 ? arguments[1] : undefined;
    return this.erc20Approve(tokenAddressOrType, this.ABIs["apostleBase"].address, value);
  },
  apostleTokenAllowanceToApostleBase: function apostleTokenAllowanceToApostleBase(tokenAddressOrType) {
    return this.erc20Allowance(tokenAddressOrType, this.ABIs["apostleBase"].address, from);
  },
  apostleRingApproveToApostleSiringAuction: function apostleRingApproveToApostleSiringAuction() {
    var tokenAddressOrType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ring";
    var value = arguments.length > 1 ? arguments[1] : undefined;
    return this.erc20Approve(tokenAddressOrType, this.ABIs["apostleSiringAuction"].address, value);
  },
  apostleRingAllowanceToApostleSiringAuction: function apostleRingAllowanceToApostleSiringAuction(from) {
    // tokenAddressOrType, spender, from
    return this.erc20Allowance("ring", this.ABIs["apostleSiringAuction"].address, from);
  },
  apostleRingApproveToapostleTokenUse: function apostleRingApproveToapostleTokenUse() {
    var tokenAddressOrType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ring";
    var value = arguments.length > 1 ? arguments[1] : undefined;
    return this.erc20Approve(tokenAddressOrType, this.ABIs["apostleTokenUse"].address, value);
  },
  apostleRingAllowanceToapostleTokenUse: function apostleRingAllowanceToapostleTokenUse(from) {
    return this.erc20Approve("ring", this.ABIs["apostleTokenUse"].address, from);
  },

  /**
   * Bid apostle by RING token
   * @param tokenId - Apostle token ID
   * @param referrer - refer address
   * @param amountMax - RING amount
   * @returns {Promise<PromiEvent<any>>}
   */
  apostleBid: function apostleBid(tokenId, referrer, amountMax) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var finalReferrer = "0x0000000000000000000000000000000000000000";

    if (referrer && _index["default"].isAddress(referrer)) {
      finalReferrer = referrer;
    }

    return this.triggerContract({
      methodName: "bidWithToken",
      abiKey: this.ABIs["apostleAuction"].address,
      abiString: this.ABIs["apostleAuctionV3"].abi,
      contractParams: [_index["default"].pad0x(tokenId), finalReferrer, amountMax]
    }, callback);
  },

  /**
   * Apostle reproduction in own
   * @param tokenId
   * @param targetTokenId
   * @param amountMax
   * @returns {Promise<PromiEvent<any>>}
   */
  apostleBreed: function apostleBreed(tokenId, targetTokenId, amountMax) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return this.triggerContract({
      methodName: "breedWithAuto",
      abiKey: "apostleBase",
      abiString: this.ABIs["apostleBaseV3"].abi,
      contractParams: [_index["default"].pad0x(tokenId), _index["default"].pad0x(targetTokenId), amountMax]
    }, callback);
  },

  /**
   * Apostle reproduction
   * @param tokenId
   * @param targetTokenId
   * @param amountMax bidPrice + autoBirthFee
   */
  apostleBreedBid: function apostleBreedBid(tokenId, targetTokenId, amountMax) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return this.triggerContract({
      methodName: "bidWithToken",
      abiKey: "apostleSiringAuction",
      abiString: this.ABIs["apostleSiringAuctionV3"].abi,
      contractParams: [_index["default"].pad0x(tokenId), _index["default"].pad0x(targetTokenId), amountMax]
    }, callback);
  },

  /**
   * Bid apostle on Renting
   * @param tokenId - Apostle tokenId
   * @param price - bid price
   */
  apostleHireBid: function apostleHireBid(tokenId, amountMax) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.triggerContract({
      methodName: "takeTokenUseOffer",
      abiKey: "apostleTokenUse",
      abiString: this.ABIs["apostleTokenUseV2"].abi,
      contractParams: [_index["default"].pad0x(tokenId), amountMax]
    }, callback);
  },

  /**
   * Apostle Born without element
   * @param motherTokenId
   */
  apostleBorn: function apostleBorn(motherTokenId) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.triggerContract({
      methodName: "giveBirth",
      abiKey: "apostleBase",
      abiString: this.ABIs["apostleBaseV3"].abi,
      contractParams: [_index["default"].pad0x(motherTokenId), _index["default"].padLeft(0, 40, "0"), 0, 0]
    }, callback);
  },

  /**
   * Apostle Born with element
   * @param motherTokenId
   * @param element
   * @param level
   * @param levelUnitPrice
   */
  apostleBornAndEnhance: function apostleBornAndEnhance(motherTokenId, element, level, levelUnitPrice) {
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var elementAddress = this.ABIs[element.toLowerCase()].address;
    return this.triggerContract({
      methodName: "giveBirth",
      abiKey: "apostleBase",
      abiString: this.ABIs["apostleBaseV3"].abi,
      contractParams: [_index["default"].pad0x(motherTokenId), elementAddress, level, new _bignumber["default"](level).times(new _bignumber["default"](levelUnitPrice)).toFixed()]
    }, callback);
  }
};
var _default = ApostleApi;
exports["default"] = _default;