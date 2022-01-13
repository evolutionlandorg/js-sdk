import BigNumber from 'bignumber.js';
import Utils from '../../utils/index';

const chainGasLimit = {
  // ethereum - mainnet
  "1": {
    craft: new BigNumber(210000),
  },
  // ethereum - ropsten
  "3": {
    craft: new BigNumber(210000),
  },
  // heco - mainnet
  "256": {
    craft: new BigNumber(210000),
  },
  // heco - testnet
  "128": {
    craft: new BigNumber(210000),
  },
  "tron-1": {
    craft: null,
  },
  "tron-11111": {
    craft: null,
  }
}

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

  /**
   * takeback(...) is invoked by the user who want to clain drill
   * @param {*} param0 _hashmessage = hash("${address(this)}{_user}${networkid}${ids[]}${rewards[]}"), _v, _r, _s are from supervisor's signature on _hashmessage
   * @param {*} callback 
   * @returns 
   */
  pveMaterialTakeback({ nonce, ids, rewards, hashmessage, v, r, s }, callback = {}) {
    return this.triggerContract(
      {
        methodName: "takeback",
        abiKey: "pveMaterialTakeBack",
        abiString: this.ABIs["pveMaterialTakeBack"].abi,
        contractParams: [nonce, ids, rewards, hashmessage, v, r, s],
        sendParams: {
          value: 0,
        },
      },
      callback
    );
  },
  
  /**
   * Encode material id to tokenId
   * @param {*} id 
   * @param {*} callback 
   * @returns 
   */
  pveMaterialIdEncode(id, callback = {}) {
    return this.callContract(
      {
        methodName: "encode",
        abiKey: "pveMaterial",
        abiString: this.ABIs["pveMaterial"].abi,
        contractParams: [id],
      },
      callback
    );
  },

  /**
   * {IERC1155-safeBatchTransferFrom}.
   * @param {*} account from
   * @param {*} to recipient
   * @param {*} ids tokenId array
   * @param {*} amounts amounts array
   * @param {*} data 
   * @param {*} callback 
   * @returns 
   */
  async pveMaterialTransfer(account, to, ids, amounts, data="0x", callback = {}) {
    const from = account || await this.getCurrentAccount();
    
    return this.triggerContract(
      {
        methodName: "safeBatchTransferFrom",
        abiKey: "pveMaterial",
        abiString: this.ABIs["pveMaterial"].abi,
        contractParams: [from, to, ids, amounts, data|"0x"],
      },
      callback
    );
  },

  /**
   * Get team lock time
   * @param {*} address account address
   * @param {*} callback 
   * @returns 
   */
  pveGetTeamLockTime(address, callback = {}) {
    return this.callContract(
      {
        methodName: "teamLock",
        abiKey: "pveTeam",
        abiString: this.ABIs["pveTeam"].abi,
        contractParams: [address],
      },
      callback
    );
  },
  /**
   * Use material synthesis equipment
   * @param {*} objId Illustrated ID of the target equipment
   * @param {*} rarity Rarity of the target equipment
   * @param {*} tokenContractAddress token address of the target equipment
   * @param {*} callback 
   * @returns 
   */
  pveCraftNew(objId, rarity, tokenContractAddress, callback = {}) {
    const gasLimit = chainGasLimit[this.env.CONTRACT.NETWORK].craft;
    return this.triggerContract(
      {
        methodName: "craft",
        abiKey: "pveCraft",
        abiString: this.ABIs["pveCraft"].abi,
        contractParams: [objId, rarity, tokenContractAddress],
        sendParams: {
          gasLimit: gasLimit.plus(new BigNumber(350000)).toFixed(0),
        }
      },
      callback
    );
  },

  pveCraftNewBatch(objIdList, rarityList, tokenContractAddressList, callback = {}) {
    const gasLimit = chainGasLimit[this.env.CONTRACT.NETWORK].craft;
    return this.triggerContract(
      {
        methodName: "craft_batch",
        abiKey: "pveCraft",
        abiString: this.ABIs["pveCraft"].abi,
        contractParams: [objIdList, rarityList, tokenContractAddressList],
        sendParams: {
          gasLimit: gasLimit.times(objIdList.length).plus(new BigNumber(350000)).toFixed(0),
        }
      },
      callback
    );
  },

  /**
   * Enchant equipment
   * @param {*} objId Equipment Token Id
   * @param {*} tokenContractAddress Token address of the material
   * @param {*} callback 
   * @returns 
   */
  pveCraftEnchant(tokenId, tokenContractAddress, callback = {}) {
    return this.triggerContract(
      {
        methodName: "enchant",
        abiKey: "pveCraft",
        abiString: this.ABIs["pveCraft"].abi,
        contractParams: [Utils.pad0x(tokenId), tokenContractAddress],
      },
      callback
    );
  },

  /**
   * Disnchant equipment
   * @param {*} tokenId Equipment Token Id
   * @param {*} callback 
   * @returns 
   */
  pveCraftDisenchant(tokenId, callback = {}) {
    console.log(21)
    return this.triggerContract(
      {
        methodName: "disenchant",
        abiKey: "pveCraft",
        abiString: this.ABIs["pveCraft"].abi,
        contractParams: [Utils.pad0x(tokenId)],
      },
      callback
    );
  },

  /**
   * Get equipment illustrated info
   * @param {*} objId Illustrated Id
   * @param {*} rarity Illustrated rarity
   * @param {*} callback {id, materials, mcosts, ecost, srate, name}
   * @returns 
   */
  pveCraftGetObjInfo(objId, rarity, callback = {}) {
    return this.callContract(
      {
        methodName: "get_obj",
        abiKey: "pveCraft",
        abiString: this.ABIs["pveCraft"].abi,
        contractParams: [objId, rarity],
      },
      callback
    );
  },
};
