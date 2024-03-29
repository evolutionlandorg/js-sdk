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

  /**
   * Batch claim props resource
   * @param {string[]} addresses Addresses
   * @param {string[]} tokenIds Token IDs of props
   * @param {fn} callback Callback
   * @returns any
   */
    propBatchClaimPropResource(addresses, tokenIds, callback = {}) {
    return this.triggerContract(
      {
        methodName: "batchClaimItemResource",
        abiKey: 'apostleLandResource',
        abiString: this.ABIs['apostleLandResourceV2'].abi,
        contractParams: [addresses.map((address) => Utils.pad0x(address)), tokenIds.map((tokenId) => Utils.pad0x(tokenId))],
      },
      callback
    );
  },
};

export default DrillApi;
