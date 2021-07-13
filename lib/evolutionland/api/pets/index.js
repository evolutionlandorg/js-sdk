"use strict";

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime.js");

var _index = _interopRequireDefault(require("../../utils/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

  /**
   * Check approve for all
   * @param {string} owner use wallet
   */
  polkapetsIsApprovalForAllToBridge: function polkapetsIsApprovalForAllToBridge(owner) {
    var operator = this.ABIs["petBridge"].address;
    var contractData = this.petGetPetContractData("PolkaPets");
    return this.callContract({
      methodName: 'isApprovedForAll',
      abiKey: contractData.token.address,
      abiString: contractData.token.abi,
      contractParams: [owner, operator]
    });
  },
  polkapetsSetApprovalForAllToBridge: function polkapetsSetApprovalForAllToBridge() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.triggerContract({
      methodName: 'setApprovalForAll',
      abiKey: this.ABIs["petPolkaPets"].address,
      abiString: this.ABIs['petPolkaPets'].abi,
      contractParams: [this.ABIs["petBridge"].address, true]
    }, callback);
  },
  petMirrorIsApprovedOrOwnerToBridge: function petMirrorIsApprovedOrOwnerToBridge() {
    var _arguments = arguments,
        _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var mirrorTokenId, spender, owner, approvedAddress, isApprovedForAll;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              mirrorTokenId = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : "";
              spender = _this.ABIs["petBridge"].address;
              _context.next = 4;
              return _this.callContract({
                methodName: 'ownerOf',
                abiKey: _this.ABIs["objectOwnership"].address,
                abiString: _this.ABIs['objectOwnership'].abi,
                contractParams: [_index["default"].pad0x(mirrorTokenId)]
              });

            case 4:
              owner = _context.sent;
              _context.next = 7;
              return _this.callContract({
                methodName: 'getApproved',
                abiKey: _this.ABIs["objectOwnership"].address,
                abiString: _this.ABIs['objectOwnership'].abi,
                contractParams: [_index["default"].pad0x(mirrorTokenId)]
              });

            case 7:
              approvedAddress = _context.sent;
              _context.next = 10;
              return _this.callContract({
                methodName: 'isApprovedForAll',
                abiKey: _this.ABIs["objectOwnership"].address,
                abiString: _this.ABIs['objectOwnership'].abi,
                contractParams: [owner, spender]
              });

            case 10:
              isApprovedForAll = _context.sent;
              return _context.abrupt("return", owner.toLowerCase() === spender.toLowerCase() || approvedAddress.toLowerCase() === spender.toLowerCase() || isApprovedForAll);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  petMirrorIsApprovalForAllToBridge: function petMirrorIsApprovalForAllToBridge(owner) {
    var operator = this.ABIs["petBridge"].address;
    return this.callContract({
      methodName: 'isApprovedForAll',
      abiKey: this.ABIs["objectOwnership"].address,
      abiString: this.ABIs["objectOwnership"].abi,
      contractParams: [owner, operator]
    });
  },
  petMirrorSetApprovalForAllToBridge: function petMirrorSetApprovalForAllToBridge() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.triggerContract({
      methodName: 'setApprovalForAll',
      abiKey: this.ABIs["objectOwnership"].address,
      abiString: this.ABIs['objectOwnership'].abi,
      contractParams: [this.ABIs["petBridge"].address, true]
    }, callback);
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
    } else if (contractData.type === "erc1155") {
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

  /**
   * Check if a kitty is approve before tame
   * @param {*} tokenId
   * @param {*} callback
   * @returns true for approved, or false
   */
  kittyIndexToApproved: function kittyIndexToApproved(tokenId) {
    var _arguments2 = arguments,
        _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var _this2$ABIs$petBridge;

      var callback, result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              callback = _arguments2.length > 1 && _arguments2[1] !== undefined ? _arguments2[1] : {};
              _context2.next = 3;
              return _this2.callContract({
                methodName: "kittyIndexToApproved",
                abiKey: _this2.ABIs["petCryptoKitties"].address,
                abiString: _this2.ABIs["petCryptoKitties"].abi,
                contractParams: [tokenId]
              }, callback);

            case 3:
              result = _context2.sent;
              return _context2.abrupt("return", (result || "").toLowerCase() === (((_this2$ABIs$petBridge = _this2.ABIs['petBridge']) === null || _this2$ABIs$petBridge === void 0 ? void 0 : _this2$ABIs$petBridge.address) || "").toLowerCase());

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },

  /**
   * Kitty approve bofore tame
   * @param {string} tokenId
   * @param {object} callback
   */
  kittyApprove: function kittyApprove(tokenId) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.triggerContract({
      methodName: 'approve',
      abiKey: this.ABIs['petCryptoKitties'].address,
      abiString: this.ABIs['petCryptoKitties'].abi,
      contractParams: [this.ABIs['petBridge'].address, tokenId]
    }, callback);
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