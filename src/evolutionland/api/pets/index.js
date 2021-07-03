import Utils from "../../utils/index";

let PetApi = {
  petGetPetContractData(petTypes) {
    const Pets = {
      CryptoKitties: {
        token: this.ABIs["petCryptoKitties"],
        type: "erc721",
      },
      PolkaPets: {
        token: this.ABIs["petPolkaPets"],
        type: "erc1155",
      },
    };

    return Pets[petTypes];
  },

  petIsApprovedOrOwnerToBridge(petsType, { tokenId, owner }, callback = {}) {
    const contractData = this.petGetPetContractData(petsType);

    if (contractData.type === "erc721") {
      // spender, contractAddress, tokenId
      return this.erc721IsApprovedOrOwner(
        this.ABIs["petBridge"].address,
        contractData.token.address,
        tokenId,
        callback
      );
    }

    if (contractData.type === "erc1155") {
      // owner, operator, contractAddress,
      return this.erc1155IsApprovedForAll(
        owner,
        this.ABIs["petBridge"].address,
        contractData.token.address,
        callback
      );
    }
  },

  /**
   * Check approve for all
   * @param {string} petsType PolkaPets
   * @param {string} owner use wallet
   * Note: not use for CryptoKitties
   */
  petIsApprovalForAllToBridge(petsType, owner) {
    const operator = this.ABIs["petBridge"].address;
    const contractData = this.petGetPetContractData(petsType);

    return this.callContract({
      methodName: 'isApprovedForAll',
      abiKey: contractData.token.address,
      abiString: contractData.token.abi,
      contractParams: [owner, operator],
    });
  },

  petSetApprovalForAllToBridge(callback = {}) {
    return this.triggerContract({
      methodName: 'setApprovalForAll',
      abiKey: this.ABIs["petPolkaPets"].address,
      abiString: this.ABIs['petPolkaPets'].abi,
      contractParams: [this.ABIs["petBridge"].address, true],
    }, callback);
  },

  async petMirrorIsApprovedOrOwnerToBridge(mirrorTokenId = "") {
    const spender = this.ABIs["petBridge"].address;

    const owner = await this.callContract({
      methodName: 'ownerOf',
      abiKey: this.ABIs["objectOwnership"].address,
      abiString: this.ABIs['objectOwnership'].abi,
      contractParams: [Utils.pad0x(mirrorTokenId)],
    });

    const approvedAddress = await this.callContract({
      methodName: 'getApproved',
      abiKey: this.ABIs["objectOwnership"].address,
      abiString: this.ABIs['objectOwnership'].abi,
      contractParams: [Utils.pad0x(mirrorTokenId)],
    });

    const isApprovedForAll = await this.callContract({
      methodName: 'isApprovedForAll',
      abiKey: this.ABIs["objectOwnership"].address,
      abiString: this.ABIs['objectOwnership'].abi,
      contractParams: [owner, spender],
    });

    return (owner.toLowerCase() === spender.toLowerCase() || approvedAddress.toLowerCase() === spender.toLowerCase() || isApprovedForAll);
  },

  petMirrorIsApprovalForAllToBridge(owner) {
    const operator = this.ABIs["petBridge"].address;

    return this.callContract({
      methodName: 'isApprovedForAll',
      abiKey: this.ABIs["objectOwnership"].address,
      abiString: this.ABIs["objectOwnership"].abi,
      contractParams: [owner, operator],
    });
  },

  petMirrorSetApprovalForAllToBridge(callback = {}) {
    return this.triggerContract({
      methodName: 'setApprovalForAll',
      abiKey: this.ABIs["objectOwnership"].address,
      abiString: this.ABIs['objectOwnership'].abi,
      contractParams: [this.ABIs["petBridge"].address, true],
    }, callback);
  },

  petSwapOutFromBridge(petsType, mirrorTokenId, callback = {}) {
    const contractData = this.petGetPetContractData(petsType);

    if (contractData.type === "erc721") {
      return this.triggerContract(
        {
          methodName: "swapOut721",
          abiKey: this.ABIs["petBridge"].address,
          abiString: this.ABIs["petBridge"].abi,
          contractParams: [Utils.pad0x(mirrorTokenId)],
        },
        callback
      );
    } else if (contractData.type === "erc1155") {
      return this.triggerContract(
        {
          methodName: "swapOut1155",
          abiKey: this.ABIs["petBridge"].address,
          abiString: this.ABIs["petBridge"].abi,
          contractParams: [Utils.pad0x(mirrorTokenId)],
        },
        callback
      );
    }
  },

  petSwapInToBridge(
    petsType,
    { from, id, value = 1, data = "0x" },
    callback = {}
  ) {
    const contractData = this.petGetPetContractData(petsType);

    if (contractData.type === "erc721") {
      return this.triggerContract(
        {
          methodName: "swapIn721",
          abiKey: this.ABIs["petBridge"].address,
          abiString: this.ABIs["petBridge"].abi,
          contractParams: [
            contractData.token.address,
            Utils.pad0x(id),
          ],
        },
        callback
      );
    }

    if (contractData.type === "erc1155") {
      return this.triggerContract(
        {
          methodName: "swapIn1155",
          abiKey: this.ABIs["petBridge"].address,
          abiString: this.ABIs["petBridge"].abi,
          contractParams: [
            contractData.token.address,
            Utils.pad0x(Utils.padLeft(id, 64, "0")),
            value,
          ],
        },
        callback
      );
    }
  },

  /**
   * Check if a kitty is approve before tame
   * @param {*} tokenId
   * @param {*} callback
   * @returns true for approved, or false
   */
  async kittyIndexToApproved(tokenId, callback = {}) {
    const result = await this.callContract({
      methodName: "kittyIndexToApproved",
      abiKey: this.ABIs["petCryptoKitties"].address,
      abiString: this.ABIs["petCryptoKitties"].abi,
      contractParams: [
        tokenId,
      ],
    }, callback);
    return (result || "").toLowerCase() === (this.ABIs['petBridge']?.address || "").toLowerCase();
  },

  /**
   * Kitty approve bofore tame
   * @param {string} tokenId
   * @param {object} callback
   */
  kittyApprove(tokenId, callback = {}) {
    return this.triggerContract({
      methodName: 'approve',
      abiKey: this.ABIs['petCryptoKitties'].address,
      abiString: this.ABIs['erc721'].abi,
      contractParams: [
        this.ABIs['petBridge'].address,
        tokenId,
      ],
    }, callback)
  },

  petTiePetTokenToApostle(mirrorTokenId, apostleTokenId, callback = {}) {
    return this.triggerContract(
      {
        methodName: "tiePetTokenToApostle",
        abiKey: this.ABIs["petBase"].address,
        abiString: this.ABIs["petBase"].abi,
        contractParams: [
          Utils.pad0x(mirrorTokenId),
          Utils.pad0x(apostleTokenId),
        ],
      },
      callback
    );
  },

  petUntiePetToken(petTokenId, callback = {}) {
    return this.triggerContract(
      {
        methodName: "untiePetToken",
        abiKey: this.ABIs["petBase"].address,
        abiString: this.ABIs["petBase"].abi,
        contractParams: [Utils.pad0x(petTokenId)],
      },
      callback
    );
  },
};

export default PetApi;
