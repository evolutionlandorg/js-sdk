let PetApi = {
  petGetPetContractAddress(types) {
    const Pets = {
      'CryptoKitties': this.ABIs['petCryptoKitties'],
      'PolkaPets': this.ABIs['petPolkaPets'],
    }

    return Pets[types];
  },

  // petSwapIn(stakerContractAddress, amount, callback = {}) {
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
}

export default PetApi;