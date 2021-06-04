"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getABI = getABI;

var _index = require("./index");

var _abiBancor = _interopRequireDefault(require("./json/abi-bancor"));

var _abiAuction = _interopRequireDefault(require("./json/abi-auction"));

var _abiRing = _interopRequireDefault(require("./json/abi-ring"));

var _abiKton = _interopRequireDefault(require("./json/abi-kton"));

var _abiWithdraw = _interopRequireDefault(require("./json/abi-withdraw"));

var _abiBank = _interopRequireDefault(require("./json/abi-bank"));

var _abiLand = _interopRequireDefault(require("./json/abi-land"));

var _abiLottery = _interopRequireDefault(require("./json/abi-lottery"));

var _abiRolesUpdater = _interopRequireDefault(require("./json/abi-rolesUpdater"));

var _abiLandResource = _interopRequireDefault(require("./json/abi-landResource"));

var _abiApostleAuction = _interopRequireDefault(require("./json/abi-apostleAuction"));

var _abiTakeBack = _interopRequireDefault(require("./json/abi-takeBack"));

var _abiApostleSiring = _interopRequireDefault(require("./json/abi-apostleSiring"));

var _abiApostleBase = _interopRequireDefault(require("./json/abi-apostleBase"));

var _abiTokenUse = _interopRequireDefault(require("./json/abi-tokenUse"));

var _abiPetbase = _interopRequireDefault(require("./json/abi-petbase"));

var _abiUniswapExchangeV = _interopRequireDefault(require("./json/abi-uniswapExchangeV2"));

var _abiSwapBridge = _interopRequireDefault(require("./json/abi-swapBridge"));

var _abiLuckyBag = _interopRequireDefault(require("./json/abi-luckyBag"));

var _abiItemTreasure = _interopRequireDefault(require("./json/abi-itemTreasure"));

var _abiItemTakeBack = _interopRequireDefault(require("./json/abi-itemTakeBack"));

var _abiRedPackage = _interopRequireDefault(require("./json/abi-redPackage"));

var _abiFurnaceItemBase = _interopRequireDefault(require("./json/abi-furnaceItemBase"));

var _abiERC = _interopRequireDefault(require("./json/abi-ERC721"));

var _abiGegoToken = _interopRequireDefault(require("./json/abi-gegoToken"));

var _abiGoldRushRaffle = _interopRequireDefault(require("./json/abi-goldRushRaffle"));

var _abiLiquidityStaker = _interopRequireDefault(require("./json/abi-liquidityStaker"));

var _abiLiquidityStakerFactory = _interopRequireDefault(require("./json/abi-liquidityStakerFactory"));

var _abiERC2 = _interopRequireDefault(require("./json/abi-ERC1155"));

var _abiClockAuctionV = _interopRequireDefault(require("./json/abi-clockAuctionV3"));

var _abiApostleAuctionV = _interopRequireDefault(require("./json/abi-apostleAuctionV3"));

var _abiApostleBaseV = _interopRequireDefault(require("./json/abi-apostleBaseV3"));

var _abiApostleSiringV = _interopRequireDefault(require("./json/abi-apostleSiringV3"));

var _abiTokenUseV = _interopRequireDefault(require("./json/abi-tokenUseV2"));

