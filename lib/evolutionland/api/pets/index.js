"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("../../utils/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PetApi = {
  petGetPetContractData: function petGetPetContractData(petTypes) {
    var Pets = {
      CryptoKitties: {
        token: this.ABIs["petCryptoKitties"],
        type: "erc721"
      },
      PolkaPets: {
        token: this.ABIs["petPolkaPets"],
        type: "erc1155"
      }
    };
    return Pets[petTypes];
  },
  petIsApprovedOrOwnerToBridge: function petIsApprovedOrOwnerToBridge(petsType, _ref) {
    var tokenId = _ref.tokenId,
        owner = _ref.owner;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var contractData = this.petGetPetContractData(petsType);

    if (contractData.type === "erc721") {
      // spender, contractAddress, tokenId
      return this.erc721IsApprovedOrOwner(this.ABIs["petBridge"].address, contractData.token.address, tokenId, callback);
    }

    if (contractData.type === "erc1155") {
      // owner, operator, contractAddress,
      return this.erc1155IsApprovedForAll(owner, this.ABIs["petBridge"].address, contractData.token.address, callback);
    }
  },
  petSetApprovalForAllToBridge: function petSetApprovalForAllToBridge(petsType) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var contractData = this.petGetPetContractData(petsType);

    if (contractData.type === "erc721") {
      // operator, approved, contractAddress
      return this.erc721SetApprovalForAll(this.ABIs["petBridge"].address, true, contractData.token.address, callback);
    }

    if (contractData.type === "erc1155") {
      // operator, approved, contractAddress
      return this.erc1155SetApprovalForAll(this.ABIs["petBridge"].address, true, contractData.token.address, callback);
    }
  },
  petMirrorIsApprovedOrOwnerToBridge: function petMirrorIsApprovedOrOwnerToBridge(mirrorTokenId) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // spender, contractAddress, tokenId
    return this.erc721IsApprovedOrOwner(this.ABIs["petBridge"].address, this.ABIs["objectOwnership"].address, _index["default"].pad0x(mirrorTokenId), callback);
  },
  petMirrorSetApprovalForAllToBridge: function petMirrorSetApprovalForAllToBridge() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // operator, approved, contractAddress
    return this.erc721SetApprovalForAll(this.ABIs["petBridge"].address, true, this.ABIs["objectOwnership"].address, callback);
  },
  petSwapOutFromBridge: function petSwapOutFromBridge(petsType, mirrorTokenId) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var contractData = this.petGetPetContractData(petsType);

    if (contractData.type === "erc721") {
      return this.triggerContract({
        methodName: "swapOut721",
        abiKey: this.ABIs["petBridge"].address,
        abiString: this.ABIs["petBridge"].abi,
        contractParams: [_index["default"].pad0x(mirrorTokenId)]
      }, callback);
    }

    if (contractData.type === "erc1155") {
      return this.triggerContract({
        methodName: "swapOut1155",
        abiKey: this.ABIs["petBridge"].address,
        abiString: this.ABIs["petBridge"].abi,
        contractParams: [_index["default"].pad0x(mirrorTokenId)]
      }, callback);
    }
  },
  petSwapInToBridge: function petSwapInToBridge(petsType, _ref2) {
    var from = _ref2.from,
        id = _ref2.id,
        _ref2$value = _ref2.value,
        value = _ref2$value === void 0 ? 1 : _ref2$value,
        _ref2$data = _ref2.data,
        data = _ref2$data === void 0 ? "0x" : _ref2$data;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var contractData = this.petGetPetContractData(petsType);

    if (contractData.type === "erc721") {
      return this.triggerContract({
        methodName: "swapIn721",
        abiKey: this.ABIs["petBridge"].address,
        abiString: this.ABIs["petBridge"].abi,
        contractParams: [contractData.token.address, _index["default"].pad0x(id)]
      }, callback);
    }

    if (contractData.type === "erc1155") {
      return this.triggerContract({
        methodName: "swapIn1155",
        abiKey: this.ABIs["petBridge"].address,
        abiString: this.ABIs["petBridge"].abi,
        contractParams: [contractData.token.address, _index["default"].pad0x(_index["default"].padLeft(id, 64, "0")), value]
      }, callback);
    }
  },
  petTiePetTokenToApostle: function petTiePetTokenToApostle(mirrorTokenId, apostleTokenId) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.triggerContract({
      methodName: "tiePetTokenToApostle",
      abiKey: this.ABIs["petBase"].address,
      abiString: this.ABIs["petBase"].abi,
      contractParams: [_index["default"].pad0x(mirrorTokenId), _index["default"].pad0x(apostleTokenId)]
    }, callback);
  },
  petUntiePetToken: function petUntiePetToken(petTokenId) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.triggerContract({
      methodName: "untiePetToken",
      abiKey: this.ABIs["petBase"].address,
      abiString: this.ABIs["petBase"].abi,
      contractParams: [_index["default"].pad0x(petTokenId)]
    }, callback);
  }
};
var _default = PetApi;
exports["default"] = _default;