import dev from "./dev";
import prod from "./prod"
import getABI from './abi'

export function Env(env) {
    switch (env) {
        case 'testnet':
            return dev;
        case 'main':
            return prod;
        default:
            return;
    }
}

export function getABIConfig(env){
    return getABI(env)
}
