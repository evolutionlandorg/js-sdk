import { Env } from "./index";

import bancorABI from "./json/abi-bancor";
import actionABI from "./json/abi-auction";
import ringABI from "./json/abi-ring";
import ktonABI from "./json/abi-kton";
import withdrawABI from "./json/abi-withdraw";
import bankABI from "./json/abi-bank";

import landABI from "./json/abi-land";
import lotteryABI from "./json/abi-lottery";
import rolesUpdaterABI from "./json/abi-rolesUpdater";
import landResourceABI from "./json/abi-landResource";
import apostleAuctionABI from "./json/abi-apostleAuction";
import apostleTakeBackABI from "./json/abi-takeBack";
import apostleSiringABI from "./json/abi-apostleSiring";
import apostleBaseABI from "./json/abi-apostleBase";
import tokenUseABI from "./json/abi-tokenUse";
import petBaseABI from "./json/abi-petbase";
import uniswapExchangeABI from "./json/abi-uniswapExchangeV2";
import swapBridgeABI from "./json/abi-swapBridge";
import luckybagABI from "./json/abi-luckyBag";
import itemTreasureABI from "./json/abi-itemTreasure";
import itemTakeBackABI from "./json/abi-itemTakeBack";
import redPackageABI from "./json/abi-redPackage";
import furnaceItemBaseABI from "./json/abi-furnaceItemBase";
import erc721ABI from "./json/abi-ERC721";
import gegoTokenABI from "./json/abi-gegoToken";
import goldRushRaffleABI from "./json/abi-goldRushRaffle";
import liquidityStakerABI from "./json/abi-liquidityStaker";
import liquidityStakerFactoryABI from "./json/abi-liquidityStakerFactory";
import erc1155ABI from "./json/abi-ERC1155";
import clockAuctionV3ABI from "./json/abi-clockAuctionV3";
import apostleAuctionV3ABI from "./json/abi-apostleAuctionV3";
import apostleBaseV3ABI from "./json/abi-apostleBaseV3";
import apostleSiringV3ABI from "./json/abi-apostleSiringV3";
import tokenUseV2ABI from "./json/abi-tokenUseV2";
import drillLuckyBoxV2ABI from "./json/abi-drillLuckyBoxV2";
import erc721BridgeV2ABI from "./json/abi-ERC721BridgeV2";
import cryptoKitties from "./json/abi-cryptoKitties";

