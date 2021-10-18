import BigNumber from 'bignumber.js'
import EthereumTx from "ethereumjs-tx";

import {
    Env,
    getABIConfig
} from './env'
import ClientFetch from '../utils/clientFetch'

import Utils from '../utils/index'
import UniswapUtils from '../utils/uniswap'
import { ethers } from 'ethers'
import { Fetcher } from '../utils/uniswapFetcher';

import { Currency, ChainId, Token, TokenAmount, Pair, Percent, Route, TradeType, Trade, JSBI, CurrencyAmount } from '@uniswap/sdk'

import ApostleApi from '../api/apostle'
import FurnaceApi from '../api/furnace'
import LandApi from '../api/land'
import Erc20Api from '../api/erc20'
import WethApi from '../api/weth'
import LiquidityStakerApi from '../api/liquidityStaker'
import GoldrushApi from '../api/goldrush';
import DrillApi from '../api/drill';
import { PveApi } from "../api/pve";


const loop = function () { }

/**
 * @class
 * Evolution Land for Ethereum
 */
class HecoEvolutionLand {
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
            evoNetwork: 'heco'
        })

        this.etherjsProvider = null;

        this.ClientFetch = new ClientFetch({
            baseUrl: this.env.DOMAIN,
            evoNetwork: 'heco'
        })
        this.option = {
            sign: true,
            address: null,
            ...option
        }
    }

    async setEtherjsProvider() {
        if(!this.etherjsProvider) {
            this.etherjsProvider = await new ethers.providers.JsonRpcProvider(this.env.CONTRACT.PROVIDER);
            // this.etherjsProvider._isProvider = true;
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
        receiptFinal = loop,
        unSignedTx = loop,
        payload = {}
    } = {}) {
        try {
            beforeFetch && beforeFetch();
            let _contract = null;
            let contractAddress = this.getContractAddress(abiKey);
            
            _contract = new this._web3js.eth.Contract(abiString, contractAddress);
            const extendPayload = { ...payload, _contractAddress: contractAddress };
            const _method = _contract.methods[methodName].apply(this, contractParams)
            const from = await this.getCurrentAccount()
            let estimateGas = null;

            try {
                let hexSendParams = { value: 0 }
                Object.keys(sendParams).forEach((item) => {
                    hexSendParams[item] = Utils.toHex(sendParams[item])
                })
                estimateGas = await this.estimateGas(_method, this.option.address || from, hexSendParams.value) || 300000;
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

                const gasRes = await this.ClientFetch.apiGasPrice({ wallet: this.option.address || from }, true)

                const tx = new EthereumTx({
                    to: contractAddress,
                    value: 0,
                    nonce: gasRes.data.nonce,
                    gasPrice: Utils.toHex(gasRes.data.gas_price.standard),
                    
                    chainId: parseInt(await this.getNetworkId()),
                    data: _method ? _method.encodeABI() : '',
                    ...(estimateGas ? {gasLimit: Utils.toHex(estimateGas + 30000)} : {}),
                    ...hexSendParams
                })

                const serializedTx = tx.serialize().toString("hex")

                unSignedTx && unSignedTx(serializedTx, extendPayload)
                return serializedTx;
            }

            return _method.send({
                from: await this.getCurrentAccount(),
                value: 0,
                ...(estimateGas ? {gasLimit: Utils.toHex(estimateGas + 30000)} : {}),
                ...sendParams
            })
                .once('transactionHash', (hash) => {
                    transactionHashCallback && transactionHashCallback(hash, extendPayload)
                })
                .once('confirmation', (confirmationNumber, receipt) => {
                    confirmationCallback && confirmationCallback(confirmationNumber, receipt, extendPayload)
                })
                .once('receipt', (receipt) => {
                    receiptCallback && receiptCallback(receipt, extendPayload)
                })
                .once('error', (error) => {
                    errorCallback && errorCallback(error, extendPayload)
                })
                // .then((receipt) =>{
                //     receiptFinal && receiptFinal(receipt, extendPayload);
                // })
        } catch (e) {
            console.error('triggerContract', e)
            let contractAddress = this.getContractAddress(abiKey);
            const extendPayload = { ...payload, _contractAddress: contractAddress };
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
            let contractAddress = this.getContractAddress(abiKey);
            _contract = new this._web3js.eth.Contract(abiString, contractAddress);

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
     * Get the contract address of evolution land by key.
     * @param {*} tokenKey ring | kton | gold ... 
     */
    getContractAddress(tokenKey) {
        let token = (this.ABIs[tokenKey] && this.ABIs[tokenKey].address) || tokenKey;
        // if(Array.isArray(tokenKey) && tokenKey.length === 2) {
        //     const pair = await this.getDerivedPairInfo(...tokenKey)
        //     token = pair.liquidityToken.address
        // }
        
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
            abiString: this.ABIs['erc721'].abi,
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
            abiString: this.ABIs['erc721'].abi,
            contractParams: [tokenId],
        });

        const approvedAddress = await this.callContract({
            methodName: 'getApproved',
            abiKey: contractAddress,
            abiString: this.ABIs['erc721'].abi,
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
            abiString: this.ABIs['erc721'].abi,
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
            abiString: this.ABIs['erc721'].abi,
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
            abiString: this.ABIs['erc721'].abi,
            contractParams: [to, approved],
        }, callback)
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
            abiString: this.ABIs['swapBridge'].abi,
            contractParams: [value],
        }, callback)
    }

    getSimpleBridgeStatus(callback = {}) {
        return this.callContract({
            methodName: 'paused',
            abiKey: 'swapBridge',
            abiString: this.ABIs['swapBridge'].abi,
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
            abiString: this.ABIs['ring'].abi,
            contractParams: [this.ABIs['swapBridge'].address, new BigNumber(fee).plus(1).plus(new BigNumber(value)).toFixed(0), extraData],
        }, callback)
    }

    /**
     * Swap Ether to Ring token - Powered by uniswap.
     * @param {string} value - amount for Ring， unit of measurement(wei)
     * @returns {Promise<PromiEvent<any>>}
     */
    async buyRingUniswap(value, callback = {}) {
        await this.setEtherjsProvider()

        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const WETH = this.wethGetToken();
        const pair = await Fetcher.fetchPairData(WETH, RING, this.etherjsProvider)
        const route = new Route([pair], WETH)
        const amountIn = value
        const trade = new Trade(route, new TokenAmount(RING, amountIn), TradeType.EXACT_OUTPUT)
        const slippageTolerance = new Percent('30', '10000') // 30 bips, or 0.30%

        const amountInMax = trade.maximumAmountIn(slippageTolerance).raw // needs to be converted to e.g. hex
        const path = [WETH.address, RING.address]
        const to = await this.getCurrentAccount() // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
        const outputAmount = trade.outputAmount.raw // // needs to be converted to e.g. hex

        return this.triggerContract({
            methodName: 'swapETHForExactTokens',
            abiKey: 'uniswapExchange',
            abiString: this.ABIs['uniswapExchange'].abi,
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
        await this.setEtherjsProvider()

        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const WETH = this.wethGetToken();
        const pair = await Fetcher.fetchPairData(RING, WETH, this.etherjsProvider)
        const route = new Route([pair], RING)
        const amountIn = value
        const trade = new Trade(route, new TokenAmount(RING, amountIn), TradeType.EXACT_INPUT)
        const slippageTolerance = new Percent('30', '10000') // 30 bips, or 0.30%

        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
        const path = [RING.address, WETH.address]
        const to = await this.getCurrentAccount() // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
        const inputAmount = trade.inputAmount.raw // // needs to be converted to e.g. hex

        return this.triggerContract({
            methodName: 'swapExactTokensForETH',
            abiKey: 'uniswapExchange',
            abiString: this.ABIs['uniswapExchange'].abi,
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

        return this.triggerContract({
            methodName: 'transfer',
            abiKey: symbol,
            abiString: this.ABIs['ring'].abi,
            contractParams: [to, value],
        }, callback)
    }

    /**
     * Ethereum Function, Approve Ring to Uniswap Exchange
     * @param {*} callback 
     */
    async approveRingToUniswap(callback = {}, value="20000000000000000000000000") {
        return this.triggerContract({
            methodName: 'approve',
            abiKey: 'ring',
            abiString: this.ABIs['ring'].abi,
            contractParams: [this.ABIs['uniswapExchange'].address, value],
        }, callback)
    }

    /**
     * Allows Uniswap to withdraw from your account multiple times, up to the value amount. 
     * @param {*} addressOrType ERC20 token contract address.
     * @param {*} value
     * @param {*} callback 
     */
    approveTokenToUniswap(addressOrType, value="0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", callback = {}) {
        if(!addressOrType) {
            throw 'ethereum::approveTokenToUniswap: missing addressOrType param'
        }

        return this.triggerContract({
            methodName: 'approve',
            abiKey: addressOrType,
            abiString: this.ABIs['ring'].abi,
            contractParams: [this.ABIs['uniswapExchange'].address, value],
        }, callback)
    }

    /**
     * Approve liquidity to uniswap
     * @param {*} tokenAType Token 0 contract address 
     * @param {*} tokenBType Token 1 contract address 
     * @param {*} value Approved value
     * @param {*} callback 
     */
    async approveLiquidityTokenToUniswap(tokenAType, tokenBType, value="0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", callback = {}) {
        if(!tokenAType || !tokenBType) {
            throw 'ethereum::approveLiquidityTokenToUniswap: missing addressOrType param'
        }

        const pair = await this.getDerivedPairInfo(tokenAType, tokenBType);

        return this.approveTokenToUniswap(pair.liquidityToken.address, value, callback);
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
            abiString: this.ABIs['ring'].abi,
            contractParams: [spender, value],
        }, callback)
    }

    /**
     * Approve uniswap liquidity token to spender.
     * @param {*} tokenAType 
     * @param {*} tokenBType 
     * @param {*} value 
     * @param {*} callback 
     */
    async approveUniswapLiquidityToken(tokenAType, tokenBType, spender, value="0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", callback = {}) {
        if(!tokenAType || !tokenBType) {
            throw 'ethereum::approveUniswapLiquidityToken: missing addressOrType param'
        }

        const pair = await this.getDerivedPairInfo(tokenAType, tokenBType);

        return this.triggerContract({
            methodName: 'approve',
            abiKey: pair.liquidityToken.address,
            abiString: this.ABIs['ring'].abi,
            contractParams: [spender, value],
        }, callback)
    }

    /**
     * Check if uniswap has sufficient transfer authority
     * @param {*} amount
     * @param {*} tokenAddressOrType
     * @param {*} account
     */
    async checkUniswapAllowance(amount, tokenAddressOrType = 'ring', account) {
        const from = account || await this.getCurrentAccount();
        const token = this.getContractAddress(tokenAddressOrType);
        const erc20Contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, token)
        const allowanceAmount = await erc20Contract.methods.allowance(from, this.ABIs['uniswapExchange'].address).call()

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
            throw 'ethereum::checkTokenAllowance: missing param'
        }

        const from = account || await this.getCurrentAccount();
        const token = this.getContractAddress(tokenAddressOrType);
        const erc20Contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, token)

        const allowanceAmount = await erc20Contract.methods.allowance(from, spender).call()

        return !Utils.toBN(allowanceAmount).lt(Utils.toBN(amount || '1000000000000000000000000'))
    }

    /**
     * get amount of ether in uniswap exchange 
     */
    async getUniswapEthBalance() {
        await this.setEtherjsProvider()

        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const WETH = this.wethGetToken();
        const pair = await Fetcher.fetchPairData(WETH, RING, this.etherjsProvider)
        return pair.tokenAmounts[0].token.equals(WETH) ? pair.tokenAmounts[0].raw.toString(10) : pair.tokenAmounts[1].raw.toString(10)
    }

    /**
    * get amount of ring in uniswap exchange 
    */
    async getUniswapTokenBalance() {
        await this.setEtherjsProvider()

        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const WETH = this.wethGetToken();
        const pair = await Fetcher.fetchPairData(WETH, RING, this.etherjsProvider)
        return pair.tokenAmounts[0].token.equals(RING) ? pair.tokenAmounts[0].raw.toString(10) : pair.tokenAmounts[1].raw.toString(10)
    }

    /**
     * Eth will be cost to swap 1 Ring
     * @param {*} tokens_bought
     */
    async getEthToTokenOutputPrice(tokens_bought = '1000000000000000000') {
        await this.setEtherjsProvider()

        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const WETH = this.wethGetToken();
        const pair = await Fetcher.fetchPairData(WETH, RING, this.etherjsProvider)
        const route = new Route([pair], WETH)
        const amountIn = tokens_bought
        const trade = new Trade(route, new TokenAmount(RING, amountIn), TradeType.EXACT_OUTPUT)
        const slippageTolerance = new Percent('30', '10000') 
        const amountInMax = trade.maximumAmountIn(slippageTolerance).raw

        return [new BigNumber(amountInMax.toString(10)).times('1000000000000000000').div(tokens_bought).toFixed(0), amountInMax.toString(10)];
    }

    /**
    * Eth will be got to swap 1 Ring
    * @param {*} tokens_bought
    */
    async getTokenToEthInputPrice(tokens_bought = '1000000000000000000') {
        await this.setEtherjsProvider()

        const RING = new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token")
        const WETH = this.wethGetToken();
        const pair = await Fetcher.fetchPairData(RING, WETH, this.etherjsProvider)
        const route = new Route([pair], RING)
        const amountIn = tokens_bought // 1 WETH
        const trade = new Trade(route, new TokenAmount(RING, amountIn), TradeType.EXACT_INPUT)
        const slippageTolerance = new Percent('30', '10000') // 50 bips, or 0.50%
        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
        return [new BigNumber(amountOutMin.toString(10)).times('1000000000000000000').div(tokens_bought).toFixed(0), amountOutMin.toString(10)];
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
            abiString: this.ABIs['auction'].abi,
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
        const from = await this.getCurrentAccount()
        const _from = Utils.padLeft(from.slice(2), 64, '0')
        const _start = Utils.toHexAndPadLeft(start).slice(2)
        const _end = Utils.toHexAndPadLeft(end).slice(2)
        const _duration = Utils.toHexAndPadLeft(duration).slice(2)
        const data = `0x${_start}${_end}${_duration}${_from}`
        return this.triggerContract({
            methodName: 'approveAndCall',
            abiKey: 'land',
            abiString: this.ABIs['land'].abi,
            contractParams: [this.ABIs['auction'].address, '0x' + tokenId, data],
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
            abiString: this.ABIs['withdraw'].abi,
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
            abiString: this.ABIs['withdraw'].abi,
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
            abiString: this.ABIs['auction'].abi,
            contractParams: ['0x' + tokenId],
            abiKey: "auction",
        }, callback);
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
            abiString: this.ABIs['kton'].abi,
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
            abiString: this.ABIs['bank'].abi,
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
            abiString: this.ABIs['lottery'].abi,
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
            abiString: this.ABIs['rolesUpdater'].abi,
            contractParams: [_nonce, _testerCodeHash, _hashmessage, _v, _r, _s],
        }, callback)
    }

    /**
     * create a red package TODO: Heco chain don't support erc223
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
            abiString: this.ABIs['ring'].abi,
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
            abiString: this.ABIs['land'].abi,
            contractParams: [from, to, '0x' + tokenId],
        }, callback)
    }

    /**
     *  claim resource on the Land
     * @param tokenId Land token Id.
     * @returns {Promise<PromiEvent<any>>}
     */
    resourceClaim(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'claimLandResource',
            abiKey: 'apostleLandResource',
            abiString: this.ABIs['apostleLandResource'].abi,
            contractParams: ['0x' + tokenId],
        }, callback)
    }

    /**
     *  claim resource on the Land
     * @param tokenId Land token Id.
     * @returns {Promise<PromiEvent<any>>}
     */
    claimLandResource(tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'claimLandResource',
            abiKey: 'apostleLandResource',
            abiString: this.ABIs['apostleLandResource'].abi,
            contractParams: ['0x' + tokenId],
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
            abiString: this.ABIs['apostleAuction'].abi,
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
            abiString: this.ABIs['land'].abi,
            contractParams: [this.ABIs['apostleAuction'].address, '0x' + tokenId, data],
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
            abiString: this.ABIs['apostleAuction'].abi,
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
            abiString: this.ABIs['apostleTakeBack'].abi,
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
            abiString: this.ABIs['land'].abi,
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
            abiKey: 'apostleSiringAuction',
            abiString: this.ABIs['apostleSiringAuction'].abi,
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
            abiString: this.ABIs['land'].abi,
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
            abiString: this.ABIs['apostleLandResource'].abi,
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
            abiString: this.ABIs['apostleLandResource'].abi,
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
            abiString: this.ABIs['apostleTokenUse'].abi,
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
            abiString: this.ABIs['land'].abi,
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
            abiString: this.ABIs['apostleTokenUse'].abi,
            contractParams: [
                '0x' + tokenId
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
            abiString: this.ABIs['petBase'].abi,
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
            abiString: this.ABIs['petBase'].abi,
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
            abiString: this.ABIs['luckybag'].abi,
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
        const _contract = new this._web3js.eth.Contract(this.ABIs['luckybag'].abi, this.ABIs['luckybag'].address)
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
        const _contract = new this._web3js.eth.Contract(this.ABIs['luckybag'].abi, this.ABIs['luckybag'].address)
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
        const _contract = new this._web3js.eth.Contract(this.ABIs['itemTreasure'].abi, this.ABIs['itemTreasure'].address)
        return _contract.methods.getPrice().call()
    }

    getFurnaceTakeBackNonce(address) {
        const _contract = new this._web3js.eth.Contract(this.ABIs['itemTakeBack'].abi, this.ABIs['itemTakeBack'].address)
        return _contract.methods.userToNonce(address).call()
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

        // no return ring - gas used - 229,289
        // https://etherscan.io/tx/0x4e1fc1dcec64bb497405126e55ab743368f1cb1cede945936937e0cde1d254e7
        // prize ring - gas used - 254,776 
        // https://etherscan.io/tx/0xd2b3f05b19e74627940edfe98daee31eeab84b67e88dcf0e77d595430b3b1afc

        let gasLimit = new BigNumber(amounts[0]).lt('1000000000000000000000') ? new BigNumber(320000) : new BigNumber(320000);

        if(amounts.length > 1) {
            for (let index = 1; index < amounts.length; index++) {
                const amount = amounts[index];
                gasLimit = gasLimit.plus(new BigNumber(amount).lt('1000000000000000000000') ? new BigNumber(320000) : new BigNumber(320000));
            }
        }
        
        return this.triggerContract({
            methodName: "openBoxes",
            abiString: this.ABIs['itemTakeBack'].abi,
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
                gasLimit: gasLimit.toFixed(0)
            },
            abiKey: "itemTakeBack",
        }, callback);
    }

    checkFurnaceTreasureStatus(id) {
        const _contract = new this._web3js.eth.Contract(this.ABIs['itemTakeBack'].abi, this.ABIs['itemTakeBack'].address)
        return _contract.methods.ids(id).call()
    }


    /**
     * Returns the amount of RING owned by account
     * @param {*} address 
     */
    getRingBalance(address) {
        const _contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, this.ABIs['ring'].address)
        return _contract.methods.balanceOf(address).call()
    }


    /**
     * Returns the amount of KTON owned by account
     * @param {*} address 
     */
    getKtonBalance(address) {
        const _contract = new this._web3js.eth.Contract(this.ABIs['kton'].abi, this.ABIs['kton'].address)
        return _contract.methods.balanceOf(address).call()
    }

    /**
     * Returns the amount of tokens owned by account
     * @param {*} account 
     * @param {*} contractAddress 
     */
    getTokenBalance(account, contractAddress) {
        const _contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, contractAddress)
        return _contract.methods.balanceOf(account).call()
    }

    /**
     * Returns the amount of tokens owned by account
     * @param {*} account
     * @param {*} symbol
     * @returns
     */
    getTokenBalanceBySymbol(account, symbol) {
        // specify token
        switch ((symbol || '').toLowerCase()) {
            // case 'ht':
            // case 'matic':
            case 'weth':
                return this._web3js.eth.getBalance(account);
        }

        const _contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, this.ABIs[(symbol || '').toLowerCase()].address)
        return _contract.methods.balanceOf(account).call()
    }

    /**
     * Get total supply of erc20 token
     * @param {*} contractAddress Erc20 contract address
     */
    getTokenTotalSupply(contractAddress) {
        const _contract = new this._web3js.eth.Contract(this.ABIs['ring'].abi, contractAddress)
        return _contract.methods.totalSupply().call()
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
            abiString: this.ABIs['land'].abi,
            contractParams: [from, to, '0x' + tokenId],
        }, callback)
    }

    /**
     * Get uniswap Token info by lowercase symbol
     * 
     * Token - https://uniswap.org/docs/v2/SDK/token/
     * 
     * @param {*} tokenType  ring kton gold wood water fire soil
     */
    getUniswapToken(tokenType) {
        switch (tokenType.toLowerCase()) {
            case 'ring':
                return new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_RING, 18, "RING", "Darwinia Network Native Token");
            case 'kton':
                return new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_KTON, 18, "KTON", "KTON");
            case 'gold':
                return new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_ELEMENT_GOLD, 18, "GOLD", "GOLD");
            case 'wood':
                return new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_ELEMENT_WOOD, 18, "WOOD", "WOOD");
            case 'water':
                return new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_ELEMENT_WATER, 18, "WATER", "WATER");
            case 'fire':
                return new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_ELEMENT_FIRE, 18, "FIRE", "FIRE");
            case 'soil':
                return new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_ELEMENT_SOIL, 18, "SOIL", "SOIL");
            case 'wht':
            case 'weth':
                return this.wethGetToken();
            case 'dusd':
                return new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_DUSD, 18, "DUSD", "Demeter USD");
            default:
                break;
        }
    }

    /**
     * Get uniswap pair info
     * @param {*} tokenA token address or lowercase symbol (ring kton gold wood water fire soil)
     * @param {*} tokenB token address or lowercase symbol (ring kton gold wood water fire soil)
     * @returns { pair } pair - https://uniswap.org/docs/v2/SDK/pair/
     */
    async getDerivedPairInfo(tokenA, tokenB) {
        if(!tokenA || !tokenB) {
            return;
        }

        await this.setEtherjsProvider()

        const currencyA = this.getUniswapToken(tokenA);
        const currencyB = this.getUniswapToken(tokenB);
        const pair = await Fetcher.fetchPairData(currencyA, currencyB, this.etherjsProvider);

        return pair;
    }

    /**
     * Support for addUniswapLiquidity function, and the return router pair instances and elements are returned.
     * 
     * Only one account needs to be provided, and the other quantity needs to be provided according to the current pool price
     * 
     * tokenType - token address or lowercase symbol (ring kton gold wood water fire soil)
     * 
     * amount - amount in WEI
     * 
     * @param {*} param0 {token: tokenAType, amount: amountA}  
     * @param {*} param1 {token: tokenBType, amount: amountB}
     * @returns {*} {pair, parsedAmounts}  pair - https://uniswap.org/docs/v2/SDK/pair/   parsedAmounts - {token0address: amount, token1address: amount}
     */
    async getDerivedMintInfo({token: tokenAType, amount: amountA}, {token: tokenBType, amount: amountB}) {
        const pair = await this.getDerivedPairInfo(tokenAType, tokenBType);
        const totalSupply = new TokenAmount(pair.liquidityToken, await this.getTokenTotalSupply(pair.liquidityToken.address));

        const independentToken = amountA ? 
        { token: this.getUniswapToken(tokenAType), amount: amountA} : 
        { token: this.getUniswapToken(tokenBType), amount: amountB};

        const parsedAmounts = {
            [pair.liquidityToken.address]: totalSupply,
            [pair.token0.address]: new TokenAmount(pair.token0, independentToken.token.equals(pair.token0) ? JSBI.BigInt(independentToken.amount) : pair.priceOf(independentToken.token).quote(new CurrencyAmount(independentToken.token, JSBI.BigInt(independentToken.amount))).raw),
            [pair.token1.address]: new TokenAmount(pair.token1, independentToken.token.equals(pair.token1) ? JSBI.BigInt(independentToken.amount) : pair.priceOf(independentToken.token).quote(new CurrencyAmount(independentToken.token, JSBI.BigInt(independentToken.amount))).raw),
        }

        return { pair, parsedAmounts }
    }

    /**
     * Support for removeUniswapLiquidity function, assuming removal percentage of liquidity and the return router pair instances and elements are returned.
     * 
     * tokenType - token address or lowercase symbol (ring kton gold wood water fire soil)
     * 
     * pair - https://uniswap.org/docs/v2/SDK/pair/
     * 
     * TokenAmount - https://github.com/Uniswap/uniswap-sdk/blob/v2/src/entities/fractions/tokenAmount.ts
     * 
     * parsedAmounts - {
     * 
     *  LIQUIDITY_PERCENT: percent,
     * 
     *  liquidityTokenAddress: TokenAmount,
     * 
     *  token0Address: TokenAmount,
     * 
     *  token1Address: TokenAmount
     * 
     * }
     * 
     * @param {*} tokenAType 
     * @param {*} tokenBType 
     * @param {*} liquidityValue The value of liquidity removed
     * @param {*} to 
     * @returns {*} {pair, parsedAmounts}
     */
    async getDerivedBurnInfo(tokenAType, tokenBType, liquidityValue, to) {
        const pair = await this.getDerivedPairInfo(tokenAType, tokenBType);

        if(!to) {
            to = await this.getCurrentAccount();    
        }

        const lpBalanceStr = await this.getTokenBalance(to, pair.liquidityToken.address);
        const userLiquidity = new TokenAmount(pair.liquidityToken, JSBI.BigInt(lpBalanceStr));

        const totalSupply = new TokenAmount(pair.liquidityToken, await this.getTokenTotalSupply(pair.liquidityToken.address));

        const liquidityValueA = pair &&
        totalSupply &&
        userLiquidity &&
        pair.token0 && new TokenAmount(pair.token0, pair.getLiquidityValue(pair.token0, totalSupply, userLiquidity, false).raw);

        const liquidityValueB = pair &&
        totalSupply &&
        userLiquidity &&
        pair.token1 && new TokenAmount(pair.token1, pair.getLiquidityValue(pair.token1, totalSupply, userLiquidity, false).raw);

        const percentToRemove = new Percent(JSBI.BigInt(liquidityValue), userLiquidity.raw);

        const parsedAmounts = {
            LIQUIDITY_PERCENT: percentToRemove,
            [pair.liquidityToken.address]: new TokenAmount(userLiquidity.token, percentToRemove.multiply(userLiquidity.raw).quotient),
            [pair.token0.address]: new TokenAmount(pair.token0, percentToRemove.multiply(liquidityValueA.raw).quotient),
            [pair.token1.address]: new TokenAmount(pair.token1, percentToRemove.multiply(liquidityValueB.raw).quotient),
        }

        return { pair, parsedAmounts }
    }

    /**
     * Adds liquidity to an ERC-20⇄ERC-20 pool
     * 
     * msg.sender should have already given the router an allowance of at least amount on tokenA/tokenB.
     * 
     * Always adds assets at the ideal ratio, according to the price when the transaction is executed.
     * 
     * @param {*} param0 {token: tokenAType, amount: amountA}
     * @param {*} param1 {token: tokenBType, amount: amountB}
     * @param {*} to Recipient of the liquidity tokens.
     * @param {*} slippage The amount the price moves in a trading pair between when a transaction is submitted and when it is executed.
     * @param {*} callback 
     */
    async addUniswapLiquidity({token: tokenAType, amount: amountA}, {token: tokenBType, amount: amountB}, to, slippage = 100, callback = {}) {
        const { pair, parsedAmounts } = await this.getDerivedMintInfo({token: tokenAType, amount: amountA}, {token: tokenBType, amount: amountB});

        if(!pair || !pair.token0.address || !pair.token1.address) {
            return;
        }

        if(!to) {
            to = await this.getCurrentAccount();    
        }

        const amountsMin = {
            [pair.token0.address]: UniswapUtils.calculateSlippageAmount(parsedAmounts[pair.token0.address].raw, slippage)[0],
            [pair.token1.address]: UniswapUtils.calculateSlippageAmount(parsedAmounts[pair.token1.address].raw, slippage)[0]
        }

        const deadline = Math.floor(Date.now() / 1000) + 60 * 120 // 120 minutes from the current Unix time

        //  https://uniswap.org/docs/v2/smart-contracts/router02/#addliquidity
        return this.triggerContract({
            methodName: 'addLiquidity',
            abiKey: 'uniswapExchange',
            abiString: this.ABIs['uniswapExchange'].abi,
            contractParams: [
                pair.token0.address,
                pair.token1.address,
                parsedAmounts[pair.token0.address].raw.toString(),
                parsedAmounts[pair.token1.address].raw.toString(),
                amountsMin[pair.token0.address].toString(),
                amountsMin[pair.token1.address].toString(),
                to,
                deadline
            ],
            sendParams: {
                value: 0
            }
        }, callback)
    }

    /**
     * Adds liquidity to an ERC-20⇄ETH pool
     * 
     * msg.sender should have already given the router an allowance of at least amount on tokenA/tokenB.
     * 
     * Always adds assets at the ideal ratio, according to the price when the transaction is executed.
     * 
     * Token A or Token B must contains "WETH"
     * 
     * @param {*} param0 {token: tokenAType, amount: amountA}
     * @param {*} param1 {token: tokenBType, amount: amountB}
     * @param {*} to Recipient of the liquidity tokens.
     * @param {*} slippage The amount the price moves in a trading pair between when a transaction is submitted and when it is executed.
     * @param {*} callback 
     */
    async addUniswapETHLiquidity({token: tokenAType, amount: amountA}, {token: tokenBType, amount: amountB}, to, slippage = 100, callback = {}) {
        // const deadline = Math.floor(Date.now() / 1000) + 60 * 120 // 120 minutes from the current Unix time
        //  https://uniswap.org/docs/v2/smart-contracts/router02/#addliquidity

        const WETH = this.wethGetToken();
        const { pair, parsedAmounts } = await this.getDerivedMintInfo({token: tokenAType, amount: amountA}, {token: tokenBType, amount: amountB});

        if(!pair || !pair.token0.address || !pair.token1.address) {
            return;
        }

        if(!to) {
            to = await this.getCurrentAccount();    
        }

        const amountsMin = {
            [pair.token0.address]: UniswapUtils.calculateSlippageAmount(parsedAmounts[pair.token0.address].raw, slippage)[0],
            [pair.token1.address]: UniswapUtils.calculateSlippageAmount(parsedAmounts[pair.token1.address].raw, slippage)[0]
        }

        const erc20Token = pair.token0.address.toLowerCase() === WETH.address?.toLowerCase() ? pair.token1 : pair.token0;

        const deadline = Math.floor(Date.now() / 1000) + 60 * 120 // 120 minutes from the current Unix time

        // contract:
        // function addLiquidityETH(
        //     address token,
        //     uint amountTokenDesired,
        //     uint amountTokenMin,
        //     uint amountETHMin,
        //     address to,
        //     uint deadline
        //   ) external payable returns (uint amountToken, uint amountETH, uint liquidity);

        return this.triggerContract({
            methodName: 'addLiquidityETH',
            abiKey: 'uniswapExchange',
            abiString: this.ABIs['uniswapExchange'].abi,
            contractParams: [
                erc20Token.address,
                parsedAmounts[erc20Token.address].raw.toString(),
                amountsMin[erc20Token.address].toString(),
                amountsMin[WETH.address].toString(),
                to,
                deadline
            ],
            sendParams: {
                value: parsedAmounts[WETH.address].raw.toString()
            }
        }, callback)
    }

    /**
     * Removes liquidity from an ERC-20⇄ERC-20 pool.
     * 
     * msg.sender should have already given the router an allowance of at least liquidity on the pool.
     * 
     * @param {*} tokenAType A pool token.
     * @param {*} tokenBType A pool token.
     * @param {*} liquidityValue The value of liquidity tokens to remove.
     * @param {*} to Recipient of the underlying assets.
     * @param {*} slippage The amount the price moves in a trading pair between when a transaction is submitted and when it is executed.
     * @param {*} callback 
     */
    async removeUniswapLiquidity(tokenAType, tokenBType, liquidityValue, to, slippage = 100, callback = {}) {
        if(!to) {
            to = await this.getCurrentAccount();    
        }

        const { pair, parsedAmounts } = await this.getDerivedBurnInfo(tokenAType, tokenBType, liquidityValue, to);

        if(!pair || !pair.token0.address || !pair.token1.address) {
            return;
        }

        const amountsMin = {
            [pair.token0.address]: UniswapUtils.calculateSlippageAmount(parsedAmounts[pair.token0.address].raw, slippage)[0],
            [pair.token1.address]: UniswapUtils.calculateSlippageAmount(parsedAmounts[pair.token1.address].raw, slippage)[0]
        }

        const deadline = Math.floor(Date.now() / 1000) + 60 * 120 // 20 minutes from the current Unix time

        // https://uniswap.org/docs/v2/smart-contracts/router02/#removeliquidity
        return this.triggerContract({
            methodName: 'removeLiquidity',
            abiKey: 'uniswapExchange',
            abiString: this.ABIs['uniswapExchange'].abi,
            contractParams: [
                pair.token0.address,
                pair.token1.address,
                parsedAmounts[pair.liquidityToken.address].raw.toString(),
                amountsMin[pair.token0.address].toString(),
                amountsMin[pair.token1.address].toString(),
                to,
                deadline
            ],
            sendParams: {
                value: 0
            }
        }, callback)
    }

    /**
     * Removes liquidity from an ERC-20⇄ETH pool.
     * 
     * msg.sender should have already given the router an allowance of at least liquidity on the pool.
     * 
     * Token A or Token B must contains "WETH"
     * 
     * @param {*} tokenAType A pool token.
     * @param {*} tokenBType A pool token.
     * @param {*} liquidityValue The value of liquidity tokens to remove.
     * @param {*} to Recipient of the underlying assets.
     * @param {*} slippage The amount the price moves in a trading pair between when a transaction is submitted and when it is executed.
     * @param {*} callback 
     */
    async removeUniswapETHLiquidity(tokenAType, tokenBType, liquidityValue, to, slippage = 100, callback = {}) {
        if(!to) {
            to = await this.getCurrentAccount();    
        }

        const { pair, parsedAmounts } = await this.getDerivedBurnInfo(tokenAType, tokenBType, liquidityValue, to);
        const WETH = this.wethGetToken();

        if(!pair || !pair.token0.address || !pair.token1.address) {
            return;
        }

        const amountsMin = {
            [pair.token0.address]: UniswapUtils.calculateSlippageAmount(parsedAmounts[pair.token0.address].raw, slippage)[0],
            [pair.token1.address]: UniswapUtils.calculateSlippageAmount(parsedAmounts[pair.token1.address].raw, slippage)[0]
        }

        const erc20Token = pair.token0.address === WETH ? pair.token1 : pair.token0;

        const deadline = Math.floor(Date.now() / 1000) + 60 * 120 // 20 minutes from the current Unix time

        console.log([
            erc20Token.address,
            parsedAmounts[pair.liquidityToken.address].raw.toString(),
            amountsMin[erc20Token.address].toString(),
            amountsMin[WETH.address].toString(),
            to,
            deadline
        ])

        // https://uniswap.org/docs/v2/smart-contracts/router02/#removeliquidity
        // function removeLiquidityETH(
        //     address token,
        //     uint liquidity,
        //     uint amountTokenMin,
        //     uint amountETHMin,
        //     address to,
        //     uint deadline
        //   ) external returns (uint amountToken, uint amountETH);
        return this.triggerContract({
            methodName: 'removeLiquidityETH',
            abiKey: 'uniswapExchange',
            abiString: this.ABIs['uniswapExchange'].abi,
            contractParams: [
                erc20Token.address,
                parsedAmounts[pair.liquidityToken.address].raw.toString(),
                amountsMin[erc20Token.address].toString(),
                amountsMin[WETH.address].toString(),
                to,
                deadline
            ],
            sendParams: {
                value: 0
            }
        }, callback)
    }

    /**
     * Use nft and elements or LP tokens in the furnace formula to the props.
     * @param {*} formulaIndex Formula for props - https://github.com/evolutionlandorg/furnace/blob/dev/src/Formula.sol
     * @param {*} majorTokenId ERC721 token Id
     * @param {*} minorTokenAddress Elements or LP tokens contract address
     * @param {*} callback callback
     */
    enchantFurnanceProps( formulaIndex, majorTokenId, minorTokenAddress, callback = {}) {
        return this.triggerContract({
            methodName: 'enchant',
            abiKey: 'furnaceItemBase',
            abiString: this.ABIs['furnaceItemBase'].abi,
            contractParams: [
                formulaIndex,
                majorTokenId,
                minorTokenAddress
            ],
            sendParams: {
                value: 0
            }
        }, callback)
    }

    /**
     * Disenchant furnace props, and will get elements or LP and nft
     * @param {*} propsTokenId Token Id of the Props
     * @param {*} depth Supports one-time decomposition of high-level props. If a prop is in the second level, it needs to be restored to its original state, and the depth needs to be passed in 2
     * @param {*} callback 
     */
    disenchantFurnanceProps( propsTokenId, depth, callback = {}) {
        return this.triggerContract({
            methodName: 'disenchant',
            abiKey: 'furnaceItemBase',
            abiString: this.ABIs['furnaceItemBase'].abi,
            contractParams: [
                propsTokenId,
                depth
            ],
            sendParams: {
                value: 0
            }
        }, callback)
    }

    /**
     * Transfers the ownership of an NFT from one address to another address
     * @param {*} from The current owner of the NFT
     * @param {*} to The new owner
     * @param {*} tokenId The NFT to transfer
     * @param {*} callback 
     */
    safeTransferFromEvoErc721(from, to, tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'safeTransferFrom',
            abiKey: 'objectOwnership',
            abiString: this.ABIs['erc721'].abi,
            contractParams: [
                from,
                to,
                tokenId
            ]
        }, callback)
    }

    /**
     * Equip function, A NFT can equip to EVO Bar (LandBar or ApostleBar).
     * @param {*} tokenId Land token Id which to be quiped.
     * @param {*} resource Which resouce appply to.
     * @param {*} index Index of the Bar.
     * @param {*} token Props token address which to quip.
     * @param {*} id Props token Id which to quip.
     * @param {*} callabck 
     */
    equipLandResource(tokenId, resource, index, token, id, callback = {}) {
        const resourceAddress = this.getContractAddress(resource);

        return this.triggerContract({
            methodName: 'equip',
            abiKey: 'apostleLandResource',
            abiString: this.ABIs['apostleLandResource'].abi,
            contractParams: [
                tokenId, resourceAddress, index, token, id
            ]
        }, callback) 
    }

    /**
     * Divest the props on the index slot on the tokenid land
     * @param {*} tokenId The tokenId of land
     * @param {*} index The index slot
     * @param {*} callback 
     */
    divestLandProps(tokenId, index, callback = {}) {
        return this.triggerContract({
            methodName: 'divest',
            abiKey: 'apostleLandResource',
            abiString: this.ABIs['apostleLandResource'].abi,
            contractParams: [
                tokenId, index
            ]
        }, callback) 
    }

    /**
     *  claim resource on the Land
     * @param tokenAddress The nft of props contract address
     * @param tokenId Land token Id
     * @returns {Promise<PromiEvent<any>>}
     */
    claimFurnaceItemResource(tokenAddress, tokenId, callback = {}) {
        return this.triggerContract({
            methodName: 'claimItemResource',
            abiKey: 'apostleLandResource',
            abiString: this.ABIs['apostleLandResource'].abi,
            contractParams: [tokenAddress, Utils.pad0x(tokenId)],
        }, callback)
    }

    /**
     * Get the amount of resources available.
     * @param {*} ContractTokenAddress  The contract address of props.
     * @param {*} tokenId The token id of props.
     * @param {*} resources The contract address of resources.
     * @param {*} callback 
     */
    getAvailableFurnaceItemResources(ContractTokenAddress, tokenId, resources, callback={}) {
        return this.callContract({
            methodName: 'availableItemResources',
            abiKey: 'apostleLandResource',
            abiString: this.ABIs['apostleLandResource'].abi,
            contractParams: [ContractTokenAddress, Utils.pad0x(tokenId), resources],
        }, callback)
    }

    /**
     * Get the Land Id where the item is located
     * @param {*} ContractTokenAddress The nft token contract address
     * @param {*} tokenId The token Id of nft
     * @param {*} callback 
     */
    getLandIdByFurnaceItem(ContractTokenAddress, tokenId, callback={}) {
        return this.callContract({
            methodName: 'getLandIdByItem',
            abiKey: 'apostleLandResource',
            abiString: this.ABIs['apostleLandResource'].abi,
            contractParams: [ContractTokenAddress, Utils.pad0x(tokenId)],
        }, callback)
    }

    /**
     * Get the amount of resources that the props can be mined daily.
     * @param {*} landTokenId The token Id of land.
     * @param {*} resourceAddress Resource contract address.
     * @param {*} slotIndex The index of land slot.
     * @param {*} callback 
     */
    getLandBarMiningStrength(landTokenId, resourceAddress, slotIndex, callback={}) {
        return this.callContract({
            methodName: 'getBarMiningStrength',
            abiKey: 'apostleLandResource',
            abiString: this.ABIs['apostleLandResource'].abi,
            contractParams: [Utils.pad0x(landTokenId), resourceAddress, slotIndex],
        }, callback)
    }

    /**
     * Swap CRING of the Crab Network to wrapped CRING.
     * @param {*} value Amount of CRING.
     * @param {*} callback 
     */
    swapRingToWring(value, callback={}) {
        return this.triggerContract({
            methodName: 'deposit',
            abiKey: 'ring',
            abiString: this.ABIs['ring'].abi,
            contractParams: [
            ],
            sendParams: {
                value: value
            }
        }, callback)
    }

    /**
     * Swap wrapped CRING to native token of the Crab Network.
     * @param {*} value Amount of WCRING.
     * @param {*} callback 
     */
    swapWringToRing(value, callback={}) {
        return this.triggerContract({
            methodName: 'withdraw',
            abiKey: 'ring',
            abiString: this.ABIs['ring'].abi,
            contractParams: [
                value
            ]
        }, callback)
    }

    estimateGas(method, address, value = 0) {
        if (!this._web3js) return;
        return (method || this._web3js.eth).estimateGas({ from: address, value });
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

Object.assign(HecoEvolutionLand.prototype, WethApi);
Object.assign(HecoEvolutionLand.prototype, LiquidityStakerApi);
Object.assign(HecoEvolutionLand.prototype, Erc20Api);
Object.assign(HecoEvolutionLand.prototype, ApostleApi);
Object.assign(HecoEvolutionLand.prototype, FurnaceApi);
Object.assign(HecoEvolutionLand.prototype, LandApi);
Object.assign(HecoEvolutionLand.prototype, GoldrushApi);
Object.assign(HecoEvolutionLand.prototype, DrillApi);
Object.assign(HecoEvolutionLand.prototype, PveApi);

export default HecoEvolutionLand