import Utils from "../../utils/index";

let FurnaceV1Api = {
  /**
   * get furnace treasure price
   * @returns {} - promise -> {0: "1026000000000000000000", 1: "102000000000000000000", priceGoldBox: "1026000000000000000000", priceSilverBox: "102000000000000000000"}
   */
  async getFurnaceTreasurePrice() {
    const _contract = await this._tronweb.contract().at( this.getContractAddress('itemTreasure') );

    return _contract.methods.getPrice().call();
  },

  async getFurnaceTakeBackNonce(address) {
    const _contract = await this._tronweb.contract().at( this.getContractAddress('itemTakeBack') );
    return _contract.methods.userToNonce(address).call();
  },

  /**
   * buy lucky box
   * @param {*} goldBoxAmount - gold box amount
   * @param {*} silverBoxAmount - silver box amount
   */
  async buyFurnaceTreasure(goldBoxAmount = 0, silverBoxAmount = 0, callback) {
    const treasurePrice = await this.getFurnaceTreasurePrice();
    const cost = Utils.toBN(treasurePrice.priceGoldBox)
      .muln(goldBoxAmount)
      .add(Utils.toBN(treasurePrice.priceSilverBox).muln(silverBoxAmount));

    // Function: transfer(address _to, uint256 _value, bytes _data) ***
    // data
    // 0000000000000000000000000000000000000000000000000000000000000001 gold box amount
    // 0000000000000000000000000000000000000000000000000000000000000002 silver box amount
    const data =
      Utils.toTwosComplement(goldBoxAmount) +
      Utils.toTwosComplement(silverBoxAmount).substring(2, 66);
    return this.triggerContract(
      {
        methodName: this.ERC20TRANSFERMETHOD,
        abiKey: "ring",
        abiString: this.ABIs["ring"].abi,
        contractParams: [
          this.ABIs["itemTreasure"].address,
          cost.toString(10),
          data,
        ],
        sendParams: {
          value: 0,
        },
      },
      callback
    );
  },

  /**
   *  open furnace treasure
   * @returns {Promise<PromiEvent<any>>}
   */
  openFurnaceTreasure(
    { boxIds, amounts, hashmessage, v, r, s },
    callback = {}
  ) {
    // During the process of opening the treasure chest, there is the logic of randomly gifting rings,
    // which leads to inaccurate gas estimation, so manually set it to avoid out of gas.
    // https://etherscan.io/tx/0xe71f54aee8f7ab1dd15df955d09c79af5060f20e91c0c5ecfcf17f20c9bf02b3
    // https://etherscan.io/tx/0x7b04df9b55f33b6edcc402a5733dbc753a6bbe2f78af7c7bef6f3f4d8dce7491

    // no return ring - gas used - 229,289
    // https://etherscan.io/tx/0x4e1fc1dcec64bb497405126e55ab743368f1cb1cede945936937e0cde1d254e7
    // prize ring - gas used - 254,776
    // https://etherscan.io/tx/0xd2b3f05b19e74627940edfe98daee31eeab84b67e88dcf0e77d595430b3b1afc
    const silverBoxGasLimit =
      this.env.NETWORK === "1" ? new BigNumber(260000) : new BigNumber(350000);
    const goldBoxGasLimit =
      this.env.NETWORK === "1" ? new BigNumber(300000) : new BigNumber(400000);

    let gasLimit = new BigNumber(amounts[0]).lt("1000000000000000000000")
      ? silverBoxGasLimit
      : goldBoxGasLimit;

    if (amounts.length > 1) {
      for (let index = 1; index < amounts.length; index++) {
        const amount = amounts[index];
        gasLimit = gasLimit.plus(
          new BigNumber(amount).lt("1000000000000000000000")
            ? silverBoxGasLimit
            : silverBoxGasLimit
        );
      }
    }

    return this.triggerContract(
      {
        methodName: "openBoxes",
        abiString: this.ABIs["itemTakeBack"].abi,
        contractParams: [boxIds, amounts, hashmessage, v, r, s],
        sendParams: {
          value: 0,
          gasLimit: gasLimit.toFixed(0),
        },
        abiKey: "itemTakeBack",
      },
      callback
    );
  },

  async checkFurnaceTreasureStatus(id) {
    const _contract = await this._tronweb.contract().at( this.getContractAddress('itemTakeBack') );
    return _contract.methods.ids(id).call();
  },
};

export default FurnaceV1Api;
