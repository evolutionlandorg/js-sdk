import { ethers } from "ethers";
import type { EnvType } from "@evo/env/types";

import bancorABI from "./json/abi-bancor.json";
import actionABI from "./json/abi-auction.json";
import ringABI from "./json/abi-ring.json";
import ktonABI from "./json/abi-kton.json";
import withdrawABI from "./json/abi-withdraw.json";
import bankABI from "./json/abi-bank.json";

import landABI from "./json/abi-land.json";
import lotteryABI from "./json/abi-lottery.json";
import rolesUpdaterABI from "./json/abi-rolesUpdater.json";
import landResourceABI from "./json/abi-landResource.json";
import landResourceV2ABI from "./json/abi-landResourceV2.json";
import apostleAuctionABI from "./json/abi-apostleAuction.json";
import apostleTakeBackABI from "./json/abi-takeBack.json";
import apostleSiringABI from "./json/abi-apostleSiring.json";
import apostleBaseABI from "./json/abi-apostleBase.json";
import tokenUseABI from "./json/abi-tokenUse.json";
import petBaseABI from "./json/abi-petbase.json";
import uniswapExchangeABI from "./json/abi-uniswapExchangeV2.json";
import swapBridgeABI from "./json/abi-swapBridge.json";
import luckybagABI from "./json/abi-luckyBag.json";
import itemTreasureABI from "./json/abi-itemTreasure.json";
import itemTakeBackABI from "./json/abi-itemTakeBack.json";
import redPackageABI from "./json/abi-redPackage.json";
import furnaceItemBaseABI from "./json/abi-furnaceItemBase.json";
import erc721ABI from "./json/abi-ERC721.json";
import gegoTokenABI from "./json/abi-gegoToken.json";
import goldRushRaffleABI from "./json/abi-goldRushRaffle.json";
import liquidityStakerABI from "./json/abi-liquidityStaker.json";
import liquidityStakerFactoryABI from "./json/abi-liquidityStakerFactory.json";
import erc1155ABI from "./json/abi-ERC1155.json";
import clockAuctionV3ABI from "./json/abi-clockAuctionV3.json";
import apostleAuctionV3ABI from "./json/abi-apostleAuctionV3.json";
import apostleBaseV3ABI from "./json/abi-apostleBaseV3.json";
import apostleSiringV3ABI from "./json/abi-apostleSiringV3.json";
import tokenUseV2ABI from "./json/abi-tokenUseV2.json";
import drillLuckyBoxV2ABI from "./json/abi-drillLuckyBoxV2.json";
import erc721BridgeV2ABI from "./json/abi-ERC721BridgeV2.json";
import cryptoKitties from "./json/abi-cryptoKitties.json";
import pveTeamABI from "./json/abi-pveTeam.json";

type ContractType = {
  address?: string;
  abi?: ethers.ContractInterface;
};

type ContractsType = {
  [contract: string]: ContractType;
};

