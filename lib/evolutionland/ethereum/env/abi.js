"use strict";

require("core-js/modules/es.object.freeze.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = require("./index");

var _abiBancor = _interopRequireDefault(require("./abi/ethereum/abi-bancor"));

var _abiAuction = _interopRequireDefault(require("./abi/ethereum/abi-auction"));

var _abiRing = _interopRequireDefault(require("./abi/ethereum/abi-ring"));

var _abiKton = _interopRequireDefault(require("./abi/ethereum/abi-kton"));

var _abiWithdraw = _interopRequireDefault(require("./abi/ethereum/abi-withdraw"));

var _abiBank = _interopRequireDefault(require("./abi/ethereum/abi-bank"));

var _abiLand = _interopRequireDefault(require("./abi/ethereum/abi-land"));

var _abiLottery = _interopRequireDefault(require("./abi/ethereum/abi-lottery"));

var _abiRolesUpdater = _interopRequireDefault(require("./abi/ethereum/abi-rolesUpdater"));

var _abiLandResource = _interopRequireDefault(require("./abi/ethereum/abi-landResource"));

var _abiApostleAuction = _interopRequireDefault(require("./abi/ethereum/abi-apostleAuction"));

var _abiTakeBack = _interopRequireDefault(require("./abi/ethereum/abi-takeBack"));

var _abiApostleSiring = _interopRequireDefault(require("./abi/ethereum/abi-apostleSiring"));

var _abiApostleBase = _interopRequireDefault(require("./abi/ethereum/abi-apostleBase"));

var _abiTokenUse = _interopRequireDefault(require("./abi/ethereum/abi-tokenUse"));

var _abiPetbase = _interopRequireDefault(require("./abi/ethereum/abi-petbase"));

var _abiUniswapExchangeV = _interopRequireDefault(require("./abi/ethereum/abi-uniswapExchangeV2"));

var _abiSwapBridge = _interopRequireDefault(require("./abi/ethereum/abi-swapBridge"));

var _abiLuckyBag = _interopRequireDefault(require("./abi/ethereum/abi-luckyBag"));

var _abiItemTreasure = _interopRequireDefault(require("./abi/ethereum/abi-itemTreasure"));

var _abiItemTakeBack = _interopRequireDefault(require("./abi/ethereum/abi-itemTakeBack"));

var _abiRedPackage = _interopRequireDefault(require("./abi/ethereum/abi-redPackage"));

var _abiFurnaceItemBase = _interopRequireDefault(require("./abi/ethereum/abi-furnaceItemBase"));

var _abiERC = _interopRequireDefault(require("./abi/ethereum/abi-ERC721"));

var _abiGegoToken = _interopRequireDefault(require("./abi/ethereum/abi-gegoToken"));

var _abiGoldRushRaffle = _interopRequireDefault(require("./abi/ethereum/abi-goldRushRaffle"));

var _abiLiquidityStaker = _interopRequireDefault(require("./abi/ethereum/abi-liquidityStaker"));

var _abiLiquidityStakerFactory = _interopRequireDefault(require("./abi/ethereum/abi-liquidityStakerFactory"));

var _abiERC2 = _interopRequireDefault(require("./abi/ethereum/abi-ERC1155"));

var _abiPetBridge = _interopRequireDefault(require("./abi/ethereum/abi-petBridge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getABI(env) {
  var _env = (0, _index.Env)(env);

  return Object.freeze({
    ring: {
      address: _env.CONTRACT.TOKEN_RING,
      abi: _abiRing["default"]
    },
    withdraw: {
      address: _env.CONTRACT.TOKEN_WITHDRAW,
      abi: _abiWithdraw["default"]
    },
    withdrawKton: {
      address: _env.CONTRACT.TOKEN_WITHDRAW_KTON,
      abi: _abiWithdraw["default"]
    },
    auction: {
      address: _env.CONTRACT.TOKEN_AUCTION,
      abi: _abiAuction["default"]
    },
    landClockAuction: {
      address: _env.CONTRACT.TOKEN_AUCTION,
      abi: _abiAuction["default"]
    },
    land: {
      address: _env.CONTRACT.TOKEN_LAND,
      abi: _abiLand["default"]
    },
    objectOwnership: {
      address: _env.CONTRACT.TOKEN_LAND,
      abi: _abiLand["default"]
    },
    luckybag: {
      address: _env.CONTRACT.TOKEN_LUCKYBAG,
      abi: _abiLuckyBag["default"]
    },
    redPackage: {
      address: _env.CONTRACT.TOKEN_REDPACKAGE,
      abi: _abiRedPackage["default"]
    },
    bancor: {
      address: _env.CONTRACT.TOKEN_BANCOR,
      abi: _abiBancor["default"]
    },
    bank: {
      address: _env.CONTRACT.TOKEN_BANK,
      abi: _abiBank["default"]
    },
    kton: {
      address: _env.CONTRACT.TOKEN_KTON,
      abi: _abiKton["default"]
    },
    lottery: {
      address: _env.CONTRACT.TOKEN_LOTTERY,
      abi: _abiLottery["default"]
    },
    rolesUpdater: {
      address: _env.CONTRACT.TOKEN_ROLES_UPDATER,
      abi: _abiRolesUpdater["default"]
    },
    apostleBase: {
      address: _env.CONTRACT.TOKEN_APOSTLE_BASE,
      abi: _abiApostleBase["default"]
    },
    apostleAuction: {
      address: _env.CONTRACT.TOKEN_APOSTLE_CLOCK_AUCTION,
      abi: _abiApostleAuction["default"]
    },
    apostleSiringAuction: {
      address: _env.CONTRACT.TOKEN_APOSTLE_SIRING_AUCTION,
      abi: _abiApostleSiring["default"]
    },
    apostleLandResource: {
      address: _env.CONTRACT.TOKEN_LAND_RESOURCE,
      abi: _abiLandResource["default"]
    },
    apostleTokenUse: {
      address: _env.CONTRACT.TOKEN_TOKEN_USE,
      abi: _abiTokenUse["default"]
    },
    apostleTakeBack: {
      address: _env.CONTRACT.TOKEN_APOSTLE_TAKE_BACK,
      abi: _abiTakeBack["default"]
    },
    petBase: {
      address: _env.CONTRACT.TOKEN_PET_BASE,
      abi: _abiPetbase["default"]
    },
    gold: {
      address: _env.CONTRACT.TOKEN_ELEMENT_GOLD,
      abi: _abiRing["default"]
    },
    wood: {
      address: _env.CONTRACT.TOKEN_ELEMENT_WOOD,
      abi: _abiRing["default"]
    },
    water: {
      address: _env.CONTRACT.TOKEN_ELEMENT_WATER,
      abi: _abiRing["default"]
    },
    fire: {
      address: _env.CONTRACT.TOKEN_ELEMENT_FIRE,
      abi: _abiRing["default"]
    },
    soil: {
      address: _env.CONTRACT.TOKEN_ELEMENT_SOIL,
      abi: _abiRing["default"]
    },
    uniswapExchange: {
      address: _env.CONTRACT.UNISWAP_EXCHANGE,
      abi: _abiUniswapExchangeV["default"]
    },
    swapBridge: {
      address: _env.CONTRACT.TOKEN_DEX_BRIDGE,
      abi: _abiSwapBridge["default"]
    },
    itemTreasure: {
      address: _env.CONTRACT.FURNACE_TREASURE,
      abi: _abiItemTreasure["default"]
    },
    itemTakeBack: {
      address: _env.CONTRACT.FURNACE_TAKEBACK,
      abi: _abiItemTakeBack["default"]
    },
    itemBase: {
      address: _env.CONTRACT.FURNACE_ITEMBASE,
      abi: _abiFurnaceItemBase["default"]
    },
    furnaceItemBase: {
      address: _env.CONTRACT.FURNACE_ITEMBASE,
      abi: _abiFurnaceItemBase["default"]
    },
    erc721: {
      abi: _abiERC["default"]
    },
    erc1155: {
      abi: _abiERC2["default"]
    },
    gego: {
      address: _env.CONTRACT.TOKEN_GEGO,
      abi: _abiGegoToken["default"]
    },
    goldRushRaffle: {
      address: _env.CONTRACT.GOLD_RUSH_RAFFLE,
      abi: _abiGoldRushRaffle["default"]
    },
    liquidityStaker: {
      abi: _abiLiquidityStaker["default"]
    },
    liquidityStakerFactory: {
      address: _env.CONTRACT.LIQUIDITY_STAKER_FACTORY,
      abi: _abiLiquidityStakerFactory["default"]
    },
    petCryptoKitties: {
      address: _env.CONTRACT.TOKEN_KITTY_CORE,
      abi: _abiERC["default"]
    },
    petPolkaPets: {
      address: _env.CONTRACT.TOKEN_POLKAPETS,
      abi: _abiERC2["default"]
    },
    petBridge: {
      address: _env.CONTRACT.PET_BRIDGE,
      abi: _abiPetBridge["default"]
    }
  });
}

var _default = getABI;
exports["default"] = _default;