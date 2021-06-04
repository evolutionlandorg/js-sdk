let Erc20Api = {
  /**
   * Check if uniswap has sufficient transfer authority
   * @param {*} tokenAddressOrType
   * @param {*} account
   */
  async erc20Allowance(tokenAddressOrType, spender, from) {
    from = from || (await this.getCurrentAccount());
    const token = this.getContractAddress(tokenAddressOrType);
    const erc20Contract = new this._web3js.eth.Contract(
      this.ABIs["ring"].abi,
      token
    );
    
    console.log('js-sdk::erc20Allowance params:', from, spender);

    const allowanceAmount = await erc20Contract.methods
      .allowance(from, spender)
      .call();

    return allowanceAmount;
  },

  erc20Approve(
    tokenAddressOrType,
    spender,
    value = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    callback = {}
  ) {
    const token = this.getContractAddress(tokenAddressOrType);

    return this.triggerContract(
      {
        methodName: "approve",
        abiKey: token,
        abiString: this.ABIs["ring"].abi,
        contractParams: [spender, value],
      },
      callback
    );
  },
};

export default Erc20Api;
