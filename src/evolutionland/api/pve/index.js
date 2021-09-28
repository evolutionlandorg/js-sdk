import Utils from '../../utils/index';

export const PveApi = {
  /**
   * Pve Team Join
   * @param {number} slot Apostle's slot like 0 | 1 | 2 | 3
   * @param {string} tokenId Apostle's TokenID
   * @param {unknown} callback Callback
   * @returns unknown
   */
  pveTeamJoin(slot, tokenId, callback = {}) {
    if (!this.ABIs['pveTeam'].abi || !this.ABIs['pveTeam'].address) {
      throw new Error("pve contract abi or address undefined");
    }

    return this.triggerContract({
      methodName: "join",
      abiKey: "pveTeam",
      abiString: this.ABIs['pveTeam'].abi,
      contractParams: [
        slot, Utils.pad0x(tokenId)
      ],
    }, callback);
  },

  /**
   * Pve Team Joins
   * @param {Array<number>} slots Apostles's slot like [0, 1, 2, 3], 0 < slots.length < 4
   * @param {Array<string>} tokenIds Apostles's TokenID, 0 < tokenIds.length < 4
   * @param {unknown} callback Callback
   * @returns unknown
   */
  pveTeamJoins(slots, tokenIds, callback = {}) {
    if (!this.ABIs['pveTeam'].abi || !this.ABIs['pveTeam'].address) {
      throw new Error("pve contract abi or address undefined");
    }

    return this.triggerContract({
      methodName: "joins",
      abiKey: "pveTeam",
      abiString: this.ABIs['pveTeam'].abi,
      contractParams: [
        slots, tokenIds.map(tokenId => Utils.pad0x(tokenId))
      ],
    }, callback);
  },

  /**
   * Pve Team Exit
   * @param {string} tokenId Apostle's TokenID
   * @param {unknown} callback Callback
   * @returns unknown
   */
  pveTeamExit(tokenId, callback = {}) {
    if (!this.ABIs['pveTeam'].abi || !this.ABIs['pveTeam'].address) {
      throw new Error("pve contract abi or address undefined");
    }

    return this.triggerContract({
      methodName: "exit",
      abiKey: "pveTeam",
      abiString: this.ABIs['pveTeam'].abi,
      contractParams: [
        Utils.pad0x(tokenId)
      ],
    }, callback);
  },

  /**
   * Pve Team Exits
   * @param {Array<string>} tokenIds Apostles's TokenID
   * @param {unknown} callback Callback
   * @returns unknown
   */
   pveTeamExits(tokenIds, callback = {}) {
    if (!this.ABIs['pveTeam'].abi || !this.ABIs['pveTeam'].address) {
      throw new Error("pve contract abi or address undefined");
    }

    return this.triggerContract({
      methodName: "exits",
      abiKey: "pveTeam",
      abiString: this.ABIs['pveTeam'].abi,
      contractParams: [
        tokenIds.map(tokenId => Utils.pad0x(tokenId))
      ],
    }, callback);
  },

  /**
   * Pve Team Apostle Swap
   * @param {number} slot Apostle's slot
   * @param {string} newTokenId Apostle's TokenID
   * @param {unknown} callback Callback
   * @returns unknown
   */
  pveTeamSwap(slot, newTokenId, callback = {}) {
    if (!this.ABIs['pveTeam'].abi || !this.ABIs['pveTeam'].address) {
      throw new Error("pve contract abi or address undefined");
    }

    return this.triggerContract({
      methodName: "swap",
      abiKey: "pveTeam",
      abiString: this.ABIs['pveTeam'].abi,
      contractParams: [
        slot, Utils.pad0x(newTokenId)
      ],
    }, callback);
  },

  /**
   * Pve Team Evict (Force exit after the end of the lease period)
   * @param {string} tokenId Apostle's TokenID
   * @param {unknown} callback Callback
   * @returns unknown
   */
  pveTeamEvict(tokenId, callback = {}) {
    if (!this.ABIs['pveTeam'].abi || !this.ABIs['pveTeam'].address) {
      throw new Error("pve contract abi or address undefined");
    }

    return this.triggerContract({
      methodName: "evict",
      abiKey: "pveTeam",
      abiString: this.ABIs['pveTeam'].abi,
      contractParams: [
        Utils.pad0x(tokenId)
      ],
    }, callback);
  },

  /**
   * Pve Team At
   * @param {string} user Account address
   * @param {number} slot The slot of team member
   * @returns {string} The tokenId of apostle or 0x0
   */
  async pveTeamAt(user, slot) {
    if (!this.ABIs['pveTeam'].abi || !this.ABIs['pveTeam'].address) {
      throw new Error("pve contract abi or address undefined");
    }

    return Utils.toHex(await this.callContract({
      methodName: "at",
      abiKey: "pveTeam",
      abiString: this.ABIs['pveTeam'].abi,
      contractParams: [
        user, slot
      ],
    }));
  },

  /**
   * Pve Team Exist
   * @param {string} user Account address
   * @param {number} slot The slot of team member
   * @returns {boolean} The apostle if the member of the team or not
   */
  pveTeamExist(user, slot) {
    if (!this.ABIs['pveTeam'].abi || !this.ABIs['pveTeam'].address) {
      throw new Error("pve contract abi or address undefined");
    }

    return this.callContract({
      methodName: "exist",
      abiKey: "pveTeam",
      abiString: this.ABIs['pveTeam'].abi,
      contractParams: [
        user, slot
      ],
    });
  },
};
