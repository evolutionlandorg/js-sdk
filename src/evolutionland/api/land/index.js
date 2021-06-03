import Utils from '../../utils/index'

let LandApi = {
  landRingApproveToClockAuction(tokenAddressOrType = "ring", value) {
    return this.erc20Approve(tokenAddressOrType, this.ABIs["landClockAuction"].address, value);
  },

  landAllowanceToClockAuction(tokenAddressOrType = "ring", from) {
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
  landBidWithToken(tokenId, referrer, amountMax, callback = {}) {
    let finalReferrer = "0x0000000000000000000000000000000000000000";

    if (referrer && Utils.isAddress(referrer)) {
      finalReferrer = referrer;
    }

    return this.triggerContract(
      {
        methodName: "bidWithToken",
        abiKey: "landClockAuction",
        abiString: this.ABIs["landClockAuctionV3"].abi,
        contractParams: [Utils.pad0x(tokenId), finalReferrer, amountMax],
      },
      callback
    );
  },
};

export default LandApi;
