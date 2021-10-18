import {
    Env,
    getABIConfig
} from './env'
import {
    getContractMethodsParams
} from './env/abi'
import ClientFetch from '../utils/clientFetch'
import BigNumber from 'bignumber.js'

import actionABI from '../ethereum/env/abi/ethereum/abi-auction'
import ringABI from './env/abi/tron/abi-ring'
import withdrawABI from '../ethereum/env/abi/ethereum/abi-withdraw'
import bankABI from '../ethereum/env/abi/ethereum/abi-bank'
import ktonABI from './env/abi/tron/abi-kton'
import landABI from '../ethereum/env/abi/ethereum/abi-land'
import lotteryABI from '../ethereum/env/abi/ethereum/abi-lottery'
import rolesUpdaterABI from '../ethereum/env/abi/ethereum/abi-rolesUpdater'
import landResourceABI from '../ethereum/env/abi/ethereum/abi-landResource'
import apostleAuctionABI from '../ethereum/env/abi/ethereum/abi-apostleAuction'
import apostleTakeBackABI from '../ethereum/env/abi/ethereum/abi-takeBack'
import apostleSiringABI from '../ethereum/env/abi/ethereum/abi-apostleSiring'
import apostleBaseABI from '../ethereum/env/abi/ethereum/abi-apostleBase'
import tokenUseABI from '../ethereum/env/abi/ethereum/abi-tokenUse'
import swapBridgeABI from '../ethereum/env/abi/ethereum/abi-swapBridge'
import luckyBoxABI from '../ethereum/env/abi/ethereum/abi-luckyBag'
import justswapExchangeABI from '../tron/env/abi/tron/abi-justswapExchange'

import Utils from '../utils/index'

import FurnaceV1Api from '../api/furnace/indexV1'


const loop = function () { }

