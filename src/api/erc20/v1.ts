import { ethers } from "ethers";
import type { CallbackType } from "@evo/utils/contractHelpers";
import { triggerContract, viewContract } from "@evo/utils/contractHelpers";

/**
 * ERC20 Allowance RING
 * @param provider Ethers provider
 * @param from From, account address
 * @param spender Spender
 * @param callback Callback
 * @returns String amount
 */
export const erc20AllowanceRING = async (
  provider: ethers.providers.Provider,
  from: string,
  spender: string,
  callback?: CallbackType
): Promise<string> => {
  const results = await viewContract(provider, "ring", "allowance", [from, spender], callback);
  return (results[0] as ethers.BigNumber).toString();
};

/**
 * ERC20 Approve RING
 * @param signer Ethers signer
 * @param spender Spender
 * @param value Value
 * @param callback Callback
 */
export const erc20ApproveRING = async (
  signer: ethers.Signer,
  spender: string,
  value = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  callback?: CallbackType
) => {
  await triggerContract(signer, "ring", "approve", [spender, value], callback);
};
