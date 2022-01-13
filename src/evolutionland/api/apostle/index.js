import Utils from '../../utils/index'
import BigNumber from 'bignumber.js'

let ApostleApi = {
  apostleRingApproveToClockAuction(tokenAddressOrType = "ring", value) {
    return this.erc20Approve(tokenAddressOrType, this.ABIs["apostleAuction"].address, value);
  },

  apostleAllowanceToClockAuction(from) {
    // tokenAddressOrType, spender, from
    return this.erc20Allowance("ring", this.ABIs["apostleAuction"].address, from);
  },

  apostleTokenApproveToApostleBase(tokenAddressOrType = "ring", value) {
    return this.erc20Approve(
      tokenAddressOrType,
      this.ABIs["apostleBase"].address,
      value
    );
  },

  apostleTokenAllowanceToApostleBase(tokenAddressOrType) {
    return this.erc20Allowance(tokenAddressOrType, this.ABIs["apostleBase"].address, from);
  },

  apostleRingApproveToApostleSiringAuction(tokenAddressOrType = "ring", value) {
    return this.erc20Approve(tokenAddressOrType, this.ABIs["apostleSiringAuction"].address, value);
  },

  apostleRingAllowanceToApostleSiringAuction(from) {
    // tokenAddressOrType, spender, from
    return this.erc20Allowance("ring", this.ABIs["apostleSiringAuction"].address, from);
  },

  apostleRingApproveToapostleTokenUse(tokenAddressOrType = "ring", value) {
    return this.erc20Approve(tokenAddressOrType, this.ABIs["apostleTokenUse"].address, value);
  },

  apostleRingAllowanceToapostleTokenUse(from) {
    return this.erc20Approve("ring", this.ABIs["apostleTokenUse"].address, from);
  },

  /**
   * Bid apostle by RING token
   * @param tokenId - Apostle token ID
   * @param referrer - refer address
   * @param amountMax - RING amount
   * @returns {Promise<PromiEvent<any>>}
   */
  apostleBid(tokenId, referrer, amountMax, callback = {}) {
    let finalReferrer = "0x0000000000000000000000000000000000000000";

    if (referrer && Utils.isAddress(referrer)) {
      finalReferrer = referrer;
    }

    return this.triggerContract(
      {
        methodName: "bidWithToken",
        abiKey: this.ABIs["apostleAuction"].address,
        abiString: this.ABIs["apostleAuctionV3"].abi,
        contractParams: [Utils.pad0x(tokenId), finalReferrer, amountMax],
      },
      callback
    );
  },

  /**
   * Apostle reproduction in own
   * @param tokenId
   * @param targetTokenId
   * @param amountMax
   * @returns {Promise<PromiEvent<any>>}
   */
  apostleBreed(tokenId, targetTokenId, amountMax, callback = {}) {
    return this.triggerContract(
      {
        methodName: "breedWithAuto",
        abiKey: "apostleBase",
        abiString: this.ABIs["apostleBaseV3"].abi,
        contractParams: [
          Utils.pad0x(tokenId),
          Utils.pad0x(targetTokenId),
          amountMax,
        ],
      },
      callback
    );
  },

  /**
   * Apostle reproduction
   * @param tokenId
   * @param targetTokenId
   * @param amountMax bidPrice + autoBirthFee
   */
  apostleBreedBid(tokenId, targetTokenId, amountMax, callback = {}) {
    return this.triggerContract(
      {
        methodName: "bidWithToken",
        abiKey: "apostleSiringAuction",
        abiString: this.ABIs["apostleSiringAuctionV3"].abi,
        contractParams: [
          Utils.pad0x(tokenId),
          Utils.pad0x(targetTokenId),
          amountMax,
        ],
      },
      callback
    );
  },

  /**
   * Bid apostle on Renting
   * @param tokenId - Apostle tokenId
   * @param price - bid price
   */
  apostleHireBid(tokenId, amountMax, callback = {}) {
    return this.triggerContract(
      {
        methodName: "takeTokenUseOffer",
        abiKey: "apostleTokenUse",
        abiString: this.ABIs["apostleTokenUseV2"].abi,
        contractParams: [Utils.pad0x(tokenId), amountMax],
      },
      callback
    );
  },

  /**
   * Apostle Born without element
   * @param motherTokenId
   */
  apostleBorn(motherTokenId, callback = {}) {
    return this.triggerContract(
      {
        methodName: "giveBirth",
        abiKey: "apostleBase",
        abiString: this.ABIs["apostleBaseV3"].abi,
        contractParams: [
          Utils.pad0x(motherTokenId),
          Utils.padLeft(0, 40, "0"),
          0,
          0,
        ],
      },
      callback
    );
  },

  /**
   * Apostle Born with element
   * @param motherTokenId
   * @param element
   * @param level
   * @param levelUnitPrice
   */
  apostleBornAndEnhance(
    motherTokenId,
    element,
    level,
    levelUnitPrice,
    callback = {}
  ) {
    const elementAddress = this.ABIs[element.toLowerCase()].address;

    return this.triggerContract(
      {
        methodName: "giveBirth",
        abiKey: "apostleBase",
        abiString: this.ABIs["apostleBaseV3"].abi,
        contractParams: [
          Utils.pad0x(motherTokenId),
          elementAddress,
          level,
          new BigNumber(level).times(new BigNumber(levelUnitPrice)).toFixed(),
        ],
      },
      callback
    );
  },

  apostleGetChangeClassFee(
    callback = {}
  ) {
    return this.callContract(
      {
        methodName: "uintOf",
        abiKey: "settingRegistry",
        abiString: this.ABIs["settingRegistry"].abi,
        contractParams: [
         '0x55494e545f4348414e4745434c4153535f464545000000000000000000000000' // UINT_CHANGECLASS_FEE
        ],
      },
      callback
    );
  },

  apostleChangeClass(
    apostleTokenId,
    apostleClass, 
    maxFee,
    callback = {}
  ) {
    return this.triggerContract(
      {
        methodName: "changeClass",
        abiKey: "apostleBase",
        abiString: this.ABIs["apostleBaseV3"].abi,
        contractParams: [
          Utils.pad0x(apostleTokenId),
          apostleClass, 
          maxFee,
        ],
      },
      callback
    );
  },

  apostleEquip(
    apostleTokenId,
    slot,
    equipTokenContractAddress,
    equipTokenId,
    callback = {}
  ) {
    return this.triggerContract(
      {
        methodName: "equip",
        abiKey: "apostleBase",
        abiString: this.ABIs["apostleBaseV3"].abi,
        contractParams: [
          Utils.pad0x(apostleTokenId),
          slot,
          equipTokenContractAddress,
          Utils.pad0x(equipTokenId),
        ],
      },
      callback
    );
  },

  apostleDivest(
    apostleTokenId,
    slot,
    callback = {}
  ) {
    return this.triggerContract(
      {
        methodName: "divest",
        abiKey: "apostleBase",
        abiString: this.ABIs["apostleBaseV3"].abi,
        contractParams: [
          Utils.pad0x(apostleTokenId),
          slot,
        ],
      },
      callback
    );
  },
};

export default ApostleApi;
