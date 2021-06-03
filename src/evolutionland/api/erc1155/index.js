let Erc1155Api = {
  /**
   * Check if uniswap has sufficient transfer authority
   * @param {*} tokenAddressOrType
   * @param {*} account
   */
  async erc1155IsApprovedForAll(
    owner,
    operator,
    contractAddress,
    callback = {}
  ) {
    return this.callContract(
      {
        methodName: "isApprovedForAll",
        abiKey: contractAddress,
        abiString: this.ABIs["erc1155"].abi,
        contractParams: [owner, operator],
      },
      callback
    );
  },

  async erc1155SetApprovalForAll(operator, approved, contractAddress, callback = {}) {
    return this.triggerContract(
      {
        methodName: "setApprovalForAll",
        abiKey: contractAddress,
        abiString: this.ABIs["erc1155"].abi,
        contractParams: [operator, approved],
      },
      callback
    );
  },
};

export default Erc1155Api;
