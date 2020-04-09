import {
    Env,
    getABIConfig
} from './env'
import {
    getContractMethodsParams
} from './env/abi'
import ClientFetch from '../utils/clientFetch'
import BigNumber from 'bignumber.js'

import bancorABI from '../ethereum/env/abi/ethereum/abi-bancor'
import actionABI from '../ethereum/env/abi/ethereum/abi-auction'
import ringABI from './env/abi/tron/abi-ring'
import withdrawABI from '../ethereum/env/abi/ethereum/abi-withdraw'
import bankABI from '../ethereum/env/abi/ethereum/abi-bank'
import ktonABI from '../ethereum/env/abi/ethereum/abi-kton'
import landABI from '../ethereum/env/abi/ethereum/abi-land'
import lotteryABI from '../ethereum/env/abi/ethereum/abi-lottery'
import rolesUpdaterABI from '../ethereum/env/abi/ethereum/abi-rolesUpdater'
import landResourceABI from '../ethereum/env/abi/ethereum/abi-landResource'
import apostleAuctionABI from '../ethereum/env/abi/ethereum/abi-apostleAuction'
import apostleTakeBackABI from '../ethereum/env/abi/ethereum/abi-takeBack'
import apostleSiringABI from '../ethereum/env/abi/ethereum/abi-apostleSiring'
import apostleBaseABI from '../ethereum/env/abi/ethereum/abi-apostleBase'
import tokenUseABI from '../ethereum/env/abi/ethereum/abi-tokenUse'
import petBaseABI from '../ethereum/env/abi/ethereum/abi-petbase'
import uniswapExchangeABI from '../ethereum/env/abi/ethereum/abi-uniswapExchange'
import swapBridgeABI from '../ethereum/env/abi/ethereum/abi-swapBridge'

import Utils from '../utils/index'
const loop = function () {}

class TronEvolutionLand {
    constructor(tronweb, network) {
        this.version = '1.0.0'
        // this.methods = methods
        this._tronweb = tronweb
        this.env = Env(network)
        this.ABIs = getABIConfig(network)
        // this.clientFetch = new ClientFetch({baseUrl: this.env.ABI_DOMAIN, chainId: 60})
    }

    /**
     * get tronWeb instance default address
     * @param {string} type - "base58"(default) | "hex"
     * @returns {string} empty is undefined
     */
    getCurrentAccount(type = 'base58') {
        if (this._tronweb.defaultAddress && this._tronweb.defaultAddress[type]) {
            return this._tronweb.defaultAddress[type]
        }

        return undefined
    }

    // async triggerContract({methodName, abiKey, contractParams, sendParams}) {
    //     console.log(methodName, abiKey, contractParams, sendParams)

    //     let _contract = await this._tronweb.contract().at(this.ABIs[abiKey].address)
    //     // const _method = _contract[methodName].apply(this, contractParams)

    //     return _contract[methodName](...contractParams).send({
    //         feeLimit: this._tronweb.toSun(100),
    //         callValue: 0,
    //         shouldPollResponse: false,
    //         ...sendParams
    //     })
    // }

    /**
     * Interact with a contract.
     * @param {string} methodName - contract method name
     * @param {string} abiKey - If the contract exists in the configuration file, you can use the key in the configuration to get it directly.
     * @param {json} abiString - ethereum ABI json
     * @param contractParams - contract function with arguments
     * @param sendParams - web3js send() arguments
     * @param beforeFetch
     * @param transactionHashCallback
     * @param confirmationCallback
     * @param receiptCallback
     * @param errorCallback
     * @returns {Promise<PromiEvent<any>>}
     */
    async callContract({
        methodName,
        abiKey,
        abiString,
        contractParams = [],
    }, {
        beforeFetch = loop,
        errorCallback = loop
    } = {}) {
        try {
            beforeFetch && beforeFetch()
            let _abi = this.ABIs[abiKey];

            let _contract = await this._tronweb.contract().at(_abi.address)
            const _method = _contract.methods[methodName].apply(this, contractParams)
            const res = await _method.call()
            console.log('tron res:', res)
            return res;

        } catch (e) {
            console.error('triggerContract', e)
            errorCallback && errorCallback(e)
        }
    }

