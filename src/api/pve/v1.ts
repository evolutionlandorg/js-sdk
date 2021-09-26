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
 * PVE Team Exit
 * @param signer Ethers signer
 * @param tokenId Apostle token id
 * @param callback Callback
 */
export const pveTeamExit = async (signer: ethers.Signer, tokenId: string, callback?: CallbackType): Promise<void> => {
  await triggerContract(signer, "pveTeam", "exit", [utilsPad0x(tokenId)], callback);
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
