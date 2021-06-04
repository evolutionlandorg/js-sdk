import Utils from '../../utils/index'

let FurnaceApi = {
  /**
   * buy lucky box
   * @param {*} to - the recipient of lucky box
   * @param {*} goldBoxAmount - gold box amount
   * @param {*} silverBoxAmount - silver box amount
   */
  async buyFurnaceTreasure(
    to,
    goldBoxAmount = 0,
    silverBoxAmount = 0,
    callback
  ) {
    const treasurePrice = await this.getFurnaceTreasurePrice();
    const cost = Utils.toBN(treasurePrice.priceGoldBox)
      .muln(goldBoxAmount)
      .add(Utils.toBN(treasurePrice.priceSilverBox).muln(silverBoxAmount));

    return this.triggerContract(
      {
        methodName: "buyBox",
        abiKey: this.ABIs["itemTreasure"].address,
        abiString: this.ABIs["drillLuckyBoxV2"].abi,
        contractParams: [to, goldBoxAmount, silverBoxAmount, cost.toString(10)],
        sendParams: {
          value: 0,
        },
      },
      callback
    );
  },
};

export default FurnaceApi;
