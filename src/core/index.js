// 用于合约操作
import { CONF_CONTRACT_STATUS_MAIN } from "../config";
import { getCurrentBlockChain } from "../config/blockchain";
import Ethereum from "./ethereum";
import Tron from "./tron";

export default ({
  status = CONF_CONTRACT_STATUS_MAIN,
  isIteringId = true,
  blockchain = 1,
  languge = "zh-CN"
}) => {
  const currentBlockChain = getCurrentBlockChain(blockchain);
  if (!currentBlockChain) {
    throw new Error("Maybe does not support the current chain");
  }

  const contracts = {
    eth: Ethereum,
    tron: Tron
  };

  const contract = new contracts[currentBlockChain.name]({
    status,
    isIteringId,
    blockchain,
    languge
  });

  contract.add0x = bytes => {
    if (!/^(0x)/i.test(bytes)) {
      return `0x${bytes}`;
    }
    return bytes;
  };

  /**
   * base58 transfer 16进制账号
   * 某些场景有用，跨境转账时
   */
  contract.toHexAddress = (
    address,
    targetBlockchain = currentBlockChain ? currentBlockChain.name : ""
  ) => {
    console.log(targetBlockchain);
    let hexAddress = address;
    switch (targetBlockchain) {
      case "tron":
        hexAddress = Tron.TronWeb.address.toHex(address);
        break;
      default:
        break;
    }
    return hexAddress;
  };

  return contract;
};
