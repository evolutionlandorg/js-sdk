import Web3 from "web3";
import tronweb from 'tronweb'

function toHexAndPadLeft(o) {
    return Web3.utils.padLeft(Web3.utils.toHex(o), 64, '0')
}

function decodeBase58Address(base58Sting) {
   return tronweb.address.toHex(base58Sting)
}

export default {
    toHexAndPadLeft,
    decodeBase58Address,
    ...Web3.utils
}
