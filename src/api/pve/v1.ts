import { ethers } from "ethers";
import { utilsPad0x } from "@evo/utils/index";
import type { CallbackType } from "@evo/utils/contractHelpers";
import { triggerContract, viewContract } from "@evo/utils/contractHelpers";

export type SlotType = 0 | 1 | 2 | 3; // there're 4 members a team for now

/**
 * PVE Team Join
 * @param signer Ethers signer
 * @param slot Slot
 * @param tokenId Apostle token id
 * @param callback Callback
 */
export const pveTeamJoin = async (
  signer: ethers.Signer,
  slot: SlotType,
  tokenId: string,
  callback?: CallbackType
): Promise<void> => {
  await triggerContract(signer, "pveTeam", "join", [slot, utilsPad0x(tokenId)], callback);
};

/**
 * PVE Team Joins
 * @param signer Ethers signer
 * @param slots Slot
 * @param tokenIds Apostles token id
 * @param callback Callback
 */
export const pveTeamJoins = async (
  signer: ethers.Signer,
  slots: SlotType[],
  tokenIds: string[],
  callback?: CallbackType
) => {
  await triggerContract(signer, "pveTeam", "joins", [slots, tokenIds.map((tokenId) => utilsPad0x(tokenId))], callback);
};

/**
 * PVE Team Exit
 * @param signer Ethers signer
 * @param tokenId Apostle token id
 * @param callback Callback
 */
export const pveTeamExit = async (signer: ethers.Signer, tokenId: string, callback?: CallbackType): Promise<void> => {
  await triggerContract(signer, "pveTeam", "exit", [utilsPad0x(tokenId)], callback);
};

/**
 * PVE Team Exits
 * @param signer Ethers signer
 * @param tokenIds Apostles token id
 * @param callback Callback
 */
export const pveTeamExits = async (signer: ethers.Signer, tokenIds: string[], callback?: CallbackType) => {
  await triggerContract(signer, "pveTeam", "exits", [tokenIds.map((tokenId) => utilsPad0x(tokenId))], callback);
};

/**
 * PVE Team Swap
 * @param signer Ethers signer
 * @param slot Slot
 * @param newTokenId Apostle token id
 * @param callback Callback
 */
export const pveTeamSwap = async (
  signer: ethers.Signer,
  slot: SlotType,
  newTokenId: string,
  callback?: CallbackType
) => {
  await triggerContract(signer, "pveTeam", "swap", [slot, utilsPad0x(newTokenId)], callback);
};

/**
 * PVE Team Evict (Force exit after the end of the lease period)
 * @param signer Ethers signer
 * @param tokenId Apostle token id
 * @param callback Callback
 */
export const pveTeamEvict = async (signer: ethers.Signer, tokenId: string, callback?: CallbackType) => {
  await triggerContract(signer, "pveTeam", "evict", [utilsPad0x(tokenId)], callback);
};

/**
 * PVE Team At
 * @param provider Ethers provider
 * @param user Account address
 * @param slot Slot
 * @param callback Callback
 * @returns Apostle token id or 0x00
 */
export const pveTeamAt = async (
  provider: ethers.providers.Provider,
  user: string,
  slot: SlotType,
  callback?: CallbackType
): Promise<string> => {
  const results = await viewContract(provider, "pveTeam", "at", [user, slot], callback);
  return (results[0] as ethers.BigNumber).toHexString();
};

/**
 * PVE Team Exist
 * @param provider Ethers provider
 * @param user Account address
 * @param slot Slot
 * @param callback Callback
 * @returns Boolean true or false
 */
export const pveTeamExist = async (
  provider: ethers.providers.Provider,
  user: string,
  slot: SlotType,
  callback?: CallbackType
): Promise<boolean> => {
  const results = await viewContract(provider, "pveTeam", "exist", [user, slot], callback);
  return results[0] as boolean;
};
