import BigNumber from 'bignumber.js'
import EthereumTx from "ethereumjs-tx";

import {
    Env,
    getABIConfig
} from './env'
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
import uniswapExchangeABI from './env/abi/ethereum/abi-uniswapExchangeV2'
import swapBridgeABI from './env/abi/ethereum/abi-swapBridge'
import luckyBoxABI from './env/abi/ethereum/abi-luckyBag'
import itemTreasureABI from './env/abi/ethereum/abi-itemTreasure'
import itemTakeBackABI from './env/abi/ethereum/abi-itemTakeBack'
import Utils from '../utils/index'

import { ChainId, Token, TokenAmount, Pair, WETH, Fetcher, Percent, Route, TradeType, Trade } from '@uniswap/sdk'


const loop = function () { }

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
    constructor(web3js, network, option = {}) {
        this.version = '1.0.0'
        this._web3js = web3js
        this.env = Env(network)
        this.ABIs = getABIConfig(network)
        this.ABIClientFetch = new ClientFetch({
            baseUrl: this.env.ABI_DOMAIN,
            chainId: 60
        })
        this.ClientFetch = new ClientFetch({
            baseUrl: this.env.DOMAIN,
            chainId: 60
        })
        this.UniswapExchangeAddress = ''
        this.UniswapExchangeContract = null
        this.option = {
            sign: true,
            address: null,
            ...option
        }
    }


    setCustomAccount(account) {
        this.option.address = account
    }

    /**
     * get web3js Current address.
     * @returns {Promise<any>}
     */
    getCurrentAccount() {
        return new Promise((resolve, reject) => {
            if (this.option.address) {
                resolve(this.option.address)
            }
            this._web3js.eth.getAccounts((error, accounts) => {
                if (error) {
                    reject(error)
                } else {
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
    async triggerContract({
        methodName,
        abiKey,
        abiString,
        contractParams = [],
        sendParams = {}
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
            let _contract = null
            if (abiString) {
                _contract = new this._web3js.eth.Contract(abiString, this.ABIs[abiKey].address);
            } else {
                const _abi = await this.ABIClientFetch.$getAbi(this.ABIs[abiKey].api())
                _contract = new this._web3js.eth.Contract(_abi, this.ABIs[abiKey].address)
            }
            const extendPayload = { ...payload, _contractAddress: this.ABIs[abiKey].address };
            const _method = _contract.methods[methodName].apply(this, contractParams)
            const from = await this.getCurrentAccount()
            const gasRes = await this.ClientFetch.apiGasPrice({ wallet: this.option.address || from })
            let estimateGas = 300000;
            try {
                let hexSendParams = { value: 0 }
                Object.keys(sendParams).forEach((item) => {
                    hexSendParams[item] = Utils.toHex(sendParams[item])
                })
                estimateGas = await this.estimateGas(_method, this.option.address || from, gasRes.data.gas_price.standard, hexSendParams.value) || 300000;
            } catch (e) {
                console.log('estimateGas', e)
            }

            if (!this.option.sign) {
                if (!this.option.address) {
                    throw Error('from account is empty!')
                }

                let hexSendParams = {}
                Object.keys(sendParams).forEach((item) => {
                    hexSendParams[item] = Utils.toHex(sendParams[item])
                })

                const tx = new EthereumTx({
                    to: this.ABIs[abiKey].address,
                    value: 0,
                    nonce: gasRes.data.nonce,
                    gasPrice: gasRes.data.gas_price.standard,
                    gasLimit: Utils.toHex(estimateGas + 30000),
                    chainId: parseInt(await this.getNetworkId()),
                    data: _method ? _method.encodeABI() : '',
                    ...hexSendParams
                })

                const serializedTx = tx.serialize().toString("hex")

                unSignedTx && unSignedTx(serializedTx, extendPayload)
                return serializedTx;
            }

            return _method.send({
                from: await this.getCurrentAccount(),
                value: 0,
                gasLimit: Utils.toHex(estimateGas + 30000),
                ...sendParams
            })
                .on('transactionHash', (hash) => {
                    transactionHashCallback && transactionHashCallback(hash, extendPayload)
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    confirmationCallback && confirmationCallback(confirmationNumber, receipt, extendPayload)
                })
                .on('receipt', (receipt) => {
                    receiptCallback && receiptCallback(receipt, extendPayload)
                })
                .on('error', (error) => {
                    errorCallback && errorCallback(error, extendPayload)
                })
        } catch (e) {
            console.error('triggerContract', e)
            const extendPayload = { ...payload, _contractAddress: this.ABIs[abiKey].address };
            errorCallback && errorCallback(e, extendPayload)
        }

        // return _method.send.bind(this,{
        //     from: await this.getCurrentAccount(),
        //     value: 0,
        //     ...sendParams
        // })
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
            let _contract = null
            if (abiString) {
                _contract = new this._web3js.eth.Contract(abiString, this.ABIs[abiKey].address);
            } else {
                const _abi = await this.ABIClientFetch.$getAbi(this.ABIs[abiKey].api())
                _contract = new this._web3js.eth.Contract(_abi, this.ABIs[abiKey].address)
            }

            const _method = _contract.methods[methodName].apply(this, contractParams)
            return _method.call({
                from: await this.getCurrentAccount(),
            })

        } catch (e) {
            console.error('triggerContract', e)
            errorCallback && errorCallback(e)
        }
    }

    /**
     * Atlantis swap fee
     * @param {string} value amount of rings to be swaped
     * @param {*} callback 
     */
    async fetchAtlantisSwapFee(value, callback = {}) {
        return this.callContract({
            methodName: 'querySwapFee',
            abiKey: 'swapBridge',
            abiString: swapBridgeABI,
            contractParams: [value],
        }, callback)
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
     * Atlantis ring transfer to Byzantium
     * @param {string} value amount of rings to be swaped
     * @param {string} value tron address (bs58)
     * @param {*} callback 
     */
    async AtlantisSwapBridge(value, targetAddress, symbol = 'ring', callback = {}) {
        if (!targetAddress) {
            throw Error('empty targetAddress')
        }

        const fee = await this.fetchAtlantisSwapFee(value)
        const hexTargetAddress = Utils.decodeBase58Address(targetAddress);

        const extraData = `${Utils.toHexAndPadLeft(value)}${Utils.toHexAndPadLeft(2).slice(2)}${Utils.padLeft(hexTargetAddress.substring(2), 64, '0')}`
        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: symbol.toLowerCase(),
            abiString: ringABI,
            contractParams: [this.ABIs['swapBridge'].address, new BigNumber(fee).plus(1).plus(new BigNumber(value)).toFixed(0), extraData],
        }, callback)
    }

    /**
     * Swap Ether to Ring token - Powered by uniswap.
     * @param {string} value - amount for Ring， unit of measurement(wei)
     * @returns {Promise<PromiEvent<any>>}
     */
    async buyRingUniswap(value, callback = {}) {
        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const pair = await Fetcher.fetchPairData(WETH[RING.chainId], RING)
        const route = new Route([pair], WETH[RING.chainId])
        const amountIn = value
        const trade = new Trade(route, new TokenAmount(RING, amountIn), TradeType.EXACT_OUTPUT)
        const slippageTolerance = new Percent('0', '10000') // 30 bips, or 0.30%

        const amountInMax = trade.maximumAmountIn(slippageTolerance).raw // needs to be converted to e.g. hex
        const path = [WETH[RING.chainId].address, RING.address]
        const to = await this.getCurrentAccount() // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
        const outputAmount = trade.outputAmount.raw // // needs to be converted to e.g. hex

        return this.triggerContract({
            methodName: 'swapETHForExactTokens',
            abiKey: 'uniswapExchange',
            abiString: uniswapExchangeABI,
            contractParams: [
                outputAmount.toString(10),
                path,
                to,
                deadline
            ],
            sendParams: {
                value: amountInMax.toString(10)
            }
        }, callback)
    }

    /**
     * Swap Ring token to Ether - Powered by uniswap.
     * @param {string} value - amount for Ring， unit of measurement(wei)
     * @returns {Promise<PromiEvent<any>>}
     */
    async sellRingUniswap(value, callback = {}) {
        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const pair = await Fetcher.fetchPairData(RING, WETH[RING.chainId])
        const route = new Route([pair], RING)
        const amountIn = value
        const trade = new Trade(route, new TokenAmount(RING, amountIn), TradeType.EXACT_INPUT)
        const slippageTolerance = new Percent('0', '10000') // 30 bips, or 0.30%

        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
        const path = [RING.address, WETH[RING.chainId].address]
        const to = await this.getCurrentAccount() // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
        const inputAmount = trade.inputAmount.raw // // needs to be converted to e.g. hex

        return this.triggerContract({
            methodName: 'swapExactTokensForETH',
            abiKey: 'uniswapExchange',
            abiString: uniswapExchangeABI,
            contractParams: [
                inputAmount.toString(10),
                amountOutMin.toString(10),
                path,
                to,
                deadline
            ],
            sendParams: {
                value: 0
            }
        }, callback)
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
   * Ethereum Function, Approve Ring to Uniswap Exchange
   * @param {*} callback 
   */
    async approveRingToUniswap(callback = {}) {
        return this.triggerContract({
            methodName: 'approve',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['uniswapExchange'].address, '20000000000000000000000000'],
        }, callback)
    }

    /**
     * Check if uniswap has sufficient transfer authority
     * @param {*} amount 
     */
    async checkUniswapAllowance(amount) {
        const from = await this.getCurrentAccount()

        const erc20Contract = new this._web3js.eth.Contract(ringABI, this.ABIs['ring'].address)
        const allowanceAmount = await erc20Contract.methods.allowance(from, this.ABIs['uniswapExchange'].address).call()
        return !Utils.toBN(allowanceAmount).lt(Utils.toBN(amount || '1000000000000000000000000'))
    }

    /**
     * get amount of ether in uniswap exchange 
     */
    async getUniswapEthBalance() {
        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const pair = await Fetcher.fetchPairData(WETH[RING.chainId], RING)
        return pair.tokenAmounts[1].raw.toString(10)
    }

    /**
    * get amount of ring in uniswap exchange 
    */
    async getUniswapTokenBalance() {
        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const pair = await Fetcher.fetchPairData(WETH[RING.chainId], RING)
        return pair.tokenAmounts[0].raw.toString(10)
    }

    /**
     * Eth will be cost to swap 1 Ring
     * @param {*} tokens_bought
     */
    async getEthToTokenOutputPrice(tokens_bought = '1000000000000000000') {
        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const pair = await Fetcher.fetchPairData(WETH[RING.chainId], RING)
        const route = new Route([pair], WETH[RING.chainId])
        const amountIn = tokens_bought
        const trade = new Trade(route, new TokenAmount(RING, amountIn), TradeType.EXACT_OUTPUT)
        const slippageTolerance = new Percent('0', '10000') 
        const amountInMax = trade.maximumAmountIn(slippageTolerance).raw

        return [new BigNumber(amountInMax.toString(10)).times('1000000000000000000').div(tokens_bought).toFixed(0), amountInMax.toString(10)];
    }

    /**
    * Eth will be got to swap 1 Ring
    * @param {*} tokens_bought
    */
    async getTokenToEthInputPrice(tokens_bought = '1000000000000000000') {
        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const pair = await Fetcher.fetchPairData(RING, WETH[RING.chainId])
        const route = new Route([pair], RING)
        const amountIn = tokens_bought // 1 WETH
        const trade = new Trade(route, new TokenAmount(RING, amountIn), TradeType.EXACT_INPUT)
        const slippageTolerance = new Percent('0', '10000') // 50 bips, or 0.50%
        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
        return [new BigNumber(amountOutMin.toString(10)).times('1000000000000000000').div(tokens_bought).toFixed(0), amountOutMin.toString(10)];
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
            sendParams: {
                value: value
            }
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
     * Bid Land Assets with Ring token.
     * @param amount - bid price with ring token
     * @param tokenId - tokenid of land
     * @param referrer - Referrer address
     * @returns {Promise<PromiEvent<any>>}
     */
    buyLandContract(amount, tokenId, referrer, callback = {}) {
        const finalReferrer = referrer
        const data =
            finalReferrer && Utils.isAddress(finalReferrer) ?
                `0x${tokenId}${Utils.padLeft(finalReferrer.substring(2), 64, '0')}` :
                `0x${tokenId}`

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
            contractParams: [this.ABIs['auction'].address, '0x' + tokenId, data],
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
            contractParams: ['0x' + tokenId, referer],
            abiKey: "auction",
            sendParams: {
                value: value
            }
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
            contractParams: [from, to, '0x' + tokenId],
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
        const from = await this.getCurrentAccount()

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
            methodName: 'transfer',
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
            contractParams: [originNftAddress, originTokenId, '0x' + apostleTokenId]
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
            contractParams: ['0x' + petTokenId]
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
    getLuckyBoxInfo() {
        const _contract = new this._web3js.eth.Contract(luckyBoxABI, this.ABIs['luckybag'].address)
        return Promise.all([
            _contract.methods.goldBoxPrice().call(),
            _contract.methods.silverBoxPrice().call(),
            _contract.methods.goldBoxAmountForSale().call(),
            _contract.methods.silverBoxAmountForSale().call(),
            _contract.methods.goldSaleLimit().call(),
            _contract.methods.silverSaleLimit().call(),
        ])
    }

    /**
     * Number of lucky box already purchased at this address
     * @param {*} address - buyer
     * @returns {Array} - promise -> [goldSalesRecord, silverSalesRecord]
     */
    getLuckyBoxSalesRecord(address) {
        const _contract = new this._web3js.eth.Contract(luckyBoxABI, this.ABIs['luckybag'].address)
        return Promise.all([
            _contract.methods.goldSalesRecord(address).call(),
            _contract.methods.silverSalesRecord(address).call(),
        ])
    }

    /**
     * get furnace treasure price
     * @returns {} - promise -> {0: "1026000000000000000000", 1: "102000000000000000000", priceGoldBox: "1026000000000000000000", priceSilverBox: "102000000000000000000"}
     */
    getFurnaceTreasurePrice() {
        const _contract = new this._web3js.eth.Contract(itemTreasureABI, this.ABIs['itemTreasure'].address)
        return _contract.methods.getPrice().call()
    }

    getFurnaceTakeBackNonce(address) {
        const _contract = new this._web3js.eth.Contract(itemTakeBackABI, this.ABIs['itemTakeBack'].address)
        return _contract.methods.userToNonce(address).call()
    }

    /**
     * buy lucky box
     * @param {*} goldBoxAmount - gold box amount
     * @param {*} silverBoxAmount - silver box amount
     */
    async buyFurnaceTreasure(goldBoxAmount = 0, silverBoxAmount = 0, callback) {
        const treasurePrice = await this.getFurnaceTreasurePrice()
        const cost = Utils.toBN(treasurePrice.priceGoldBox).muln(goldBoxAmount).add(Utils.toBN(treasurePrice.priceSilverBox).muln(silverBoxAmount))

        // Function: transfer(address _to, uint256 _value, bytes _data) ***
        // data
        // 0000000000000000000000000000000000000000000000000000000000000001 gold box amount
        // 0000000000000000000000000000000000000000000000000000000000000002 silver box amount
        const data = Utils.toTwosComplement(goldBoxAmount) + Utils.toTwosComplement(silverBoxAmount).substring(2, 66)
        return this.triggerContract({
            methodName: 'transfer',
            abiKey: 'ring',
            abiString: ringABI,
            contractParams: [this.ABIs['itemTreasure'].address, cost.toString(10), data],
            sendParams: {
                value: 0
            }
        }, callback)
    }

     /**
     *  open furnace treasure
     * @returns {Promise<PromiEvent<any>>}
     */
    openFurnaceTreasure({
        boxIds,
        amounts,
        hashmessage,
        v,
        r,
        s
    }, callback = {}) {
        // During the process of opening the treasure chest, there is the logic of randomly gifting rings, 
        // which leads to inaccurate gas estimation, so manually set it to avoid out of gas.
        // https://etherscan.io/tx/0xe71f54aee8f7ab1dd15df955d09c79af5060f20e91c0c5ecfcf17f20c9bf02b3
        // https://etherscan.io/tx/0x7b04df9b55f33b6edcc402a5733dbc753a6bbe2f78af7c7bef6f3f4d8dce7491

        
        return this.triggerContract({
            methodName: "openBoxes",
            abiString: itemTakeBackABI,
            contractParams: [
                boxIds,
                amounts,
                hashmessage,
                v,
                r,
                s
            ],
            sendParams: {
                value: 0,
                gasLimit: new BigNumber(boxIds.length).times(250000).toFixed(0)
            },
            abiKey: "itemTakeBack",
        }, callback);
    }

    checkFurnaceTreasureStatus(id) {
        const _contract = new this._web3js.eth.Contract(itemTakeBackABI, this.ABIs['itemTakeBack'].address)
        return _contract.methods.ids(id).call()
    }

    getRingBalance(address) {
        const _contract = new this._web3js.eth.Contract(ringABI, this.ABIs['ring'].address)
        return _contract.methods.balanceOf(address).call()
    }

    getKtonBalance(address) {
        const _contract = new this._web3js.eth.Contract(ktonABI, this.ABIs['kton'].address)
        return _contract.methods.balanceOf(address).call()
    }

    /**
     * transfer evo land 721 object
     * @param {*} to recevier
     * @param {*} tokenId 721 tokenid
     * @param {*} callback 
     */
    async transferFromObjectOwnership(to, tokenId, callback = {}) {
        if (!to) {
            return null
        }
        const from = await this.getCurrentAccount()
        return this.triggerContract({
            methodName: 'transferFrom',
            abiKey: 'land',
            abiString: landABI,
            contractParams: [from, to, '0x' + tokenId],
        }, callback)
    }

    estimateGas(method, address, gasPrice, value = 0) {
        if (!this._web3js) return;
        return (method || this._web3js.eth).estimateGas({ from: address, gasLimit: 0, gasPrice: gasPrice, value });
    }

    getNetworkId() {
        return this._web3js.eth.net.getId()
    }

    /**
     * check address info
     * @param address - Ethereum address
     */
    checkAddress(address) {
        return this.ClientFetch.$get('/api/verified_wallet', {
            wallet: address
        })
    }

    challengeAddress(address) {
        return this.ClientFetch.$get('/api/challenge', {
            wallet: address
        })
    }

    async _sign({
        data,
        name
    }, from) {
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
                const {
                    code,
                    data,
                    name
                } = res
                if (code === 0) {
                    this._sign({
                        data,
                        name
                    }, address)
                        .then(info => {
                            if (info.signature) {
                                this.ClientFetch.$post('/api/login', {
                                    wallet: address,
                                    sign: info.signature
                                }).then((res) => {
                                    resolve(res)
                                })
                            } else {
                                reject({
                                    code,
                                    data
                                })
                            }
                        })
                        .catch(err => reject(err))
                }
            })
        })
    }
}

export default EthereumEvolutionLand