function getABI(env) {
  return {
    ring: {
      address: env.CONTRACT.TOKEN_RING,
      abi: ringABI,
    },
    withdraw: {
      address: env.CONTRACT.TOKEN_WITHDRAW,
      abi: withdrawABI,
    },
    withdrawKton: {
      address: env.CONTRACT.TOKEN_WITHDRAW_KTON,
      abi: withdrawABI,
    },
    auction: {
      address: env.CONTRACT.TOKEN_AUCTION,
      abi: actionABI,
    },
    landClockAuction: {
      address: env.CONTRACT.TOKEN_AUCTION,
      abi: actionABI,
    },
    landClockAuctionV3: {
      abi: clockAuctionV3ABI,
    },
    land: {
      address: env.CONTRACT.TOKEN_LAND,
      abi: landABI,
    },
    objectOwnership: {
      address: env.CONTRACT.TOKEN_LAND,
      abi: landABI,
    },
    luckybag: {
      address: env.CONTRACT.TOKEN_LUCKYBAG,
      abi: luckybagABI,
    },
    redPackage: {
      address: env.CONTRACT.TOKEN_REDPACKAGE,
      abi: redPackageABI,
    },
    bancor: {
      address: env.CONTRACT.TOKEN_BANCOR,
      abi: bancorABI,
    },
    bank: {
      address: env.CONTRACT.TOKEN_BANK,
      abi: bankABI,
    },
    kton: {
      address: env.CONTRACT.TOKEN_KTON,
      abi: ktonABI,
    },
    lottery: {
      address: env.CONTRACT.TOKEN_LOTTERY,
      abi: lotteryABI,
    },
    rolesUpdater: {
      address: env.CONTRACT.TOKEN_ROLES_UPDATER,
      abi: rolesUpdaterABI,
    },
    apostleBase: {
      address: env.CONTRACT.TOKEN_APOSTLE_BASE,
      abi: apostleBaseABI,
    },
    apostleBaseV3: {
      abi: apostleBaseV3ABI,
    },
    apostleAuction: {
      address: env.CONTRACT.TOKEN_APOSTLE_CLOCK_AUCTION,
      abi: apostleAuctionABI,
    },
    apostleAuctionV3: {
      abi: apostleAuctionV3ABI,
    },
    apostleSiringAuction: {
      address: env.CONTRACT.TOKEN_APOSTLE_SIRING_AUCTION,
      abi: apostleSiringABI,
    },
    apostleSiringAuctionV3: {
      abi: apostleSiringV3ABI,
    },
    apostleLandResource: {
      address: env.CONTRACT.TOKEN_LAND_RESOURCE,
      abi: landResourceABI,
    },
    apostleTokenUse: {
      address: env.CONTRACT.TOKEN_TOKEN_USE,
      abi: tokenUseABI,
    },
    apostleTokenUseV2: {
      abi: tokenUseV2ABI,
    },
    apostleTakeBack: {
      address: env.CONTRACT.TOKEN_APOSTLE_TAKE_BACK,
      abi: apostleTakeBackABI,
    },
    petBase: {
      address: env.CONTRACT.TOKEN_PET_BASE,
      abi: petBaseABI,
    },
    gold: {
      address: env.CONTRACT.TOKEN_ELEMENT_GOLD,
      abi: ringABI,
    },
    wood: {
      address: env.CONTRACT.TOKEN_ELEMENT_WOOD,
      abi: ringABI,
    },
    water: {
      address: env.CONTRACT.TOKEN_ELEMENT_WATER,
      abi: ringABI,
    },
    fire: {
      address: env.CONTRACT.TOKEN_ELEMENT_FIRE,
      abi: ringABI,
    },
    soil: {
      address: env.CONTRACT.TOKEN_ELEMENT_SOIL,
      abi: ringABI,
    },
    uniswapExchange: {
      address: env.CONTRACT.UNISWAP_EXCHANGE,
      abi: uniswapExchangeABI,
    },
    swapBridge: {
      address: env.CONTRACT.TOKEN_DEX_BRIDGE,
      abi: swapBridgeABI,
    },
    itemTreasure: {
      address: env.CONTRACT.FURNACE_TREASURE,
      abi: itemTreasureABI,
    },
    drillLuckyBoxV2: {
      abi: drillLuckyBoxV2ABI,
    },
    itemTakeBack: {
      address: env.CONTRACT.FURNACE_TAKEBACK,
      abi: itemTakeBackABI,
    },
    itemBase: {
      address: env.CONTRACT.FURNACE_ITEMBASE,
      abi: furnaceItemBaseABI,
    },
    furnaceItemBase: {
      address: env.CONTRACT.FURNACE_ITEMBASE,
      abi: furnaceItemBaseABI,
    },
    erc721: {
      abi: erc721ABI,
    },
    gego: {
      address: env.CONTRACT.TOKEN_GEGO,
      abi: gegoTokenABI,
    },
    goldRushRaffle: {
      address: env.CONTRACT.GOLD_RUSH_RAFFLE,
      abi: goldRushRaffleABI,
    },
    liquidityStaker: {
      abi: liquidityStakerABI,
    },
    liquidityStakerFactory: {
      address: env.CONTRACT.LIQUIDITY_STAKER_FACTORY,
      abi: liquidityStakerFactoryABI,
    },
    petCryptoKitties: {
      address: env.CONTRACT.TOKEN_KITTY_CORE,
      abi: cryptoKitties,
    },
    petPolkaPets: {
      address: env.CONTRACT.TOKEN_POLKAPETS,
      abi: erc1155ABI,
    },
    petBridge: {
      address: env.CONTRACT.PET_BRIDGE,
      abi: erc721BridgeV2ABI,
    },
  };
}

export { getABI };
