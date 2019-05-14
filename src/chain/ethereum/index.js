import Web3 from "web3";

function createWeb3js(config = {}) {
    return _getWeb3js(config.provider)
}

function _getWeb3js(provider) {

    const web3js = new Web3(provider);
    return web3js
}

export default {
    createWeb3js
}
