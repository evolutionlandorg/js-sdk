import { ethers } from "ethers";
import type { EnvType } from "@evo/env/types";

import { HecoEnv } from "@evo/env/heco";
import { HecoTestEnv } from "@evo/env/hecotest";

export enum ChainIDs {
  Ethereum = 1,
  Ropsten = 3,
  Heco = 128,
  Hecotest = 256,
  Polygon = 137,
  Mumbai = 80001,
}

/**
 * Get Env
 * @param chainId Chain ID
 * @returns Env
 */
export const getEnv = (chainId: number): EnvType | undefined => {
  switch (chainId) {
    case ChainIDs.Ethereum:
      return;
    case ChainIDs.Ropsten:
      return;
    case ChainIDs.Heco:
      return HecoEnv;
    case ChainIDs.Hecotest:
      return HecoTestEnv;
    case ChainIDs.Polygon:
      return;
    case ChainIDs.Mumbai:
      return;
    default:
      return;
  }
};

/**
 * Get Env By Provider
 * @param provider Ethers provider
 * @returns Env config or undefined
 */
export const getEnvByProvider = async (provider: ethers.providers.Provider) => {
  const network = await provider.getNetwork();
  return getEnv(network.chainId);
};