var _abiDrillLuckyBoxV = _interopRequireDefault(require("./json/abi-drillLuckyBoxV2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getABI(env) {
  return {
    ring: {
      address: env.CONTRACT.TOKEN_RING,
      abi: _abiRing["default"]
    },
    withdraw: {
      address: env.CONTRACT.TOKEN_WITHDRAW,
      abi: _abiWithdraw["default"]
    },
    withdrawKton: {
      address: env.CONTRACT.TOKEN_WITHDRAW_KTON,
      abi: _abiWithdraw["default"]
    },
    auction: {
      address: env.CONTRACT.TOKEN_AUCTION,
      abi: _abiAuction["default"]
    },
    landClockAuction: {
      address: env.CONTRACT.TOKEN_AUCTION,
      abi: _abiAuction["default"]
    },
    landClockAuctionV3: {
      abi: _abiClockAuctionV["default"]
    },
    land: {
      address: env.CONTRACT.TOKEN_LAND,
      abi: _abiLand["default"]
    },
    objectOwnership: {
      address: env.CONTRACT.TOKEN_LAND,
      abi: _abiLand["default"]
    },
    luckybag: {
      address: env.CONTRACT.TOKEN_LUCKYBAG,
      abi: _abiLuckyBag["default"]
    },
    redPackage: {
      address: env.CONTRACT.TOKEN_REDPACKAGE,
      abi: _abiRedPackage["default"]
    },
    bancor: {
      address: env.CONTRACT.TOKEN_BANCOR,
      abi: _abiBancor["default"]
    },
    bank: {
      address: env.CONTRACT.TOKEN_BANK,
      abi: _abiBank["default"]
    },
    kton: {
      address: env.CONTRACT.TOKEN_KTON,
      abi: _abiKton["default"]
    },
    lottery: {
      address: env.CONTRACT.TOKEN_LOTTERY,
      abi: _abiLottery["default"]
    },
    rolesUpdater: {
      address: env.CONTRACT.TOKEN_ROLES_UPDATER,
      abi: _abiRolesUpdater["default"]
    },
    apostleBase: {
      address: env.CONTRACT.TOKEN_APOSTLE_BASE,
      abi: _abiApostleBase["default"]
    },
    apostleBaseV3: {
      abi: _abiApostleBaseV["default"]
    },
    apostleAuction: {
      address: env.CONTRACT.TOKEN_APOSTLE_CLOCK_AUCTION,
      abi: _abiApostleAuction["default"]
    },
    apostleAuctionV3: {
      abi: _abiApostleAuctionV["default"]
    },
    apostleSiringAuction: {
      address: env.CONTRACT.TOKEN_APOSTLE_SIRING_AUCTION,
      abi: _abiApostleSiring["default"]
    },
    apostleSiringAuctionV3: {
      abi: _abiApostleSiringV["default"]
    },
    apostleLandResource: {
      address: env.CONTRACT.TOKEN_LAND_RESOURCE,
      abi: _abiLandResource["default"]
    },
    apostleTokenUse: {
      address: env.CONTRACT.TOKEN_TOKEN_USE,
      abi: _abiTokenUse["default"]
    },
    apostleTokenUseV2: {
      abi: _abiTokenUseV["default"]
    },
    apostleTakeBack: {
      address: env.CONTRACT.TOKEN_APOSTLE_TAKE_BACK,
      abi: _abiTakeBack["default"]
    },
    petBase: {
      address: env.CONTRACT.TOKEN_PET_BASE,
      abi: _abiPetbase["default"]
    },
    gold: {
      address: env.CONTRACT.TOKEN_ELEMENT_GOLD,
      abi: _abiRing["default"]
    },
    wood: {
      address: env.CONTRACT.TOKEN_ELEMENT_WOOD,
      abi: _abiRing["default"]
    },
    water: {
      address: env.CONTRACT.TOKEN_ELEMENT_WATER,
      abi: _abiRing["default"]
    },
    fire: {
      address: env.CONTRACT.TOKEN_ELEMENT_FIRE,
      abi: _abiRing["default"]
    },
    soil: {
      address: env.CONTRACT.TOKEN_ELEMENT_SOIL,
      abi: _abiRing["default"]
    },
    uniswapExchange: {
      address: env.CONTRACT.UNISWAP_EXCHANGE,
      abi: _abiUniswapExchangeV["default"]
    },
    swapBridge: {
      address: env.CONTRACT.TOKEN_DEX_BRIDGE,
      abi: _abiSwapBridge["default"]
    },
    itemTreasure: {
      address: env.CONTRACT.FURNACE_TREASURE,
      abi: _abiItemTreasure["default"]
    },
    drillLuckyBoxV2: {
      abi: _abiDrillLuckyBoxV["default"]
    },
    itemTakeBack: {
      address: env.CONTRACT.FURNACE_TAKEBACK,
      abi: _abiItemTakeBack["default"]
    },
    itemBase: {
      address: env.CONTRACT.FURNACE_ITEMBASE,
      abi: _abiFurnaceItemBase["default"]
    },
    furnaceItemBase: {
      address: env.CONTRACT.FURNACE_ITEMBASE,
      abi: _abiFurnaceItemBase["default"]
    },
    erc721: {
      abi: _abiERC["default"]
    },
    gego: {
      address: env.CONTRACT.TOKEN_GEGO,
      abi: _abiGegoToken["default"]
    },
    goldRushRaffle: {
      address: env.CONTRACT.GOLD_RUSH_RAFFLE,
      abi: _abiGoldRushRaffle["default"]
    },
    liquidityStaker: {
      abi: _abiLiquidityStaker["default"]
    },
    liquidityStakerFactory: {
      address: env.CONTRACT.LIQUIDITY_STAKER_FACTORY,
      abi: _abiLiquidityStakerFactory["default"]
    },
    petCryptoKitties: {
      address: env.CONTRACT.TOKEN_KITTY_CORE,
      abi: _abiERC["default"]
    },
    petPolkaPets: {
      address: env.CONTRACT.TOKEN_POLKAPETS,
      abi: _abiERC2["default"]
    }
  };
}