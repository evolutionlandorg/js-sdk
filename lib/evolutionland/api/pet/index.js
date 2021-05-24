"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var PetApi = {
  petGetPetContractAddress: function petGetPetContractAddress(types) {
    var Pets = {
      'CryptoKitties': this.ABIs['petCryptoKitties'],
      'PolkaPets': this.ABIs['petPolkaPets']
    };
    return Pets[types];
  } // petSwapIn(stakerContractAddress, amount, callback = {}) {
  //   return this.triggerContract(
  //     {
  //       methodName: "stake",
  //       abiKey: stakerContractAddress,
  //       abiString: this.ABIs['liquidityStaker'].abi,
  //       contractParams: [amount],
  //     },
  //     callback
  //   );
  // }

};
var _default = PetApi;
exports["default"] = _default;