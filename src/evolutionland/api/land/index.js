import Utils from "../../utils/index";

let LandApi = {
  landRingApproveToClockAuction(tokenAddressOrType = "ring", value) {
    return this.erc20Approve(
      tokenAddressOrType,
      this.ABIs["landClockAuction"].address,
      value
    );
  },

  landAllowanceToClockAuction(tokenAddressOrType = "ring", from) {
    // tokenAddressOrType, spender, from
    return this.erc20Allowance(
      tokenAddressOrType,
      this.ABIs["landClockAuction"].address,
      from
    );
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

  availableLandResources(tokenId, resources, callback = {}) {
    if (!resources) {
      resources = [
        this.env.CONTRACT.TOKEN_ELEMENT_GOLD,
        this.env.CONTRACT.TOKEN_ELEMENT_WOOD,
        this.env.CONTRACT.TOKEN_ELEMENT_WATER,
        this.env.CONTRACT.TOKEN_ELEMENT_FIRE,
        this.env.CONTRACT.TOKEN_ELEMENT_SOIL,
      ];
    }

    return this.callContract(
      {
        methodName: "availableLandResources",
        abiKey: this.ABIs["apostleLandResource"].address,
        abiString: this.ABIs["apostleLandResource"].abi,
        contractParams: [Utils.pad0x(tokenId), resources],
      },
      callback
    );
  },

  landBatchClaimLandResource(tokenIds, callback = {}) {
    return this.triggerContract(
      {
        methodName: "batchClaimLandResource",
        abiKey: "apostleLandResource",
        abiString: this.ABIs["apostleLandResource"].abi,
        contractParams: [tokenIds.map((tokenId) => Utils.pad0x(tokenId))],
      },
      callback
    );
  },
};

export default LandApi;
