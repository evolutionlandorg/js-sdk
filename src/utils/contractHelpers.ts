import { ethers } from "ethers";
import { getEnv } from "@evo/env/index";
import { getContractsAddressAndABI } from "@evo/abi/index";

export type ErrorCallbackType = (err: { error: unknown }) => void;
export type ResponseCallbackType = (response?: { transactionHash: string }) => void;
export type SuccessCallbackType = (receipt?: { transactionHash: string }) => void;

export type CallbackType = {
  errorCallback: ErrorCallbackType;
  responseCallback?: ResponseCallbackType;
  successCallback?: SuccessCallbackType;
};

const defaultCallback: CallbackType = {
  errorCallback: ({ error }) => {
    console.error(error);
  },
  // responseCallback: ({ transactionHash }) => { console.info(transactionHash) },
  // successCallback: ({ transactionHash }) => { console.info(transactionHash) },
};

export const triggerContract = async (
  signer: ethers.Signer,
  abiCfgKey: string,
  methodName: string,
  contractArgs: unknown[] = [],
  callback = defaultCallback
): Promise<undefined> => {
  const { errorCallback, responseCallback, successCallback } = callback;

  const network = await signer.provider?.getNetwork();
  if (!network) {
    errorCallback({ error: new Error(`trigger contract failed to get network. method: ${methodName}`) });
    return;
  }

  const env = getEnv(network.chainId);
  if (!env) {
    errorCallback({
      error: new Error(
        `trigger contract failed to get environment. chainid: ${network.chainId}, method: ${methodName}`
      ),
    });
    return;
  }

  const contractAddressABI = getContractsAddressAndABI(env)[abiCfgKey];
  if (!contractAddressABI || !contractAddressABI.address || !contractAddressABI.abi) {
    errorCallback({
      error: new Error(
        `trigger contract failed to get contract address or abi. abikey ${abiCfgKey}, chainid: ${network.chainId}, method: ${methodName}`
      ),
    });
    return;
  }

  try {
    const contract = new ethers.Contract(contractAddressABI.address, contractAddressABI.abi, signer);

    const response: ethers.providers.TransactionResponse = await contract[methodName](...contractArgs);
    responseCallback && responseCallback({ transactionHash: response.hash });

    const receipt: ethers.providers.TransactionReceipt = await response.wait(2);
    if (receipt.byzantium && receipt.status === 1) {
      successCallback && successCallback({ transactionHash: receipt.transactionHash });
    }
  } catch (err) {
    errorCallback({ error: err });
  }

  return;
};

export const viewContract = async (
  provider: ethers.providers.Provider,
  abiCfgKey: string,
  methodName: string,
  contractArgs: unknown[] = [],
  callback = defaultCallback
): Promise<ethers.utils.Result> => {
  const { errorCallback } = callback;

  const network = await provider.getNetwork();
  if (!network) {
    errorCallback({ error: new Error(`view contract failed to get network. method: ${methodName}`) });
    return [];
  }

  const env = getEnv(network.chainId);
  if (!env) {
    errorCallback({
      error: new Error(`view contract failed to get environment. chainid: ${network.chainId}, method: ${methodName}`),
    });
    return [];
  }

  const contractAddressABI = getContractsAddressAndABI(env)[abiCfgKey];
  if (!contractAddressABI || !contractAddressABI.address || !contractAddressABI.abi) {
    errorCallback({
      error: new Error(
        `view contract failed to get contract address or abi. abikey ${abiCfgKey}, chainid: ${network.chainId}, method: ${methodName}`
      ),
    });
    return [];
  }

  try {
    const contract = new ethers.Contract(contractAddressABI.address, contractAddressABI.abi, provider);
    return await contract.functions[methodName](...contractArgs);
  } catch (err) {
    errorCallback({ error: err });
  }

  return [];
};
