import {Env, getABIConfig} from './env'
import ClientFetch from '../utils/clientFetch'
import bancorABI from './env/abi/ethereum/abi-bancor'
import actionABI from './env/abi/ethereum/abi-auction'
import ringABI from './env/abi/ethereum/abi-ring'
import withdrawABI from './env/abi/ethereum/abi-withdraw'
import bankABI from './env/abi/ethereum/abi-bank'
import ktonABI from './env/abi/ethereum/abi-kton'
import landABI from './env/abi/ethereum/abi-land'
import lotteryABI from './env/abi/ethereum/abi-lottery'
import rolesUpdaterABI from './env/abi/ethereum/abi-rolesUpdater'
import landResourceABI from './env/abi/ethereum/abi-landResource'
import Utils from '../utils/index'

/**
 * @class
 * Evolution Land for Ethereum
 */
class EthereumEvolutionLand {
    /**
     * constructor function.
     * @param {object} web3js - web3js instance
     * @param {string} network
     */
    constructor(web3js, network) {
        this.version = '1.0.0'
        this._web3js = web3js
        this.env = Env(network)
        this.ABIs = getABIConfig(network)
        this.clientFetch = new ClientFetch({baseUrl: this.env.ABI_DOMAIN, chainId: 60})
    }

    /**
     * get web3js Current address.
     * @returns {Promise<any>}
     */
    getCurrentAccount() {
        return new Promise((resolve, reject) => {
            this._web3js.eth.getAccounts((error, accounts) => {
                if (error) {
                    reject(error)
                } else {
                    console.log('getCurrentAccount: ', accounts[0])
                    resolve(accounts[0])
                }
            })
        })
    }

    /**
     * Interact with a contract.
     * @param {string} methodName - contract method name
     * @param {string} abiKey - If the contract exists in the configuration file, you can use the key in the configuration to get it directly.
     * @param {json} abiString - ethereum ABI json
     * @param contractParams - contract function with arguments
     * @param sendParams - web3js send() arguments
     * @returns {Promise<PromiEvent<any>>}
     */
    async triggerContract({methodName, abiKey, abiString, contractParams = [], sendParams}) {
        let _contract = null
        if (abiString) {
            _contract = new this._web3js.eth.Contract(abiString, this.ABIs[abiKey].address);
        } else {
            const _abi = await this.clientFetch.$getAbi(this.ABIs[abiKey].api())
            _contract = new this._web3js.eth.Contract(_abi, this.ABIs[abiKey].address)
        }

        const _method = _contract.methods[methodName].apply(this, contractParams)

        return _method.send({
            from: await this.getCurrentAccount(),
            value: 0,
            ...sendParams
        })
    }

    /**
     * Buy ring token with Ether.
     * @param {string} value - amount for Ether， unit of measurement(wei)
     * @returns {Promise<PromiEvent<any>>}
     */
    buyRing(value) {
        return this.triggerContract({
            methodName: 'buyRING',
            abiKey: 'bancor',
            abiString: bancorABI,
            contractParams: [1],
            sendParams: {value: value}
        })
    }

    claimLandAsset(tokenId) {
        return this.triggerContract({
            methodName: 'claimLandAsset',
            abiKey: 'auction',
            abiString: actionABI,
            contractParams: [tokenId],
        })
    }

