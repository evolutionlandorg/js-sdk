import Utils from "../../utils/index";

let DrillApi = {
  /**
   * Get Drill info by land tokenId and landbar index.
   * @param {*} landTokenId 
   * @param {*} landBarIndex 
   * @param {*} callback 
   * @returns 
   */
  async drillGetLandId2Bars(landTokenId, landBarIndex, callback = {}) {
    return this.callContract(
      {
        methodName: "landId2Bars",
        abiKey: "apostleLandResource",
        abiString: this.ABIs["apostleLandResource"].abi,
        contractParams: [Utils.pad0x(landTokenId), landBarIndex],
      },
      callback
    );
  },
};

export default DrillApi;
