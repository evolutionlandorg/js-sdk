import Utils from '../../utils/index'

let PetApi = {
  petGetPetContractData(petTypes) {
    const Pets = {
      'CryptoKitties': {
        token: this.ABIs['petCryptoKitties'],
        type: 'erc721'
      },
      'PolkaPets': {
        token: this.ABIs['petPolkaPets'],
        type: 'erc1155'
      }
    }

    return Pets[petTypes];
  },

  petIsApprovedOrOwnerToBridge(petsType, { tokenId, owner }) {
    const contractData = this.petGetPetContractData(petsType);

    if(contractData.type === 'erc721') {
      // spender, contractAddress, tokenId
      return this.erc721IsApprovedOrOwner(this.ABIs['petBridge'].address, contractData.token.address, tokenId);
    }

    if(contractData.type === 'erc1155') {
      // owner, operator, contractAddress,
      return this.erc1155IsApprovedForAll(owner, this.ABIs['petBridge'].address, contractData.token.address);
    }
  },

  petSetApprovalForAllToBridge(petsType) {
    const contractData = this.petGetPetContractData(petsType);

    if(contractData.type === 'erc721') {
      // operator, approved, contractAddress
      return this.erc721SetApprovalForAll(this.ABIs['petBridge'].address, true, contractData.token.address);
    }

    if(contractData.type === 'erc1155') {
      // operator, approved, contractAddress
      return this.erc1155SetApprovalForAll(this.ABIs['petBridge'].address, true, contractData.token.address);
    }
  },

  petMirrorIsApprovedOrOwnerToBridge(mirrorTokenId) {
    // spender, contractAddress, tokenId
    return this.erc721IsApprovedOrOwner(this.ABIs['petBridge'].address, this.ABIs['objectOwnership'].address, Utils.pad0x(mirrorTokenId));
  },

  petMirrorSetApprovalForAllToBridge(callback = {}) {
    // operator, approved, contractAddress
    return this.erc721SetApprovalForAll(this.ABIs['petBridge'].address, true, this.ABIs['objectOwnership'].address, callback);
  },

  petSwapOutFromBridge(petsType, mirrorTokenId, callback = {}) {
    const contractData = this.petGetPetContractData(petsType);

    if(contractData.type === 'erc721') {
      return this.triggerContract(
        {
          methodName: "swapOut",
          abiKey: this.ABIs['petBridge'].address,
          abiString: this.ABIs['petBridge'].abi,
          contractParams: [Utils.pad0x(mirrorTokenId)],
        },
        callback
      );
    }

    if(contractData.type === 'erc1155') {
      return this.triggerContract(
        {
          methodName: "swapOut1155",
          abiKey: this.ABIs['petBridge'].address,
          abiString: this.ABIs['petBridge'].abi,
          contractParams: [Utils.pad0x(mirrorTokenId)],
        },
        callback
      );
    }
  },

  petMirrorTokenApproveToBridge(petsType, {}) {
    const contractData = this.petGetPetContractData(petsType);

    if(contractData.type === 'erc721') {
      this.erc721IsApprovedOrOwner();

    }

    if(contractData.type === 'erc1155') {

    }
  },

  petSwapInToBridge(petsType, {from, id, value = 1, data = '0x'}, callback = {}) {
    const contractData = this.petGetPetContractData(petsType);
  
    if(contractData.type === 'erc721') {
      return this.triggerContract(
        {
          methodName: "safeTransferFrom",
          abiKey: contractData.token.address,
          abiString: contractData.token.abi,
          contractParams: [from, this.ABIs['petBridge'].address, Utils.pad0x(id)],
        },
        callback
      );
    }

    if(contractData.type === 'erc1155') {
      return this.triggerContract(
        {
          methodName: "safeTransferFrom",
          abiKey: contractData.token.address,
          abiString: contractData.token.abi,
          contractParams: [from, this.ABIs['petBridge'].address, Utils.pad0x(Utils.padLeft(id, 64, '0')), value, data],
        },
        callback
      );
    }
  },

  petTiePetTokenToApostle(mirrorTokenId, apostleTokenId, callback = {}) {
    return this.triggerContract(
      {
        methodName: "tiePetTokenToApostle",
        abiKey: this.ABIs['petBase'].address,
        abiString: this.ABIs['petBase'].abi,
        contractParams: [Utils.pad0x(mirrorTokenId), Utils.pad0x(apostleTokenId)],
      },
      callback
    );
  },

  petUntiePetToken(petTokenId, callback = {}) {
    return this.triggerContract(
      {
        methodName: "untiePetToken",
        abiKey: this.ABIs['petBase'].address,
        abiString: this.ABIs['petBase'].abi,
        contractParams: [Utils.pad0x(petTokenId)],
      },
      callback
    );
  }

}

export default PetApi;