class TronEvolutionLand {
    constructor(tronweb, network, option = {}) {
        this.version = '1.0.0'
        // this.methods = methods
        this._tronweb = tronweb
        this.env = Env(network)
        this.ABIs = getABIConfig(network)
        this.option = {
            sign: true,
            address: null,
            ...option
        }
        this.ERC20TRANSFERMETHOD = 'transferAndFallback'
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
    //         value: 0,
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
            let contractAddress = this.getContractAddress(abiKey);

            let _contract = await this._tronweb.contract().at(contractAddress)
            const _method = _contract.methods[methodName].apply(this, contractParams)
            const res = await _method.call()

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
        forceABI = false,
        contractParams = [],
        sendParams = {},
        gasLimit
    }, {
        beforeFetch = loop,
        transactionHashCallback = loop,
        confirmationCallback = loop,
        receiptCallback = loop,
        errorCallback = loop,
        unSignedTx = loop,
        payload = {}
    } = {}) {
        try {
            beforeFetch && beforeFetch()
            let contractAddress = this.getContractAddress(abiKey);
            const extendPayload = { ...payload, _contractAddress: contractAddress };
            sendParams.callValue = sendParams.value;
            if (!this.option.sign) {
                const {
                    functionSelector,
                    parameter
                } = getContractMethodsParams(
                    methodName,
                    contractParams,
                    abiString
                );
                this._tronweb.transactionBuilder.triggerSmartContract(
                    _abi.address,
                    functionSelector,
                    gasLimit || this._tronweb.toSun(100),
                    sendParams.value || 0,
                    parameter,
                    this.getCurrentAccount('hex')
                ).then(({ transaction }) => {
                    unSignedTx && unSignedTx(transaction, extendPayload)
                })
                return;
            }
            let _contract = null;

            if(forceABI) {
                _contract = await this._tronweb.contract(abiString, contractAddress)
            } else {
                _contract = await this._tronweb.contract().at(contractAddress)
            }
            const _method = _contract.methods[methodName].apply(this, contractParams)
            const res = _method.send({
                feeLimit: gasLimit || this._tronweb.toSun(100),
                callValue: 0,
                shouldPollResponse: false,
                ...sendParams
            })
            res.then((hash) => {
                transactionHashCallback && transactionHashCallback(hash, extendPayload)
                console.log('hash', hash)
            }).catch((e) => {
                const extendPayload = { ...payload, _contractAddress: contractAddress };
                errorCallback && errorCallback(e, extendPayload)
            })

            return res;
        } catch (e) {
            console.error('triggerContract', e)
            let _abi = this.ABIs[abiKey];
            let contractAddress = this.getContractAddress(abiKey);
            const extendPayload = { ...payload, _contractAddress: contractAddress };
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
    withdrawRing({
        nonce,
        value,
        hash,
        v,
        r,
        s
    }, callback = {}) {
        return this.triggerContract({
            methodName: "takeBack",
            abiString: withdrawABI,
            contractParams: [nonce, value, hash, v, r, s],
            abiKey: "withdraw",
        }, callback);
    }

    /**
     *  Withdraw kton from the channel
     * @param nonce
     * @param value
     * @param hash
     * @param v
     * @param r
     * @param s
     * @returns {Promise<PromiEvent<any>>}
     */
    withdrawKton({
        nonce,
        value,
        hash,
        v,
        r,
        s
    }, callback = {}) {
        return this.triggerContract({
            methodName: "takeBack",
            abiString: withdrawABI,
            contractParams: [nonce, value, hash, v, r, s],
            abiKey: "withdrawKton",
        }, callback);
    }

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
     * Get the contract address of evolution land by key.
     * @param {*} tokenKey ring | kton | gold ... 
     */
    getContractAddress(tokenKey) {
        let token = (this.ABIs[tokenKey] && this.ABIs[tokenKey].address) || tokenKey;
        return token;
    }

    /**
     * Query if an address is an authorized operator for another address
     * @param {*} owner The address that owns the NFTs
     * @param {*} operator The address that acts on behalf of the owner
     * @param {*} contractAddress ERC721 contract address
     */
    erc721IsApprovedForAll(owner, operator, contractAddress, callback={}) {
        return this.callContract({
            methodName: 'isApprovedForAll',
            abiKey: contractAddress,
            contractParams: [owner, operator],
        }, callback)
    }

    /**
     * Returns whether `spender` is allowed to manage `tokenId`.
     * @param {*} spender The address that acts on behalf of the owner
     * @param {*} contractAddress The factory of tokenId.
     * @param {*} tokenId ERC721 token Id;
     */
    async erc721IsApprovedOrOwner(spender, contractAddress, tokenId) {
        const owner = await this.callContract({
            methodName: 'ownerOf',
            abiKey: contractAddress,
            contractParams: [tokenId],
        });

        const approvedAddress = await this.callContract({
            methodName: 'getApproved',
            abiKey: contractAddress,
            contractParams: [tokenId],
        });
        const isApprovedForAll = await this.erc721IsApprovedForAll(owner, spender, contractAddress);

        return (owner.toLowerCase() === spender.toLowerCase() || approvedAddress.toLowerCase() === spender.toLowerCase() || isApprovedForAll);
    }

    /**
     * 
     * @param {*} owner 
     * @param {*} operator 
     * @param {*} contractAddress 
     * @param {*} callback 
     */    
    erc721IsApprovedForAll(owner, operator, contractAddress, callback={}) {
        return this.callContract({
            methodName: 'isApprovedForAll',
            abiKey: contractAddress,
            contractParams: [owner, operator],
        }, callback)
    }

    /**
     * Change or reaffirm the approved address for an NFT
     * @param {*} to The new approved NFT controller
     * @param {*} tokenId The NFT to approve
     */
    async erc721Approve(to, tokenId, contractAddress, callback={}) {
        return this.triggerContract({
            methodName: 'approve',
            abiKey: contractAddress,
            contractParams: [to, tokenId],
        }, callback)
    }

    /**
     * Enable or disable approval for a third party ("operator") to manage
     * @param {*} to Address to add to the set of authorized operators
     * @param {*} approved True if the operator is approved, false to revoke approval
     * @param {*} contractAddress ERC721 contract address
     * @param {*} callback 
     */
    async erc721SetApprovalForAll(to, approved, contractAddress, callback={}) {
        return this.triggerContract({
            methodName: 'setApprovalForAll',
            abiKey: contractAddress,
            contractParams: [to, approved],
        }, callback)
    }

    /**
     * Byzantine swap fee
     * @param {string} value amount of rings to be swaped
     * @param {*} callback 
     */
    async fetchByzantineSwapFee(value, callback = {}) {
        const result = await this.callContract({
            methodName: 'querySwapFee',
            abiKey: 'swapBridge',
            abiString: swapBridgeABI,
            contractParams: [value],
        }, callback)
        return result.toString()
    }

    getSimpleBridgeStatus(callback = {}) {
        return this.callContract({
            methodName: 'paused',
            abiKey: 'swapBridge',
            abiString: swapBridgeABI,
            contractParams: [],
        }, callback)
    }

    /**
     * Byzantine ring transfer to Atlantis
     * @param {string} value amount of rings to be swaped
     * @param {string} value ethereum address
     * @param {*} callback 
     */
    async ByzantineSwapBridge(value, targetAddress, symbol = 'ring', callback = {}) {
        if (!targetAddress) {
            throw Error('empty targetAddress')
        }

        const fee = await this.fetchByzantineSwapFee(value)
        const extraData = `${Utils.toHexAndPadLeft(value)}${Utils.toHexAndPadLeft(1).slice(2)}${Utils.padLeft(targetAddress.substring(2), 64, '0')}`
        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: symbol.toLowerCase(),
            abiString: ringABI,
            contractParams: [this.ABIs['swapBridge'].address, new BigNumber(fee).plus(1).plus(new BigNumber(value)).toFixed(0), extraData],
        }, callback)
    }

    /**
     * buy lucky box
     * @param {*} buyer - Receiver
     * @param {*} goldBoxAmount - gold box amount
     * @param {*} silverBoxAmount - silver box amount
     */
    async buyLuckyBox(buyer, goldBoxAmount, silverBoxAmount, callback) {
        const luckyBoxInfo = await this.getLuckyBoxInfo()
        const cost = Utils.toBN(luckyBoxInfo[0]).muln(goldBoxAmount).add(Utils.toBN(luckyBoxInfo[1]).muln(silverBoxAmount))
        return this.triggerContract({
            methodName: 'buyBoxs',
            abiKey: 'luckybag',
            abiString: luckyBoxABI,
            contractParams: [buyer, goldBoxAmount, silverBoxAmount],
            sendParams: {
                value: cost
            }
        }, callback)
    }

    /**
     * lucky box information
     * @returns {Array} - promise -> [goldBoxPrice, silverBoxPrice, goldBoxAmountForSale, silverBoxAmountForSale, goldSaleLimit, silverSaleLimit]
     */
    async getLuckyBoxInfo() {
        const _contract = await this._tronweb.contract().at(this.ABIs['luckybag'].address)
        const result = await Promise.all([
            _contract.methods.goldBoxPrice().call(),
            _contract.methods.silverBoxPrice().call(),
            _contract.methods.goldBoxAmountForSale().call(),
            _contract.methods.silverBoxAmountForSale().call(),
            _contract.methods.goldSaleLimit().call(),
            _contract.methods.silverSaleLimit().call(),
        ])

        return result.map((item) => {
            return item.toString()
        })
    }

    /**
     * Number of lucky box already purchased at this address
     * @param {*} address - buyer
     * @returns {Array} - promise -> [goldSalesRecord, silverSalesRecord]
     */
    async getLuckyBoxSalesRecord(address) {
        const _contract = await this._tronweb.contract().at(this.ABIs['luckybag'].address)
        const result = await Promise.all([
            _contract.methods.goldSalesRecord(address).call(),
            _contract.methods.silverSalesRecord(address).call(),
        ])

        return result.map((item) => {
            return item.toString()
        })
    }

    /**
    * Tron Function, Approve Ring to Justswap Exchange
    * @param {*} callback 
    */
    async approveRingToJustswap(callback = {}) {
        return this.triggerContract({
            methodName: 'approve',
            abiKey: 'ring',
            contractParams: [this.ABIs['justswapExchange'].address, '20000000000000000000000000'],
        }, callback)
    }

    /**
     * Allows spender to withdraw from your account multiple times, up to the value amount. If this function is called again it overwrites the current allowance with value.
     * @param {*} tokenContractOrType Erc20 token contract address
     * @param {*} spender
     * @param {*} value
     * @param {*} callback 
     */
    async approveToken(tokenContractOrType, spender, value="0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", callback = {}) {
        if(!spender) {
            return;
        }

        return this.triggerContract({
            methodName: 'approve',
            abiKey: tokenContractOrType,
            contractParams: [spender, value],
        }, callback)
    }

    /**
     * Check if justswap has sufficient transfer authority
     * @param {*} amount 
     */
    async checkJustswapAllowance(amount) {
        const from = await this.getCurrentAccount('hex')

        const ringContract = await this._tronweb.contract().at(this.ABIs['ring'].address)
        const allowanceAmount = await ringContract.methods.allowance(from, this.ABIs['justswapExchange'].address).call()
        return !Utils.toBN(allowanceAmount).lt(Utils.toBN(amount || '1000000000000000000000000'))
    }

    /**
     * Check if spender has sufficient transfer authority
     * @param {*} amount 
     * @param {*} tokenAddressOrType,
     * @param {*} account
     * @param {*} spender
     */
    async checkTokenAllowance(amount, tokenAddressOrType, account, spender) {
        if(!amount || !tokenAddressOrType || !spender) {
            throw 'tron::checkTokenAllowance: missing param'
        }

        const from = account || await this.getCurrentAccount();
        const token = this.getContractAddress(tokenAddressOrType);
        const erc20Contract = await this._tronweb.contract().at(token);

        const allowanceAmount = await erc20Contract.methods.allowance(from, spender).call()

        return !Utils.toBN(allowanceAmount).lt(Utils.toBN(amount || '1000000000000000000000000'))
    }

    /**
     * get amount of ether in justswap exchange 
     */
    async getJustswapTrxBalance() {
        let tradeobj = await this._tronweb.trx.getAccount(
            this.ABIs['justswapExchange'].address,
        );

        return new BigNumber(tradeobj.balance).toString(10)
    }

    /**
     * get amount of ring in justswap exchange 
     */
    async getJustswapTokenBalance() {
        const ring = await this._tronweb.contract().at(this.ABIs['ring'].address)
        const balance = await ring.methods.balanceOf(this.ABIs['justswapExchange'].address).call()
        return balance?._isBigNumber ? balance.toString() : new BigNumber(balance).toString(10)
    }

    getOutputPrice(outputAmount, inputReserve, outputReserve) {
        const numerator = new BigNumber(inputReserve).times(outputAmount).times(1000);
        const denominator = new BigNumber(outputReserve).minus(outputAmount).times(997);
        return (numerator.div(denominator)).plus(1);
    }

    getInputPrice(inputAmount, inputReserve, outputReserve) {
        const input_amount_with_fee = new BigNumber(inputAmount).times(997);

        const numerator = input_amount_with_fee.times(outputReserve);
        const denominator = new BigNumber(inputReserve).times(1000).plus(input_amount_with_fee);
        return numerator.div(denominator);
    }

    /**
     * Trx will be cost to swap 1 Ring
     * @param {*} tokens_bought
     */
    async getTrxToTokenOutputPrice(tokens_bought = '1000000000000000000') {
        const amountInMax = this.getOutputPrice(tokens_bought, await this.getJustswapTrxBalance(), await this.getJustswapTokenBalance())
        return [
            new BigNumber(amountInMax.toString(10)).times('1000000000000000000').div(tokens_bought).toFixed(0),
            amountInMax.toString(10)
        ]
    }

    /**
     * Trx will be got to swap 1 Ring
     * @param {*} tokens_bought
     */
    async getTokenToTrxInputPrice(tokens_bought = '1000000000000000000') {
        const amountOutMin = this.getInputPrice(tokens_bought, await this.getJustswapTokenBalance(), await this.getJustswapTrxBalance())
        return [
            new BigNumber(amountOutMin.toString(10)).times('1000000000000000000').div(tokens_bought).toFixed(0),
            amountOutMin.toString(10)
        ]
    }

   /**
     * Swap Ether to Ring token - Powered by uniswap.
     * @param {string} value - amount for Ring， unit of measurement(wei)
     * @returns {Promise<PromiEvent<any>>}
     */
    async buyRingJustswap(value, callback = {}) {
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10 // 10 minutes from the current Unix time
        const [, amountInMax] = await this.getTrxToTokenOutputPrice(value);
        //  slippage
        const slippageAmountInMax = new BigNumber(amountInMax).times(1.005);

        return this.triggerContract({
            methodName: 'trxToTokenSwapOutput',
            abiKey: 'justswapExchange',
            abiString: justswapExchangeABI,
            forceABI: true,
            contractParams: [
                value,
                deadline
            ],
            sendParams: {
                value: slippageAmountInMax.toFixed(0)
            }
        }, callback)
    }

    /**
     * Swap Ether to Ring token - Powered by uniswap.
     * @param {string} value - amount for Ring， unit of measurement(wei)
     * @returns {Promise<PromiEvent<any>>}
     */
    async sellRingJustswap(value, callback = {}) {
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10 // 10 minutes from the current Unix time
        const [, amountOutMin] = await this.getTokenToTrxInputPrice(value);
        //  slippage
        const slippageAmountOutMin = new BigNumber(amountOutMin).times(0.995);
 
        return this.triggerContract({
            methodName: 'tokenToTrxSwapInput',
            abiKey: 'justswapExchange',
            abiString: justswapExchangeABI,
            forceABI: true,
            contractParams: [
                value,
                slippageAmountOutMin.toFixed(0),
                deadline
            ],
            sendParams: {
                value: 0
            }
        }, callback)
    }


    /**
     * 'RING', 'KTON', 'GOLD'..., '0xxxxx'
     * @param {*} token 
     */
    isEvolutionLandToken(token) {

        const tokenList = ['ring', 'kton', 'gold', 'wood', 'water', 'hoo', 'fire', 'soil',
            this.ABIs['ring'].address.toLowerCase(),
            this.ABIs['kton'].address.toLowerCase(),
            this.ABIs['gold'].address.toLowerCase(),
            this.ABIs['wood'].address.toLowerCase(),
            this.ABIs['water'].address.toLowerCase(),
            this.ABIs['fire'].address.toLowerCase(),
            this.ABIs['soil'].address.toLowerCase(),
        ];

        return tokenList.includes(token.toLowerCase());
    }

    /**
     * This function is used to join Gold Rust event through ETH/ERC20 Tokens
     * @param {*} eventId The event id which to join
     * @param {*} landId The land token id which to join
     * @param {*} amount The ring amount which to submit
     * @param {*} subAddr The dvm address for receiving the new land
     * @param {*} callback 
     */
    goldRushRaffleJoin(eventId, landTokenId, amount, subAddr, callback = {}) {
        return this.triggerContract({
            methodName: 'join',
            abiKey: 'goldRushRaffle',
            // abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId), amount, subAddr
            ]
        }, callback);
    }

    /**
     * This function is used to change the ring stake amount 
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to change
     * @param {*} amount The new submit ring amount 
     * @param {*} callback 
     */
    goldRushRaffleChangeAmount(eventId, landTokenId, amount, callback = {}) {
        return this.triggerContract({
            methodName: 'changeAmount',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId), amount,
            ]
        }, callback);
    }

    /**
     * This function is used to change the dvm address
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to change
     * @param {*} subAddr The new submit dvm address 
     * @param {*} callback 
     */
    goldRushRaffleChangeSubAddr(eventId, landTokenId, subAddr, callback = {}) {
        return this.triggerContract({
            methodName: 'changeSubAddr',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId), subAddr,
            ]
        }, callback);
    }

    /**
     * This function is used to change join info.
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to change
     * @param {*} amount The new submit amount 
     * @param {*} subAddr The new submit dvm address 
     * @param {*} callback 
     */
    goldRushRaffleChangeInfo(eventId, landTokenId, amount, subAddr, callback = {}) {
        return this.triggerContract({
            methodName: 'change',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId), amount, subAddr,
            ]
        }, callback);
    }

    /**
     * This function is used to exit Gold Rush event
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to exit
     * @param {*} callback 
     */
    goldRushRaffleExit(eventId, landTokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'exit',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId),
            ]
        }, callback);
    }

    /**
     * This function is used to redeem prize after lottery
     * 
     * _hashmessage = hash("${address(this)}${fromChainId}${toChainId}${eventId}${_landId}${_won}")
     * 
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to draw
     * @param {*} isWon Is winner
     * @param {*} toChainId The chainId for receiving network
     * @param {*} signature _v, _r, _s are from supervisor's signature on _hashmessage while the _hashmessage is signed by supervisor.
     * @param {*} callback 
     */
    goldRushRaffleDraw(eventId, landTokenId, isWon, {hashmessage, v, r, s}, callback = {}) {
        return this.triggerContract({
            methodName: 'draw',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId), isWon, hashmessage, v, r, s
            ]
        }, callback);
    }

    /**
     * check the land is valid
     * @param {*} landTokenId The land token id which to check
     */
    goldRushRaffleLandCheck(landTokenId, callback = {}) {
        return this.callContract({
            methodName: 'check',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                Utils.pad0x(landTokenId)
            ]
        }, callback);
    }

    /**
     * Get info of Raffle by eventId and landTokenId.
     * @param {*} eventId Gold Rush Event ID
     * @param {*} landTokenId The land token id which to query
     * @param {*} callback 
     */
    goldRushRaffleGetHistory(eventId, landTokenId, callback = {}) {
        return this.callContract({
            methodName: 'lands',
            abiKey: 'goldRushRaffle',
            contractParams: [
                eventId, Utils.pad0x(landTokenId)
            ]
        }, callback);
    }

    /**
     * Returns the amount of RING owned by account
     * @param {*} address 
     */
     getRingBalance(address, callback = {}) {
        return this.callContract({
            methodName: 'balanceOf',
            abiKey: 'ring',
            contractParams: [
                address
            ]
        }, callback);
    }

    /**
     * Returns the amount of KTON owned by account
     * @param {*} address 
     */
    getKtonBalance(address, callback = {}) {
        return this.callContract({
            methodName: 'balanceOf',
            abiKey: 'kton',
            contractParams: [
                address
            ]
        }, callback);
    }

    /**
     * Get native token balance
     * @param {*} address
     * @returns
     */
    getNativeBalance(address) {
        return this._tronweb.trx.getBalance(address);
    }

    /**
     * Returns the amount of tokens owned by account
     * @param {*} account 
     * @param {*} contractAddress 
     */
    getTokenBalance(account, contractAddress, callback = {}) {
        return this.callContract({
            methodName: 'balanceOf',
            abiKey: contractAddress,
            contractParams: [
                account
            ]
        }, callback);
    }

    /**
     * Get total supply of erc20 token
     * @param {*} contractAddress Erc20 contract address
     */
    getTokenTotalSupply(contractAddress, callback = {}) {
        return this.callContract({
            methodName: 'totalSupply',
            abiKey: contractAddress,
            contractParams: []
        }, callback);
    }
    
}

Object.assign(TronEvolutionLand.prototype, FurnaceV1Api);

export default TronEvolutionLand