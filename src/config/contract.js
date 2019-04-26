import { CONF_CONTRACT_STATUS_MAIN } from "./index";
import { getCurrentBlockChain } from "./blockchain";

const CONTRACTS = {
  main: {
    ethereum: {
      /**
       * web3节点
       */
      CONF_PROVIDER: 'http://mainnet.infura.io/v3/' + process.env.WEB3_PROVIDER_KEY,

      // web3 网址
      CONF_SCAN_URL: "https://etherscan.io/",
      CONF_SCAN_TRANSACTION: "https://etherscan.io/tx",
      CONF_SCAN_ADDRESS: "https://etherscan.io/address",

      // web3 网络
      CONF_NETWORK: "1",
      // 扫描返回
      CONF_ITERING_CALLBACK:
        "https://www.evolution.land/api/eth/raw_sign_broadcast"
    },
    tron: {
      // 合约
      CONF_TOKEN_RING: "416e0d26adf5323f5b82d5714354dc3c6870adee7c",

      CONF_PROVIDER: "https://api.trongrid.io",
      CONF_SCAN_URL: "https://tronscan.org/#/",
      CONF_SCAN_TRANSACTION: "https://tronscan.org/#/transaction",
      CONF_SCAN_ADDRESS: "https://tronscan.org/#/address",
      CONF_NETWORK: "https://api.trongrid.io",
      CONF_NETWORK_NODE: "11111",
      // 扫描返回
      CONF_ITERING_CALLBACK:
        "https://www.evolution.land/api/tron/raw_sign_broadcast"
    }
  },
  test: {
    ethereum: {
      /**
       * web3节点
       */
      CONF_PROVIDER: `https://kovan.infura.io/v3/` + process.env.WEB3_PROVIDER_KEY,

      // web3 网址
      CONF_SCAN_URL: "https://kovan.etherscan.io/",
      CONF_SCAN_TRANSACTION: "https://kovan.etherscan.io/tx",
      CONF_SCAN_ADDRESS: "https://kovan.etherscan.io/address",
      // web3 网络
      CONF_NETWORK: "42",
      // 扫描返回
      CONF_ITERING_CALLBACK:
        "https://alpha.evolution.land/api/eth/raw_sign_broadcast"
    },
    tron: {
      // 合约
      CONF_TOKEN_RING: "4181f0f3891cb32d1af69a6c853aefa6cf80f270b5",

      CONF_PROVIDER: "https://api.shasta.trongrid.io",

      CONF_SCAN_URL: "https://shasta.tronscan.org/#/",
      CONF_SCAN_TRANSACTION: "https://shasta.tronscan.org/#/transaction",
      CONF_SCAN_ADDRESS: "https://shasta.tronscan.org/#/address",

      CONF_NETWORK: "https://api.shasta.trongrid.io",
      CONF_NETWORK_NODE: "1",

      // 扫描返回
      CONF_ITERING_CALLBACK:
        "https://alpha.evolution.land/api/tron/raw_sign_broadcast"
    }
  }
};

// 当前的区块链
export const getCurrentContract = (
  status = CONF_CONTRACT_STATUS_MAIN,
  currentBlockChainIndex = 1
) => {
  const currentBlockChain = getCurrentBlockChain(currentBlockChainIndex);
  return currentBlockChain
    ? CONTRACTS[status][currentBlockChain.fullName]
    : false;
};

export default CONTRACTS;
