import Web3 from "web3";

function toHexAndPadLeft(o) {
    return Web3.utils.padLeft(Web3.utils.toHex(o), 64, '0')
}

export default {
    toHexAndPadLeft,
    ...Web3.utils
}