    /**
     * Interact with a contract.
     * @param {string} methodName - contract method name
     * @param {string} abiKey - If the contract exists in the configuration file, you can use the key in the configuration to get it directly.
     * @param {json} abiString - ethereum ABI json
     * @param contractParams - contract function with arguments
     * @param sendParams - web3js send() arguments
     * @param beforeFetch
     * @param transactionHashCallback
     * @param confirmationCallback
     * @param receiptCallback
     * @param errorCallback
     * @returns {Promise<PromiEvent<any>>}
     */
    async triggerContract({
        methodName,
        abiKey,
        abiString,
        contractParams = [],
        sendParams
    }, {
        beforeFetch = loop,
        transactionHashCallback = loop,
        confirmationCallback = loop,
        receiptCallback = loop,
        errorCallback = loop,
        payload = {}
    } = {}) {
        try {
            beforeFetch && beforeFetch()
            let _abi = this.ABIs[abiKey];
            // const {
            //     functionSelector,
            //     parameter
            // } = getContractMethodsParams(
            //     methodName,
            //     contractParams,
            //     abiString
            // );

            // this._tronweb.transactionBuilder.triggerSmartContract(
            //     _abi.address,
            //     functionSelector,
            //     this._tronweb.toSun(100),
            //     sendParams.value,
            //     parameter,
            //     this.getCurrentAccount('hex')
            // ).then(({ transaction }) => {

            // })

            let _contract = await this._tronweb.contract().at(_abi.address)
            const extendPayload = { ...payload, _contractAddress: _abi.address };
            const _method = _contract.methods[methodName].apply(this, contractParams)
            const res = _method.send({
                feeLimit: this._tronweb.toSun(100),
                callValue: 0,
                shouldPollResponse: false,
                ...sendParams
            })
            res.then((hash) => {
                transactionHashCallback && transactionHashCallback(hash, extendPayload)
                console.log('hash', hash)
            })
            console.log('tron res:', res)
            return res;

            // .on('transactionHash', (hash) => {
            //     transactionHashCallback && transactionHashCallback(hash)
            // })
            // .on('confirmation', (confirmationNumber, receipt) => {
            //     confirmationCallback && confirmationCallback(confirmationNumber, receipt)
            // })
            // .on('receipt', (receipt) => {
            //     receiptCallback && receiptCallback(receipt)
            // })
            // .on('error', (error) => {
            //     errorCallback && errorCallback(error)
            // })
        } catch (e) {
            console.error('triggerContract', e)
            let _abi = this.ABIs[abiKey];
            const extendPayload = { ...payload, _contractAddress: _abi.address };
            errorCallback && errorCallback(e, extendPayload)
        }
    }

    /**
     * Transfers value amount of tokens to address to
     * @param {string} value - amount of tokens
     * @param {string} to - receiving address
     * @param {string} symbol - symbol of token [ring, kton, gold, wood, water, fire, soil]
     * @param {*} callback
     */
    async tokenTransfer(value, to, symbol, callback = {}) {
        if (!to || to === "0x0000000000000000000000000000000000000000") return;
        let abiString = ''
        if (symbol === 'kton') {
            abiString = ktonABI
        } else {
            abiString = ringABI
        }
        return this.triggerContract({
            methodName: 'transfer',
            abiKey: symbol,
            abiString: abiString,
            contractParams: [to, value],
        }, callback)
    }


