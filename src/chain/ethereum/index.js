import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'

async function createWeb3js(config = {}) {
    return await _getWeb3js(config.provider)
}

async function _getWeb3js(provider) {
    let web3Provider;

    if(provider) {
        return new Web3(provider);
    } else {
        const provider = await detectEthereumProvider()

        if (provider) {
            web3Provider = provider;
        } else {
            throw 'chain::ethereum: missing web3 provider'
        }
        return new Web3(web3Provider)
    }
}

export default {
    createWeb3js
}
