import dev from "./dev";
import prod from "./prod"
import { getABI } from '../../abi'

export function Env(env) {
    switch (env) {
        case 'crabtestnet':
            return dev;
        case 'main':
            return prod;
        default:
            return;
    }
}

export function getABIConfig(env){
    const envConfig = Env(env);
    return getABI(envConfig);
}