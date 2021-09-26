import { ethers } from "ethers";
import { utilsPad0x } from "@evo/utils/index";
import type { CallbackType } from "@evo/utils/contractHelpers";
import { triggerContract } from "@evo/utils/contractHelpers";

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