export const getContractsAddressAndABI = (env: EnvType): ContractsType => {
  return {
    ring: {
      address: env.CONTRACT_ADDRESS.TOKEN_RING,
      abi: ringABI,
    },
    withdraw: {
      address: env.CONTRACT_ADDRESS.TOKEN_WITHDRAW,
      abi: withdrawABI,
    },
    withdrawKton: {
      address: env.CONTRACT_ADDRESS.TOKEN_WITHDRAW_KTON,
      abi: withdrawABI,
    },
    auction: {
      address: env.CONTRACT_ADDRESS.TOKEN_AUCTION,
      abi: actionABI,
    },
    landClockAuction: {
      address: env.CONTRACT_ADDRESS.TOKEN_AUCTION,
      abi: actionABI,
    },
    landClockAuctionV3: {
      address: env.CONTRACT_ADDRESS.TOKEN_AUCTION,
      abi: clockAuctionV3ABI,
    },
    land: {
      address: env.CONTRACT_ADDRESS.TOKEN_LAND,
      abi: landABI,
    },
    objectOwnership: {
      address: env.CONTRACT_ADDRESS.TOKEN_LAND,
      abi: landABI,
    },
    luckybag: {
      address: env.CONTRACT_ADDRESS.TOKEN_LUCKYBAG,
      abi: luckybagABI,
    },
    redPackage: {
      address: env.CONTRACT_ADDRESS.TOKEN_REDPACKAGE,
      abi: redPackageABI,
    },
    bancor: {
      address: env.CONTRACT_ADDRESS.TOKEN_BANCOR,
      abi: bancorABI,
    },
    bank: {
      address: env.CONTRACT_ADDRESS.TOKEN_BANK,
      abi: bankABI,
    },
    kton: {
      address: env.CONTRACT_ADDRESS.TOKEN_KTON,
      abi: ktonABI,
    },
    lottery: {
      address: env.CONTRACT_ADDRESS.TOKEN_LOTTERY,
      abi: lotteryABI,
    },
    rolesUpdater: {
      address: env.CONTRACT_ADDRESS.TOKEN_ROLES_UPDATER,
      abi: rolesUpdaterABI,
    },
    apostleBase: {
      address: env.CONTRACT_ADDRESS.TOKEN_APOSTLE_BASE,
      abi: apostleBaseABI,
    },
    apostleBaseV3: {
      abi: apostleBaseV3ABI,
    },
    apostleAuction: {
      address: env.CONTRACT_ADDRESS.TOKEN_APOSTLE_CLOCK_AUCTION,
      abi: apostleAuctionABI,
    },
    apostleAuctionV3: {
      abi: apostleAuctionV3ABI,
    },
    apostleSiringAuction: {
      address: env.CONTRACT_ADDRESS.TOKEN_APOSTLE_SIRING_AUCTION,
      abi: apostleSiringABI,
    },
    apostleSiringAuctionV3: {
      abi: apostleSiringV3ABI,
    },
    apostleLandResource: {
      address: env.CONTRACT_ADDRESS.TOKEN_LAND_RESOURCE,
      abi: landResourceABI,
    },
    apostleLandResourceV2: {
      abi: landResourceV2ABI,
    },
    apostleTokenUse: {
      address: env.CONTRACT_ADDRESS.TOKEN_TOKEN_USE,
      abi: tokenUseABI,
    },
    apostleTokenUseV2: {
      abi: tokenUseV2ABI,
    },
    apostleTakeBack: {
      address: env.CONTRACT_ADDRESS.TOKEN_APOSTLE_TAKE_BACK,
      abi: apostleTakeBackABI,
    },
    petBase: {
      address: env.CONTRACT_ADDRESS.TOKEN_PET_BASE,
      abi: petBaseABI,
    },
    gold: {
      address: env.CONTRACT_ADDRESS.TOKEN_ELEMENT_GOLD,
      abi: ringABI,
    },
    wood: {
      address: env.CONTRACT_ADDRESS.TOKEN_ELEMENT_WOOD,
      abi: ringABI,
    },
    water: {
      address: env.CONTRACT_ADDRESS.TOKEN_ELEMENT_WATER,
      abi: ringABI,
    },
    fire: {
      address: env.CONTRACT_ADDRESS.TOKEN_ELEMENT_FIRE,
      abi: ringABI,
    },
    soil: {
      address: env.CONTRACT_ADDRESS.TOKEN_ELEMENT_SOIL,
      abi: ringABI,
    },
    uniswapExchange: {
      address: env.CONTRACT_ADDRESS.UNISWAP_EXCHANGE,
      abi: uniswapExchangeABI,
    },
    swapBridge: {
      address: env.CONTRACT_ADDRESS.TOKEN_DEX_BRIDGE,
      abi: swapBridgeABI,
    },
    itemTreasure: {
      address: env.CONTRACT_ADDRESS.FURNACE_TREASURE,
      abi: itemTreasureABI,
    },
    drillLuckyBoxV2: {
      abi: drillLuckyBoxV2ABI,
    },
    itemTakeBack: {
      address: env.CONTRACT_ADDRESS.FURNACE_TAKEBACK,
      abi: itemTakeBackABI,
    },
    itemBase: {
      address: env.CONTRACT_ADDRESS.FURNACE_ITEMBASE,
      abi: furnaceItemBaseABI,
    },
    furnaceItemBase: {
      address: env.CONTRACT_ADDRESS.FURNACE_ITEMBASE,
      abi: furnaceItemBaseABI,
    },
    erc721: {
      abi: erc721ABI,
    },
    gego: {
      address: env.CONTRACT_ADDRESS.TOKEN_GEGO,
      abi: gegoTokenABI,
    },
    goldRushRaffle: {
      address: env.CONTRACT_ADDRESS.GOLD_RUSH_RAFFLE,
      abi: goldRushRaffleABI,
    },
    liquidityStaker: {
      abi: liquidityStakerABI,
    },
    liquidityStakerFactory: {
      address: env.CONTRACT_ADDRESS.LIQUIDITY_STAKER_FACTORY,
      abi: liquidityStakerFactoryABI,
    },
    petCryptoKitties: {
      address: env.CONTRACT_ADDRESS.TOKEN_KITTY_CORE,
      abi: cryptoKitties,
    },
    petPolkaPets: {
      address: env.CONTRACT_ADDRESS.TOKEN_POLKAPETS,
      abi: erc1155ABI,
    },
    petBridge: {
      address: env.CONTRACT_ADDRESS.PET_BRIDGE,
      abi: erc721BridgeV2ABI,
    },
    weth: {
      address: env.CONTRACT_ADDRESS.TOKEN_WETH,
    },
    pveTeam: {
      abi: pveTeamABI,
      address: env.CONTRACT_ADDRESS.PVETEAM_PROXY,
    },
  };
};
