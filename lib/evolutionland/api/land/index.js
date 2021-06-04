"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("../../utils/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var LandApi = {
  landRingApproveToClockAuction: function landRingApproveToClockAuction() {
    var tokenAddressOrType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ring";
    var value = arguments.length > 1 ? arguments[1] : undefined;
    return this.erc20Approve(tokenAddressOrType, this.ABIs["landClockAuction"].address, value);
  },
  landAllowanceToClockAuction: function landAllowanceToClockAuction() {
    var tokenAddressOrType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ring";
    var from = arguments.length > 1 ? arguments[1] : undefined;
    // tokenAddressOrType, spender, from
    return this.erc20Allowance(tokenAddressOrType, this.ABIs["landClockAuction"].address, from);
  },

  /**
   * Bid Land Assets with Ring token.
   * @param amount - bid price with ring token
   * @param tokenId - tokenid of land
   * @param referrer - Referrer address
   * @returns {Promise<PromiEvent<any>>}
   */
  landBidWithToken: function landBidWithToken(tokenId, referrer, amountMax) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var finalReferrer = "0x0000000000000000000000000000000000000000";

    if (referrer && _index["default"].isAddress(referrer)) {
      finalReferrer = referrer;
    }

    return this.triggerContract({
      methodName: "bidWithToken",
      abiKey: "landClockAuction",
      abiString: this.ABIs["landClockAuctionV3"].abi,
      contractParams: [_index["default"].pad0x(tokenId), finalReferrer, amountMax]
    }, callback);
  }
};
var _default = LandApi;
exports["default"] = _default;