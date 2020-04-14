import Tronweb from "tronweb";

function createTronweb(config = {}) {
    let _tronweb = _getTronweb(config)
    if(config.address) {
        _tronweb.setAddress(config.address)
    }
    return _tronweb
}

function _getTronweb(config) {
    if(config && config.fullHost) {
        return new Tronweb(config)
    }

    if(window.tronWeb) {
        return window.tronWeb
    }
}

export default {
    createTronweb
}
