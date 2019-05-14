import {Env, getABIConfig} from './env'
import ClientFetch from '../utils/clientFetch'


import Utils from '../utils/index'

class TronEvolutionLand {
    constructor(tronweb, network) {
        this.version = '1.0.0'
        // this.methods = methods
        this._tronweb = tronweb
        this.env = Env(network)
        this.ABIs = getABIConfig(network)
        this.clientFetch = new ClientFetch({baseUrl: this.env.ABI_DOMAIN, chainId: 60})
    }

    getCurrentAccount() {
        return new Promise((resolve, reject) => {
            this._tronweb.eth.getAccounts((error, accounts) => {
                if (error) {
                    reject(error)
                } else {
                    console.log('getCurrentAccount: ', accounts[0])
                    resolve(accounts[0])
                }
            })
        })
    }

    async triggerContract({methodName, abiKey, contractParams, sendParams}) {
        console.log(methodName, abiKey, contractParams, sendParams)
        let _contract = await this._tronweb.contract().at(this.ABIs[abiKey].address)
        const _method = _contract[methodName].apply(this, contractParams)
        return _method.send({
            feeLimit: this._tronweb.toSun(100),
            callValue: 0,
            // shouldPollResponse: true,
            ...sendParams
        })
    }

    buyRing(value) {
        return this.triggerContract({
            methodName: 'buyRING',
            abiKey: 'bancor',
            contractParams: [1],
            sendParams: {callValue: value}
        })
    }

    claimLandAsset(tokenId) {
        return this.triggerContract({
            methodName: 'claimLandAsset',
            abiKey: 'auction',
            contractParams: [tokenId],
            sendParams: {callValue: 0}
        })
    }

    buyLandContract(amount, tokenId, referrer) {
        const finalReferrer = referrer
        const data =
            finalReferrer && Utils.isAddress(finalReferrer)
                ? `0x${tokenId}${Utils.padLeft(finalReferrer.substring(2), 64, '0')}`
                : `0x${tokenId}`

        return this.triggerContract({
            methodName: 'transferAndFallback',
            abiKey: 'ring',
            contractParams: [this.ABIs['auction'].address, amount, data],
            sendParams: {callValue: 0}
        })
    }
}

export default TronEvolutionLand
