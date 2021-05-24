

let Erc20Api = {
  /**
     * Check if uniswap has sufficient transfer authority
     * @param {*} tokenAddressOrType
     * @param {*} account
     */
    async erc20Allowance(tokenAddressOrType = 'ring', spender, from) {
      from = from || await this.getCurrentAccount();
      const token = await this.getContractAddress(tokenAddressOrType);
      const erc20Contract = new this._web3js.eth.Contract(this.ABIs["ring"].abi, token)
      const allowanceAmount = await erc20Contract.methods.allowance(from, spender).call()

      return allowanceAmount;
  }
}

export default Erc20Api;