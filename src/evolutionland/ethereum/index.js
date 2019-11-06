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
import apostleAuctionABI from './env/abi/ethereum/abi-apostleAuction'
import apostleTakeBackABI from './env/abi/ethereum/abi-takeBack'
import apostleSiringABI from './env/abi/ethereum/abi-apostleSiring'
import apostleBaseABI from './env/abi/ethereum/abi-apostleBase'
import tokenUseABI from './env/abi/ethereum/abi-tokenUse'
import petBaseABI from './env/abi/ethereum/abi-petbase'
import Utils from '../utils/index'

const loop = function () {
}

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
        this.ABIClientFetch = new ClientFetch({baseUrl: this.env.ABI_DOMAIN, chainId: 60})
        this.ClientFetch = new ClientFetch({baseUrl: this.env.DOMAIN, chainId: 60})
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
     * @param beforeFetch
     * @param transactionHashCallback
     * @param confirmationCallback
     * @param receiptCallback
     * @param errorCallback
     * @returns {Promise<PromiEvent<any>>}
     */
    async triggerContract({methodName, abiKey, abiString, contractParams = [], sendParams},
                          {
                              beforeFetch = loop,
                              transactionHashCallback = loop,
                              confirmationCallback = loop,
                              receiptCallback = loop,
                              errorCallback = loop
                          } = {}
    ) {
        try {
            beforeFetch && beforeFetch()

            let _contract = null
            if (abiString) {
                _contract = new this._web3js.eth.Contract(abiString, this.ABIs[abiKey].address);
            } else {
                const _abi = await this.ABIClientFetch.$getAbi(this.ABIs[abiKey].api())
                _contract = new this._web3js.eth.Contract(_abi, this.ABIs[abiKey].address)
            }

            const _method = _contract.methods[methodName].apply(this, contractParams)
            return _method.send({
                from: await this.getCurrentAccount(),
                value: 0,
                ...sendParams
            })
                .on('transactionHash', (hash) => {
                    transactionHashCallback && transactionHashCallback(hash)
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    confirmationCallback && confirmationCallback(confirmationNumber, receipt)
                })
                .on('receipt', (receipt) => {
                    receiptCallback && receiptCallback(receipt)
                })
                .on('error', (error) => {
                    errorCallback && errorCallback(error)
                })
        } catch (e) {
            errorCallback && errorCallback(e)
        }

        // return _method.send.bind(this,{
        //     from: await this.getCurrentAccount(),
        //     value: 0,
        //     ...sendParams
        // })
    }

    /**
     * Buy ring token with Ether.
     * @param {string} value - amount for Ether， unit of measurement(wei)
     * @returns {Promise<PromiEvent<any>>}
     */
    buyRing(value, callback = {}) {
        return this.triggerContract({
            methodName: 'buyRING',
            abiKey: 'bancor',
            abiString: bancorABI,
            contractParams: [1],
            sendParams: {value: value}
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
            contractParams: [tokenId],
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
            finalReferrer && Utils.isAddress(finalReferrer)
                ? `0x${tokenId}${Utils.padLeft(finalReferrer.substring(2), 64, '0')}`
                : `0x${tokenId}`

        return this.triggerContract({
            methodName: 'transfer',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['auction'].address, amount, data],
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
        const from = await this.getCurrentAccount()
        const _from = Utils.padLeft(from.slice(2), 64, '0')
        const _start = Utils.toHexAndPadLeft(start).slice(2)
        const _end = Utils.toHexAndPadLeft(end).slice(2)
        const _duration = Utils.toHexAndPadLeft(duration).slice(2)
        const data = `0x${_start}${_end}${_duration}${_from}`
        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [this.ABIs['auction'].address, tokenId, data],
        }, callback)
    }

    /**
     * Bid Land Assets with Ether.
     * @param tokenId - tokenid of land
     * @param referer - Referrer address
     * @param value - bid price with ether
     * @returns {Promise<PromiEvent<any>>}
     */
    buyLandWithETHContract(tokenId, referer, value, callback = {}) {
        return this.triggerContract({
            methodName: "bidWithETH",
            abiString: actionABI,
            contractParams: [tokenId, referer],
            abiKey: "auction",
            sendParams: {value: value}
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
    withdrawRing({nonce, value, hash, v, r, s}, callback = {}) {
        return this.triggerContract({
            methodName: "takeBack",
            abiString: withdrawABI,
            params: [nonce, value, hash, v, r, s],
            abiKey: "withdraw",
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
            contractParams: [tokenId],
            abiKey: "auction",
        }, callback);
    }

    /**
     * Convert Ring token to Ether via bancor exchange
     * @param amount - ring token amount
     * @returns {Promise<PromiEvent<any>>}
     */
    sellRing(amount, callback = {}) {
        return this.triggerContract({
            methodName: 'transfer',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['bancor'].address, amount, '0x0000000000000000000000000000000000000000000000000000000000000001'],
        }, callback)
    }

    /**
     * Lock ring token to get Kton token
     * @param amount - ring amount
     * @param month - Locking time(unit: month)
     * @returns {Promise<PromiEvent<any>>}
     */
    saveRing(amount, month, callback = {}) {
        return this.triggerContract({
            methodName: 'transfer',
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
            methodName: 'transfer',
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
            methodName: 'transfer',
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
        const from = await this.getCurrentAccount()
        return this.triggerContract({
            methodName: 'transferFrom',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [from, to, tokenId],
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
            contractParams: [tokenId],
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
            finalReferrer && Utils.isAddress(finalReferrer)
                ? `0x${tokenId}${Utils.padLeft(finalReferrer.substring(2), 64, '0')}`
                : `0x${tokenId}`

        return this.triggerContract({
            methodName: 'transfer',
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
            contractParams: [tokenId],
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
        const from = await this.getCurrentAccount()
        const _from = Utils.padLeft(from.slice(2), 64, '0')
        const _start = Utils.toHexAndPadLeft(start).slice(2)
        const _end = Utils.toHexAndPadLeft(end).slice(2)
        const _duration = Utils.toHexAndPadLeft(duration).slice(2)
        const data = `0x${_start}${_end}${_duration}${_from}`
        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [this.ABIs['apostleSell'].address, tokenId, data],
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
            contractParams: [tokenId],
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
                tokenId,
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
            methodName: 'transfer',
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
            methodName: 'transfer',
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
        const from = await this.getCurrentAccount()
        const _from = Utils.padLeft(from.slice(2), 64, '0')
        const _start = Utils.toHexAndPadLeft(start).slice(2)
        const _end = Utils.toHexAndPadLeft(end).slice(2)
        const _duration = Utils.toHexAndPadLeft(duration).slice(2)
        const data = `0x${_start}${_end}${_duration}${_from}`
        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [this.ABIs['apostleSiringAuction'].address, tokenId, data],
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
                tokenId
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
        const from = await this.getCurrentAccount()

        return this.triggerContract({
            methodName: 'transferFrom',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [
                from, toAddress, tokenId
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
                tokenId, landTokenId, elementAddress
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
                tokenId
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
                tokenId
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
                tokenId,
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
                tokenId
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
            methodName: 'transfer',
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
                motherTokenId,
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
        const elementAddress = this.ABIs[element.toLowerCase() || 'token'].address

        return this.triggerContract({
            methodName: 'transfer',
            abiKey: element.toLowerCase(),
            abiString: apostleBaseABI,
            contractParams: [
                elementAddress,
                level * levelUnitPrice,
                `0x${motherTokenId}${Utils.toHexAndPadLeft(level).slice(2)}`
            ]
        }, callback)
    }

    /**
     * Bind pet
     * @param originNftAddress
     * @param originTokenId
     * @param apostleTokenId
     * @returns {Promise<PromiEvent<any>>}
     */
    bridgeInAndTie(originNftAddress, originTokenId, apostleTokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'bridgeInAndTie',
            abiKey: 'petBase',
            abiString: petBaseABI,
            contractParams: [originNftAddress, originTokenId, apostleTokenId]
        }, callback)
    }

    /**
     * Unbind pet
     * @param petTokenId
     * @returns {Promise<PromiEvent<any>>}
     */
    untiePetToken(petTokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'untiePetToken',
            abiKey: 'petBase',
            abiString: petBaseABI,
            contractParams: [petTokenId]
        }, callback)
    }

    /**
     * check address info
     * @param address - Ethereum address
     */
    checkAddress(address) {
        return this.ClientFetch.$get('/api/verified_wallet', {wallet: address})
    }

    challengeAddress(address) {
        return this.ClientFetch.$get('/api/challenge', {wallet: address})
    }

    async _sign({data, name}, from) {
        let signature;
        try {
            signature = await this._web3js.eth.personal.sign(
                name + " " + data,
                from
            );
        } catch (e) {

        }

        return {
            address: from,
            signature
        };
    }

    /**
     * Login Evolution Land
     * @param address - Ethereum address
     * @returns {Promise<*>}
     */
    async login(address) {
        return new Promise((resolve, reject) => {
            this.challengeAddress(address).then((res) => {
                const {code, data, name} = res
                if (code === 0) {
                    this._sign({data, name}, address)
                        .then(info => {
                            if (info.signature) {
                                this.ClientFetch.$post('/api/login', {
                                    wallet: address,
                                    sign: info.signature
                                }).then((res) => {
                                    resolve(res)
                                })
                            } else {
                                reject({code, data})
                            }
                        })
                        .catch(err => reject(err))
                }
            })
        })
    }
}

export default EthereumEvolutionLand
