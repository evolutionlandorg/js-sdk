import Web3 from "web3";
import tronweb from 'tronweb'

function toHexAndPadLeft(o) {
    return Web3.utils.padLeft(Web3.utils.toHex(o), 64, '0')
}

function decodeBase58Address(base58Sting) {
   return tronweb.address.toHex(base58Sting)
}

function pad0x(str) {
    if(str.substring(0, 2) === '0x') {
        return str;
    }

    return '0x' + str;
}

export default {
    toHexAndPadLeft,
    decodeBase58Address,
    pad0x,
    ...Web3.utils,
}
