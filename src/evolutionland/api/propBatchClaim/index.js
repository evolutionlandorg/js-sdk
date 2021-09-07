import Utils from "../../utils/index";

export const PropBatchClaimApi = {

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
}
