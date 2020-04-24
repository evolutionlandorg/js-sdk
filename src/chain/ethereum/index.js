import Web3 from "web3";

async function createWeb3js(config = {}) {
    return await _getWeb3js(config.provider)
}

async function _getWeb3js(provider) {
    let web3Provider;

    if(provider) {
        return new Web3(provider);
    } else {
        if (window.ethereum) {
            web3Provider = window.ethereum;
            // try {
            //     await window.ethereum.enable();
            // } catch (error) {
            //     console.error("User denied account access")
            // }
        } else if (window.web3) {
            web3Provider = window.web3.currentProvider;
        }
        return new Web3(web3Provider)
    }
}

export default {
    createWeb3js
}
