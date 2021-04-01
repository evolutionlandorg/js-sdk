import {Env} from './index'

import bancorABI from './abi/ethereum/abi-bancor'
import actionABI from './abi/ethereum/abi-auction'
import ringABI from './abi/ethereum/abi-wcring'
import ktonABI from './abi/ethereum/abi-wcring'

import withdrawABI from './abi/ethereum/abi-withdraw'
import bankABI from './abi/ethereum/abi-bank'

import landABI from './abi/ethereum/abi-land'
import lotteryABI from './abi/ethereum/abi-lottery'
import rolesUpdaterABI from './abi/ethereum/abi-rolesUpdater'
import landResourceABI from './abi/ethereum/abi-landResource'
import apostleAuctionABI from './abi/ethereum/abi-apostleAuction'
import apostleTakeBackABI from './abi/ethereum/abi-takeBack'
import apostleSiringABI from './abi/ethereum/abi-apostleSiring'
import apostleBaseABI from './abi/ethereum/abi-apostleBase'
import tokenUseABI from './abi/ethereum/abi-tokenUse'
import petBaseABI from './abi/ethereum/abi-petbase'
import uniswapExchangeABI from './abi/ethereum/abi-uniswapExchangeV2'
import swapBridgeABI from './abi/ethereum/abi-swapBridge'
import luckybagABI from './abi/ethereum/abi-luckyBag'
import itemTreasureABI from './abi/ethereum/abi-itemTreasure'
import itemTakeBackABI from './abi/ethereum/abi-itemTakeBack'
import redPackageABI from './abi/ethereum/abi-redPackage'
import furnaceItemBaseABI from './abi/ethereum/abi-furnaceItemBase'
import erc721ABI from './abi/ethereum/abi-ERC721'
import gegoTokenABI from './abi/ethereum/abi-gegoToken'

function getABI(env){
    let _env = Env(env)
    return Object.freeze({
        ring: {
            address: _env.CONTRACT.TOKEN_RING,
            abi: ringABI
        },
        withdraw: {
            address: _env.CONTRACT.TOKEN_WITHDRAW,
            abi: withdrawABI
        },
        withdrawKton: {
            address: _env.CONTRACT.TOKEN_WITHDRAW_KTON,
            abi: withdrawABI
        },
        auction: {
            address: _env.CONTRACT.TOKEN_AUCTION,
            abi: actionABI
        },
        land: {
            address: _env.CONTRACT.TOKEN_LAND,
            abi: landABI
        },
        objectOwnership: {
            address: _env.CONTRACT.TOKEN_LAND,
            abi: landABI
        },
        luckybag: {
            address: _env.CONTRACT.TOKEN_LUCKYBAG,
            abi: luckybagABI
        },
        redPackage: {
            address: _env.CONTRACT.TOKEN_REDPACKAGE,
            abi: redPackageABI
        },
        bancor: {
            address: _env.CONTRACT.TOKEN_BANCOR,
            abi: bancorABI
        },
        bank: {
            address: _env.CONTRACT.TOKEN_BANK,
            abi: bankABI
        },
        kton: {
            address: _env.CONTRACT.TOKEN_KTON,
            abi: ktonABI
        },
        lottery: {
            address: _env.CONTRACT.TOKEN_LOTTERY,
            abi: lotteryABI
        },
        rolesUpdater: {
            address: _env.CONTRACT.TOKEN_ROLES_UPDATER,
            abi: rolesUpdaterABI
        },
        apostleBase: {
            address: _env.CONTRACT.TOKEN_APOSTLE_BASE,
            abi: apostleBaseABI
        },
        apostleAuction: {
            address: _env.CONTRACT.TOKEN_APOSTLE_CLOCK_AUCTION,
            abi: apostleAuctionABI
        },
        apostleSiringAuction: {
            address: _env.CONTRACT.TOKEN_APOSTLE_SIRING_AUCTION,
            abi: apostleSiringABI
        },
        apostleLandResource: {
            address: _env.CONTRACT.TOKEN_LAND_RESOURCE,
            abi: landResourceABI
        },
        apostleTokenUse: {
            address: _env.CONTRACT.TOKEN_TOKEN_USE,
            abi: tokenUseABI
        },
        apostleTakeBack: {
            address: _env.CONTRACT.TOKEN_APOSTLE_TAKE_BACK,
            abi: apostleTakeBackABI
        },
        petBase: {
            address: _env.CONTRACT.TOKEN_PET_BASE,
            abi: petBaseABI
        },
        gold: {
            address: _env.CONTRACT.TOKEN_ELEMENT_GOLD,
            abi: ringABI
        },
        wood: {
            address: _env.CONTRACT.TOKEN_ELEMENT_WOOD,
            abi: ringABI
        },
        water: {
            address: _env.CONTRACT.TOKEN_ELEMENT_WATER,
            abi: ringABI
        },
        fire: {
            address: _env.CONTRACT.TOKEN_ELEMENT_FIRE,
            abi: ringABI
        },
        soil: {
            address: _env.CONTRACT.TOKEN_ELEMENT_SOIL,
            abi: ringABI
        },
        uniswapExchange: {
            address: _env.CONTRACT.UNISWAP_EXCHANGE,
            abi: uniswapExchangeABI
        },
        swapBridge: {
            address: _env.CONTRACT.TOKEN_DEX_BRIDGE,
            abi: swapBridgeABI
        },
        itemTreasure: {
            address: _env.CONTRACT.FURNACE_TREASURE,
            abi: itemTreasureABI
        },
        itemTakeBack: {
            address: _env.CONTRACT.FURNACE_TAKEBACK,
            abi: itemTakeBackABI
        },
        itemBase: {
            address: _env.CONTRACT.FURNACE_ITEMBASE,
            abi: furnaceItemBaseABI
        },
        furnaceItemBase: {
            address: _env.CONTRACT.FURNACE_ITEMBASE,
            abi: furnaceItemBaseABI
        },
        erc721: {
            abi: erc721ABI
        },
        gego: {
            address: _env.CONTRACT.TOKEN_GEGO,
            abi: gegoTokenABI
        }
    });
}

export default getABI
