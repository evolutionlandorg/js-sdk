let CommonApi = {

  /**
   * Get lastest block timestamp
   * @returns 
   */
  async commonGetCurrentTimeStamp() {
    const blocknumber = await this._web3js.eth.getBlockNumber();
    const block = await this._web3js.eth.getBlock(blocknumber);
    return block.timestamp;
  },
};

export default CommonApi;