    /**
     * Bid Land Assets with Ring token.
     * @param amount - bid price with ring token
     * @param tokenId - tokenid of land
     * @param referrer - Referrer address
     * @returns {Promise<PromiEvent<any>>}
     */
    buyLandContract(amount, tokenId, referrer) {
        const finalReferrer = referrer
        const data =
            finalReferrer && Utils.isAddress(finalReferrer)
                ? `0x${tokenId}${Utils.padLeft(finalReferrer.substring(2), 64, '0')}`
                : `0x${tokenId}`

        return this.triggerContract({
            methodName: 'transfer',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['auction'].address, amount, data],
        })
    }

    /**
     * Bid Land Assets with Ether.
     * @param tokenId - tokenid of land
     * @param referer - Referrer address
     * @param value - bid price with ether
     * @returns {Promise<PromiEvent<any>>}
     */
    buyLandWithETHContract(tokenId, referer, value) {
        return this.triggerContract({
            methodName: "bidWithETH",
            abiString: actionABI,
            params: [tokenId, referer],
            abiKey: "auction",
            sendParams: {value: value}
        })
    }

    /**
     *  Withdraw ring from the channel
     * @param nonce
     * @param value
     * @param hash
     * @param v
     * @param r
     * @param s
     * @returns {Promise<PromiEvent<any>>}
     */
    withdrawRing({nonce, value, hash, v, r, s}) {
        return this.triggerContract({
            methodName: "takeBack",
            abiString: withdrawABI,
            params: [nonce, value, hash, v, r, s],
            abiKey: "withdraw",
        });
    }

    /**
     *  Cancel the Land being auctioned.
     * @param {string} tokenId - tokenid of land
     * @returns {Promise<PromiEvent<any>>}
     */
    cancelAuction(tokenId) {
        return this.triggerContract({
            methodName: "cancelAuction",
            abiString: actionABI,
            params: [tokenId],
            abiKey: "auction",
        });
    }

    /**
     * Convert Ring token to Ether via bancor exchange
     * @param amount - ring token amount
     * @returns {Promise<PromiEvent<any>>}
     */
    sellRing(amount) {
        return this.triggerContract({
            methodName: 'transfer',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['bancor'].address, amount, '0x0000000000000000000000000000000000000000000000000000000000000001'],
        })
    }

    /**
     * Lock ring token to get Kton token
     * @param amount - ring amount
     * @param month - Locking time(unit: month)
     * @returns {Promise<PromiEvent<any>>}
     */
    saveRing(amount, month) {
        return this.triggerContract({
            methodName: 'transfer',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['bank'].address, amount, Utils.toTwosComplement(month)],
        })
    }

    /**
     * Redemption of unexpired ring.
     * @param amount - penalty Kton amount
     * @param id - deposit ID
     * @returns {Promise<PromiEvent<any>>}
     */
    redeemRing(amount, id) {
        return this.triggerContract({
            methodName: 'transfer',
            abiKey: 'kton',
            abiString: ktonABI,
            contractParams: [this.ABIs['bank'].address, amount, Utils.toTwosComplement(id)],
        })
    }

    /**
     * Redemption ring without penalty kton
     * @param id - deposit ID
     * @returns {Promise<PromiEvent<any>>}
     */
    withdrawBankRing(id) {
        return this.triggerContract({
            methodName: 'claimDeposit',
            abiKey: 'bank',
            abiString: bankABI,
            contractParams: [Utils.toTwosComplement(id)],
        })
    }

    /**
     * Play a ticket game
     * @param type - ['small':playWithSmallTicket , 'large': playWithLargeTicket]
     * @returns {Promise<PromiEvent<any>>}
     */
    lotteryFromPoint(type = "small") {
        return this.triggerContract({
            methodName: type === "small" ? "playWithSmallTicket" : "playWithLargeTicket",
            abiKey: 'lottery',
            abiString: lotteryABI,
            contractParams: [],
        })
    }

    /**
     * Binding tester code
     * @param _nonce
     * @param _testerCodeHash
     * @param _hashmessage
     * @param _v
     * @param _r
     * @param _s
     * @returns {Promise<PromiEvent<any>>}
     */
    updateTesterRole(_nonce, _testerCodeHash, _hashmessage, _v, _r, _s) {
        return this.triggerContract({
            methodName: 'updateTesterRole',
            abiKey: 'rolesUpdater',
            abiString: rolesUpdaterABI,
            contractParams: [_nonce, _testerCodeHash, _hashmessage, _v, _r, _s],
        })
    }

    /**
     * create a red package
     * @param amount - amount of red package
     * @param number - number of received
     * @param packetId - packet ID
     * @returns {Promise<PromiEvent<any>>}
     */
    createRedPackageContract(amount, number, packetId) {
        const model = 0;

        function _toHexAndPadLeft(o) {
            return Utils.padLeft(Utils.toHex(o), 64, '0')
        }

        const _data = `0x${_toHexAndPadLeft(number)}${_toHexAndPadLeft(model)}${_toHexAndPadLeft(packetId)}`
        return this.triggerContract({
            methodName: 'transfer',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['redPackage'].address, amount, _data],
        })
    }

    /**
     * tansfer the Land
     * @param {address} from - sender address
     * @param {address} to - receiver
     * @param {string} tokenId - Land token ID
     * @returns {*}
     */
    transferFromLand(from, to, tokenId) {
        if (to) {
            return null
        }
        return this.triggerContract({
            methodName: 'transferFrom',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [from, to, tokenId],
        })
    }

    /**
     *  claim resource on the Land
     * @param tokenId
     * @returns {Promise<PromiEvent<any>>}
     */
    resourceClaim(tokenId) {
        return this.triggerContract({
            methodName: 'claimAllResource',
            abiKey: 'apostleLandResource',
            abiString: landResourceABI,
            contractParams: [tokenId],
        })
    }
}

export default EthereumEvolutionLand
