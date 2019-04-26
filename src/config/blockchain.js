import isNumber from "lodash/isNumber";

const BLOCK_CHAINS = [
  {
    fullName: "ethereum", // 以太坊
    name: "eth",
    index: 1
  },
  {
    fullName: "tron", // 波场
    name: "tron",
    index: 2
  }
];

// 当前的公链
export const getCurrentBlockChain = (currentIndex = 1) => {
  if (!isNumber(currentIndex) || currentIndex > BLOCK_CHAINS.length)
    throw new Error("error param");
  const currentItem = BLOCK_CHAINS.filter(v => v.index === +currentIndex);
  return currentItem.length ? currentItem[0] : false;
};

export default BLOCK_CHAINS;