    /**
     * Claim land asset
     * @param tokenId - Land tokenId
     * @returns {Promise<PromiEvent<any>>}
     */
    claimLandAsset(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'claimLandAsset',
            abiKey: 'auction',
            abiString: actionABI,
            contractParams: ['0x' + tokenId],
        }, callback)
    }

    /**
     * Sell land asset
     * @param tokenId - Land tokenId
     * @param start - start price
     * @param end - end price
     * @param duration - bid duration time in second
     * @returns {Promise<PromiEvent<any>>}
     */
    async setLandPrice(tokenId, start, end, duration, callback = {}) {
        const from = this.getCurrentAccount('hex')
        const _from = Utils.padLeft(from.slice(2), 64, '0')
        const _start = Utils.toHexAndPadLeft(start).slice(2)
        const _end = Utils.toHexAndPadLeft(end).slice(2)
        const _duration = Utils.toHexAndPadLeft(duration).slice(2)
        const data = `0x${_start}${_end}${_duration}${_from}`
        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [this.ABIs['auction'].address, '0x' + tokenId, data],
        }, callback)
    }

    /**
     * Bid Land Assets with Ring token.
     * @param amount - bid price with ring token
     * @param tokenId - tokenid of land
     * @param referrer - Referrer address
     * @returns {Promise<PromiEvent<any>>}
     */
    buyLandContract(amount, tokenId, referrer, callback = {}) {
        const finalReferrer = referrer
        const data =
            finalReferrer && this._tronweb.isAddress(finalReferrer) ?
            `0x${tokenId}${Utils.padLeft(this._tronweb.address.toHex(finalReferrer).substring(2), 64, '0')}` :
            `0x${tokenId}`
        return this.triggerContract({
            methodName: 'transferAndFallback',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['auction'].address, amount, data],
        }, callback)
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
    // withdrawRing({
    //     nonce,
    //     value,
    //     hash,
    //     v,
    //     r,
    //     s
    // }, callback = {}) {
    //     return this.triggerContract({
    //         methodName: "takeBack",
    //         abiString: withdrawABI,
    //         params: [nonce, value, hash, v, r, s],
    //         abiKey: "withdraw",
    //     }, callback);
    // }

    /**
     *  Cancel the Land being auctioned.
     * @param {string} tokenId - tokenid of land
     * @returns {Promise<PromiEvent<any>>}
     */
    cancelAuction(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: "cancelAuction",
            abiString: actionABI,
            contractParams: ['0x' + tokenId],
            abiKey: "auction",
        }, callback);
    }

    /**
     * Lock ring token to get Kton token
     * @param amount - ring amount
     * @param month - Locking time(unit: month)
     * @returns {Promise<PromiEvent<any>>}
     */
    saveRing(amount, month, callback = {}) {
        return this.triggerContract({
            methodName: 'transferAndFallback',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['bank'].address, amount, Utils.toTwosComplement(month)],
        }, callback)
    }

    /**
     * Redemption of unexpired ring.
     * @param amount - penalty Kton amount
     * @param id - deposit ID
     * @returns {Promise<PromiEvent<any>>}
     */
    redeemRing(amount, id, callback = {}) {
        return this.triggerContract({
            methodName: 'transferAndFallback',
            abiKey: 'kton',
            abiString: ktonABI,
            contractParams: [this.ABIs['bank'].address, amount, Utils.toTwosComplement(id)],
        }, callback)
    }

    /**
     * Redemption ring without penalty kton
     * @param id - deposit ID
     * @returns {Promise<PromiEvent<any>>}
     */
    withdrawBankRing(id, callback = {}) {
        return this.triggerContract({
            methodName: 'claimDeposit',
            abiKey: 'bank',
            abiString: bankABI,
            contractParams: [Utils.toTwosComplement(id)],
        }, callback)
    }


    /**
     * Play a ticket game
     * @param type - ['small':playWithSmallTicket , 'large': playWithLargeTicket]
     * @returns {Promise<PromiEvent<any>>}
     */
    lotteryFromPoint(type = "small", callback = {}) {
        return this.triggerContract({
            methodName: type === "small" ? "playWithSmallTicket" : "playWithLargeTicket",
            abiKey: 'lottery',
            abiString: lotteryABI,
            contractParams: [],
        }, callback)
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
    updateTesterRole(_nonce, _testerCodeHash, _hashmessage, _v, _r, _s, callback = {}) {
        return this.triggerContract({
            methodName: 'updateTesterRole',
            abiKey: 'rolesUpdater',
            abiString: rolesUpdaterABI,
            contractParams: [_nonce, _testerCodeHash, _hashmessage, _v, _r, _s],
        }, callback)
    }

    /**
     * create a red package
     * @param amount - amount of red package
     * @param number - number of received
     * @param packetId - packet ID
     * @returns {Promise<PromiEvent<any>>}
     */
    createRedPackageContract(amount, number, packetId, callback = {}) {
        const model = 0;

        const _data = `0x${Utils.toHexAndPadLeft(number).slice(2)}${Utils.toHexAndPadLeft(model).slice(2)}${Utils.toHexAndPadLeft(packetId).slice(2)}`
        return this.triggerContract({
            methodName: 'transferAndFallback',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['redPackage'].address, amount, _data],
        }, callback)
    }

    /**
     * tansfer the Land
     * @param {address} from - sender address
     * @param {address} to - receiver
     * @param {string} tokenId - Land token ID
     * @returns {*}
     */
    async transferFromLand(to, tokenId, callback = {}) {
        if (!to) {
            return null
        }
        const from = this.getCurrentAccount()
        return this.triggerContract({
            methodName: 'transferFrom',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [from, this._tronweb.address.toHex(to), '0x' + tokenId],
        }, callback)
    }

    /**
     *  claim resource on the Land
     * @param tokenId
     * @returns {Promise<PromiEvent<any>>}
     */
    resourceClaim(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'claimAllResource',
            abiKey: 'apostleLandResource',
            abiString: landResourceABI,
            contractParams: ['0x' + tokenId],
        }, callback)
    }

    /**
     * Bid apostle by RING token
     * @param amount - RING amount
     * @param tokenId - Apostle token ID
     * @param referrer - refer address
     * @returns {Promise<PromiEvent<any>>}
     */
    apostleBid(amount, tokenId, referrer, callback = {}) {
        const finalReferrer = referrer
        const data =
            finalReferrer && Utils.isAddress(finalReferrer) ?
            `0x${tokenId}${Utils.padLeft(finalReferrer.substring(2), 64, '0')}` :
            `0x${tokenId}`

        return this.triggerContract({
            methodName: 'transferAndFallback',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['apostleBid'].address, amount, data],
        }, callback)
    }

    /**
     * Receive apostle
     * @param tokenId - Apostle Token ID
     * @returns {Promise<PromiEvent<any>>}
     */
    apostleClaim(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'claimApostleAsset',
            abiKey: 'apostleAuction',
            abiString: apostleAuctionABI,
            contractParams: ['0x' + tokenId],
        }, callback)
    }

    /**
     * Sell apostle
     * @param tokenId - Apostle Token ID
     * @param start - auction start price
     * @param end - auction end price
     * @param duration - duration time
     * @returns {Promise<PromiEvent<any>>}
     */
    async apostleSell(tokenId, start, end, duration, callback = {}) {
        const from = this.getCurrentAccount('hex')
        const _from = Utils.padLeft(from.slice(2), 64, '0')
        const _start = Utils.toHexAndPadLeft(start).slice(2)
        const _end = Utils.toHexAndPadLeft(end).slice(2)
        const _duration = Utils.toHexAndPadLeft(duration).slice(2)
        const data = `0x${_start}${_end}${_duration}${_from}`
        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [this.ABIs['apostleSell'].address, '0x' + tokenId, data],
        }, callback)
    }

    /**
     * Cancel the auction by apostle token ID
     * @param tokenId - apostle token ID
     * @returns {Promise<PromiEvent<any>>}
     */
    apostleCancelSell(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'cancelAuction',
            abiKey: 'apostleAuction',
            abiString: apostleAuctionABI,
            contractParams: ['0x' + tokenId],
        }, callback)
    }

    /**
     *
     * @param tokenId
     * @param nftData
     * @returns {Promise<PromiEvent<any>>}
     */
    apostleRewardClaim(tokenId, nftData, callback = {}) {
        return this.triggerContract({
            methodName: 'takeBackNFT',
            abiKey: 'apostleTakeBack',
            abiString: apostleTakeBackABI,
            contractParams: [
                nftData.nonce,
                '0x' + tokenId,
                this.ABIs['land'].address,
                nftData.expireTime,
                nftData.hash_text,
                nftData.v,
                nftData.r,
                nftData.s
            ],
        }, callback)
    }

    /**
     * Apostle reproduction in own
     * @param tokenId
     * @param targetTokenId
     * @param amount
     * @returns {Promise<PromiEvent<any>>}
     */
    apostleBreed(tokenId, targetTokenId, amount, callback = {}) {
        return this.triggerContract({
            methodName: 'transferAndFallback',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [
                this.ABIs["apostleBreed"].address,
                amount,
                `0x${tokenId}${targetTokenId}`
            ]
        }, callback)
    }

    /**
     * Apostle reproduction
     * @param tokenId
     * @param targetTokenId
     * @param amount
     */
    apostleBreedBid(tokenId, targetTokenId, amount, callback = {}) {
        return this.triggerContract({
            methodName: 'transferAndFallback',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [
                this.ABIs["apostleSiringAuction"].address,
                amount,
                `0x${tokenId}${targetTokenId}`
            ]
        }, callback)
    }

    /**
     * Apostle Breed Auction
     * @param tokenId - Apostle tokenId
     * @param start - start price
     * @param end - end price
     * @param duration - auction duration time
     * @returns {Promise<PromiEvent<any>>}
     */
    async apostleBreedAuction(tokenId, start, end, duration, callback = {}) {
        const from = this.getCurrentAccount('hex')
        const _from = Utils.padLeft(from.slice(2), 64, '0')
        const _start = Utils.toHexAndPadLeft(start).slice(2)
        const _end = Utils.toHexAndPadLeft(end).slice(2)
        const _duration = Utils.toHexAndPadLeft(duration).slice(2)
        const data = `0x${_start}${_end}${_duration}${_from}`
        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [this.ABIs['apostleSiringAuction'].address, '0x' + tokenId, data],
        }, callback)
    }


    /**
     * Cancel apostle breed auction
     * @param tokenId
     * @returns {Promise<PromiEvent<any>>}
     */
    apostleCancelBreedAuction(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'cancelAuction',
            abiKey: 'apostleSiringCancelAuction',
            abiString: apostleSiringABI,
            contractParams: [
                '0x' + tokenId
            ]
        }, callback)
    }

    /**
     * Transfer apostle
     * @param toAddress
     * @param tokenId
     * @returns {Promise<PromiEvent<any>>}
     */
    async apostleTransfer(toAddress, tokenId, callback = {}) {
        const from = this.getCurrentAccount('hex')

        return this.triggerContract({
            methodName: 'transferFrom',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [
                from, toAddress, '0x' + tokenId
            ]
        }, callback)
    }

    /**
     * Let apostle go to work
     * @param tokenId - Apostle tokenId
     * @param landTokenId - Land tokenId
     * @param element - ['gold', 'wood', 'water', 'fire' ,'soil']
     */
    apostleWork(tokenId, landTokenId, element, callback = {}) {
        const elementAddress = this.ABIs[element.toLowerCase() || 'token'].address
        return this.triggerContract({
            methodName: 'startMining',
            abiKey: 'apostleLandResource',
            abiString: landResourceABI,
            contractParams: [
                '0x' + tokenId, '0x' + landTokenId, elementAddress
            ]
        }, callback)
    }

    /**
     * Stop apostle mining
     * @param tokenId - Apostle tokenId
     */
    apostleStopWorking(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'stopMining',
            abiKey: 'apostleLandResource',
            abiString: landResourceABI,
            contractParams: [
                '0x' + tokenId
            ]
        }, callback)
    }

    /**
     * Claim an apostle that expires at work
     * @param tokenId - Apostle TokenId
     * @returns {Promise<PromiEvent<any>>}
     */
    apostleHireClaim(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'removeTokenUseAndActivity',
            abiKey: 'apostleTokenUse',
            abiString: tokenUseABI,
            contractParams: [
                '0x' + tokenId
            ]
        }, callback)
    }

    /**
     * Renting apostles to work
     * @param tokenId - Apostle TokenId
     * @param duration - Duration in second
     * @param price - Hire Price
     */
    apostleHire(tokenId, duration, price, callback = {}) {
        const address = this.ABIs['apostleLandResource'].address
        const _resourceAddress = Utils.padLeft(address.slice(2), 64, '0')
        const _price = Utils.toHexAndPadLeft(price).slice(2)
        const _duration = Utils.toHexAndPadLeft(duration).slice(2)
        const data = `0x${_duration}${_price}${_resourceAddress}`

        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [
                this.ABIs['apostleTokenUse'].address,
                '0x' + tokenId,
                data
            ]
        }, callback)
    }

    /**
     * Cancel an apostle on Renting
     * @param tokenId - Apostle tokenId
     */
    apostleCancelHire(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'cancelTokenUseOffer',
            abiKey: 'apostleTokenUse',
            abiString: tokenUseABI,
            contractParams: [
                '0x' + tokenId
            ]
        }, callback)
    }

    /**
     * Bid apostle on Renting
     * @param tokenId - Apostle tokenId
     * @param price - bid price
     */
    apostleHireBid(tokenId, price, callback = {}) {
        return this.triggerContract({
            methodName: 'transferAndFallback',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [
                this.ABIs['apostleTokenUse'].address,
                price,
                `0x${tokenId}`
            ]
        }, callback)
    }


    /**
     * Apostle Born without element
     * @param motherTokenId
     */
    apostleBorn(motherTokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'giveBirth',
            abiKey: 'apostleBase',
            abiString: apostleBaseABI,
            contractParams: [
                '0x' + motherTokenId,
                Utils.padLeft(0, 40, '0'),
                0
            ]
        }, callback)
    }


    /**
     * Apostle Born with element
     * @param motherTokenId
     * @param element
     * @param level
     * @param levelUnitPrice
     */
    apostleBornAndEnhance(
        motherTokenId,
        element,
        level,
        levelUnitPrice,
        callback = {}
    ) {
        return this.triggerContract({
            methodName: 'transferAndFallback',
            abiKey: element.toLowerCase(),
            abiString: ringABI,
            contractParams: [
                this.ABIs['apostleBase'].address,
                new BigNumber(level).times(new BigNumber(levelUnitPrice)).toFixed(),
                `0x${motherTokenId}${Utils.toHexAndPadLeft(level).slice(2)}`
            ]
        }, callback)
    }


    /**
     * Byzantine swap fee
     * @param {string} value amount of rings to be swaped
     * @param {*} callback 
     */
    async fetchByzantineSwapFee(value, callback = {}) {
        const result = await this.callContract({
            methodName: 'querySwapFeeForNow',
            abiKey: 'swapBridge',
            abiString: swapBridgeABI,
            contractParams: [value],
        }, callback)
        return result.toString()
    }

    /**
     * Byzantine ring transfer to Atlantis
     * @param {string} value amount of rings to be swaped
     * @param {string} value ethereum address
     * @param {*} callback 
     */
    async ByzantineSwapBridge(value, targetAddress, callback = {}) {
        if (!targetAddress) {
            throw Error('empty targetAddress')
        }

        const fee = await this.fetchByzantineSwapFee(value)
        const extraData = `${Utils.toHexAndPadLeft(value)}${Utils.toHexAndPadLeft(1).slice(2)}${Utils.padLeft(targetAddress.substring(2), 64, '0')}`
        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['swapBridge'].address, new BigNumber(fee).plus(new BigNumber(value)).toFixed(), extraData],
        }, callback)
    }
}

export default TronEvolutionLand