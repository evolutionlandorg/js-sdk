import { ethers } from "ethers";
import { getEnvByProvider } from "@evo/env/index";
import { utilsPad0x } from "@evo/utils/index";
import type { CallbackType } from "@evo/utils/contractHelpers";
import { triggerContract, viewContract } from "@evo/utils/contractHelpers";

/**
 * Land Bid With Token
 * @param signer Ethers signer
 * @param landTokenId Land token id
 * @param referrer Referrer
 * @param amount Amount of price in RING token
 * @param callback Callback
 */
export const landBidWithToken = async (
  signer: ethers.Signer,
  landTokenId: string,
  referrer: string | null,
  amount: string,
  callback?: CallbackType
) => {
  const finalReferrer =
    referrer && ethers.utils.isAddress(referrer) ? referrer : "0x0000000000000000000000000000000000000000";
  await triggerContract(
    signer,
    "landClockAuctionV3",
    "bidWithToken",
    [utilsPad0x(landTokenId), finalReferrer, amount],
    callback
  );
};

/**
 * Available Land Resources
 * @param provider Ethers provider
 * @param tokenId Token id
 * @param resources Resources
 * @param callback Callback
 * @returns
 */
export const availableLandResources = async (
  provider: ethers.providers.Provider,
  tokenId: string,
  resources: string[],
  callback?: CallbackType
): Promise<string[]> => {
  const env = await getEnvByProvider(provider);
  if (!env) {
    return [];
  }

  const finalRes = resources.length
    ? [...resources]
    : [
        env.CONTRACT_ADDRESS.TOKEN_ELEMENT_GOLD,
        env.CONTRACT_ADDRESS.TOKEN_ELEMENT_WOOD,
        env.CONTRACT_ADDRESS.TOKEN_ELEMENT_WATER,
        env.CONTRACT_ADDRESS.TOKEN_ELEMENT_FIRE,
        env.CONTRACT_ADDRESS.TOKEN_ELEMENT_SOIL,
      ];
  const results = await viewContract(
    provider,
    "apostleLandResource",
    "availableLandResources",
    [utilsPad0x(tokenId), finalRes],
    callback
  );
  return results.map((res) => (res as ethers.BigNumber).toString());
};

/**
 * Land Batch Claim Land Resource
 * @param signer Ethers signer
 * @param tokenIds Token ids
 * @param callback Callback
 */
export const landBatchClaimLandResource = async (
  signer: ethers.Signer,
  tokenIds: string[],
  callback?: CallbackType
) => {
  await triggerContract(
    signer,
    "apostleLandResource",
    "batchClaimLandResource",
    [tokenIds.map((tokenId) => utilsPad0x(tokenId))],
    callback
  );
};
