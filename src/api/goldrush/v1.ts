import { ethers } from "ethers";
import { utilsPad0x } from "@evo/utils/index";
import type { CallbackType } from "@evo/utils/contractHelpers";
import { triggerContract, viewContract } from "@evo/utils/contractHelpers";

/**
 * Goldrush Join
 * @param signer Ethers signer
 * @param eventId The event id which to join
 * @param landTokenId The land token id which to join
 * @param amount The ring amount which to submit
 * @param subAddr The dvm address for receiving the new land
 * @param callback Callback
 */
export const goldRushRaffleJoin = async (
  signer: ethers.Signer,
  eventId: number,
  landTokenId: string,
  amount: string,
  subAddr: string,
  callback?: CallbackType
) => {
  await triggerContract(
    signer,
    "goldRushRaffle",
    "join",
    [eventId, utilsPad0x(landTokenId), amount, subAddr],
    callback
  );
};

/**
 * Goldrush Change Amount
 * @param signer Ethers signer
 * @param eventId Event id
 * @param landTokenId Land token id
 * @param amount Amount (to change)
 * @param callback Callback
 */
export const goldRushRaffleChangeAmount = async (
  signer: ethers.Signer,
  eventId: number,
  landTokenId: string,
  amount: string,
  callback?: CallbackType
) => {
  await triggerContract(signer, "goldRushRaffle", "changeAmount", [eventId, utilsPad0x(landTokenId), amount], callback);
};

/**
 * Goldrush Change Subaddress
 * @param signer Ethers signer
 * @param eventId Event id
 * @param landTokenId Land token id
 * @param subAddr Sub address (to change)
 * @param callback Callback
 */
export const goldRushRaffleChangeSubAddr = async (
  signer: ethers.Signer,
  eventId: number,
  landTokenId: string,
  subAddr: string,
  callback?: CallbackType
) => {
  await triggerContract(
    signer,
    "goldRushRaffle",
    "changeSubAddr",
    [eventId, utilsPad0x(landTokenId), subAddr],
    callback
  );
};

/**
 * Goldrush Change Info
 * @param signer Ethers signer
 * @param eventId Event id
 * @param landTokenId Land token id
 * @param amount Amount (to change)
 * @param subAddr Sub address (to change)
 * @param callback Callback
 */
export const goldRushRaffleChangeInfo = async (
  signer: ethers.Signer,
  eventId: number,
  landTokenId: string,
  amount: number,
  subAddr: string,
  callback?: CallbackType
) => {
  await triggerContract(
    signer,
    "goldRushRaffle",
    "change",
    [eventId, utilsPad0x(landTokenId), amount, subAddr],
    callback
  );
};

/**
 * Goldrush Exit
 * @param signer Ethers signer
 * @param eventId Event id
 * @param landTokenId Land token id
 * @param callback Callback
 */
export const goldRushRaffleExit = async (
  signer: ethers.Signer,
  eventId: number,
  landTokenId: string,
  callback?: CallbackType
) => {
  await triggerContract(signer, "goldRushRaffle", "exit", [eventId, utilsPad0x(landTokenId)], callback);
};

/**
 * Goldrush Draw
 * @param signer Ethers signer
 * @param eventId Event id
 * @param landTokenId Land token id
 * @param isWon Is won or not
 * @param param4 { hashmessage, v, r, s }
 * @param callback Callback
 */
export const goldRushRaffleDraw = async (
  signer: ethers.Signer,
  eventId: number,
  landTokenId: string,
  isWon: boolean,
  { hashmessage, v, r, s }: { hashmessage: string; v: number; r: string; s: string },
  callback?: CallbackType
) => {
  await triggerContract(
    signer,
    "goldRushRaffle",
    "draw",
    [eventId, utilsPad0x(landTokenId), isWon, hashmessage, v, r, s],
    callback
  );
};

/**
 * Goldrush History
 * @param provider Ethers provider
 * @param eventId Event id
 * @param landTokenId Land token id
 * @param callback Callback
 * @returns String balance or '0'
 */
export const goldRushRaffleGetHistory = async (
  provider: ethers.providers.Provider,
  eventId: number,
  landTokenId: string,
  callback?: CallbackType
): Promise<string> => {
  const results = await viewContract(provider, "goldRushRaffle", "lands", [eventId, utilsPad0x(landTokenId)], callback);
  return (results.balance as ethers.BigNumber).toString();
};
