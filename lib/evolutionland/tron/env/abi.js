"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.array.is-array.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.object.freeze.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiContractlottey = apiContractlottey;
exports.apiContractPetBase = apiContractPetBase;
exports.apiContractRing = apiContractRing;
exports.apiContractAuction = apiContractAuction;
exports.apiContractLand = apiContractLand;
exports.apiContractWithdraw = apiContractWithdraw;
exports.apiContractLuckybag = apiContractLuckybag;
exports.apiContractBancor = apiContractBancor;
exports.apiContractBank = apiContractBank;
exports.apiContractKton = apiContractKton;
exports.apiContractRolesUpdater = apiContractRolesUpdater;
exports.apiContractApostle = apiContractApostle;
exports.apiContractApostleBase = apiContractApostleBase;
exports.apiContractApostleAuction = apiContractApostleAuction;
exports.apiContractApostleSiring = apiContractApostleSiring;
exports.apiContractLandResource = apiContractLandResource;
exports.apiContractTokenUse = apiContractTokenUse;
exports.apiContractTakeBack = apiContractTakeBack;
exports.swapBridge = swapBridge;
exports.getContractMethodsParams = getContractMethodsParams;
exports["default"] = void 0;

var _index = require("./index");

var _abiGoldRushRaffle = _interopRequireDefault(require("../../ethereum/env/abi/ethereum/abi-goldRushRaffle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function apiContractlottey() {
  return "/abi-lottery.json";
}

function apiContractPetBase() {
  return "/abi-petbase.json";
}

function apiContractRing() {
  return "/abi-ring.json";
}

function apiContractAuction() {
  return "/abi-auction.json";
}

function apiContractLand() {
  return "/abi-land.json";
}

function apiContractWithdraw() {
  return "/abi-withdraw.json";
}

function apiContractLuckybag() {
  return "/abi-luckyBag.json";
}

function apiContractBancor() {
  return "/abi-bancor.json";
}

function apiContractBank() {
  return "/abi-bank.json";
}

function apiContractKton() {
  return "/abi-kton.json";
}

function apiContractRolesUpdater() {
  return "/abi-rolesUpdater.json";
}

function apiContractApostle() {
  return "/abi-land.json";
}

function apiContractApostleBase() {
  return "/abi-apostleBase.json";
}

function apiContractApostleAuction() {
  return "/abi-apostleAuction.json";
}

function apiContractApostleSiring() {
  return "/abi-apostleSiring.json";
}

function apiContractLandResource() {
  return "/abi-landResource.json";
}

function apiContractTokenUse() {
  return "/abi-tokenUse.json";
}

function apiContractTakeBack() {
  return "/abi-takeBack.json";
}

function swapBridge() {
  return "/abi-swapBridge.json";
}

function getContractMethodsParams(methodName, params, json) {
  var result = json.filter(function (item) {
    if (Array.isArray(item.inputs)) {
      return (item.type === "Function" || item.type === "function") && item.name === methodName && item.inputs.length === params.length;
    }

    return (item.type === "Function" || item.type === "function") && item.name === methodName;
  })[0];
  var function_selector;
  var parameter;

  if (Array.isArray(result.inputs)) {
    var types = result.inputs.reduce(function (total, item) {
      return total + item.type + ",";
    }, "");
    function_selector = "".concat(methodName, "(").concat(types.substring(0, types.length - 1), ")");
    parameter = params.map(function (item, index) {
      var obj = {};
      obj.type = result.inputs[index].type;
      obj.value = item;
      return obj;
    });
  } else {
    function_selector = "".concat(methodName, "()");
    parameter = [];
  }

  return {
    functionSelector: function_selector,
    parameter: parameter
  };
}

function getABI(env) {
  var _env = (0, _index.Env)(env);

  return Object.freeze({
    ring: {
      address: _env.CONTRACT.TOKEN_RING,
      api: apiContractRing
    },
    withdraw: {
      address: _env.CONTRACT.TOKEN_WITHDRAW,
      api: apiContractWithdraw
    },
    withdrawKton: {
      address: _env.CONTRACT.TOKEN_WITHDRAW_KTON,
      api: apiContractWithdraw
    },
    auction: {
      address: _env.CONTRACT.TOKEN_AUCTION,
      api: apiContractAuction
    },
    land: {
      address: _env.CONTRACT.TOKEN_LAND,
      api: apiContractLand
    },
    objectOwnership: {
      address: _env.CONTRACT.TOKEN_LAND,
      api: apiContractLand
    },
    luckybag: {
      address: _env.CONTRACT.TOKEN_LUCKYBAG,
      api: apiContractLuckybag
    },
    redPackage: {
      address: _env.CONTRACT.TOKEN_REDPACKAGE,
      api: apiContractRing
    },
    bancor: {
      address: _env.CONTRACT.TOKEN_BANCOR,
      api: apiContractBancor
    },
    bank: {
      address: _env.CONTRACT.TOKEN_BANK,
      api: apiContractBank
    },
    kton: {
      address: _env.CONTRACT.TOKEN_KTON,
      api: apiContractKton
    },
    lottery: {
      address: _env.CONTRACT.TOKEN_LOTTERY,
      api: apiContractlottey
    },
    rolesUpdater: {
      address: _env.CONTRACT.TOKEN_ROLES_UPDATER,
      api: apiContractRolesUpdater
    },
    apostleBase: {
      address: _env.CONTRACT.TOKEN_APOSTLE_BASE,
      api: apiContractApostleBase
    },
    apostleSell: {
      address: _env.CONTRACT.TOKEN_APOSTLE_CLOCK_AUCTION,
      api: apiContractApostle
    },
    apostleBid: {
      address: _env.CONTRACT.TOKEN_APOSTLE_CLOCK_AUCTION,
      api: apiContractRing
    },
    apostleAuction: {
      address: _env.CONTRACT.TOKEN_APOSTLE_CLOCK_AUCTION,
      api: apiContractApostleAuction
    },
    apostleSiringAuction: {
      address: _env.CONTRACT.TOKEN_APOSTLE_SIRING_AUCTION,
      api: apiContractLand
    },
    apostleSiringCancelAuction: {
      address: _env.CONTRACT.TOKEN_APOSTLE_SIRING_AUCTION,
      api: apiContractApostleSiring
    },
    apostleBreed: {
      address: _env.CONTRACT.TOKEN_APOSTLE_BASE,
      api: apiContractRing
    },
    // apostleTransfer: {
    //   address: TOKEN_LAND,
    //   api:apiContractRing
    // }
    apostleLandResource: {
      address: _env.CONTRACT.TOKEN_LAND_RESOURCE,
      api: apiContractLandResource
    },
    apostleTokenUse: {
      address: _env.CONTRACT.TOKEN_TOKEN_USE,
      api: apiContractTokenUse
    },
    apostleTakeBack: {
      address: _env.CONTRACT.TOKEN_APOSTLE_TAKE_BACK,
      api: apiContractTakeBack
    },
    petBase: {
      address: _env.CONTRACT.TOKEN_PET_BASE,
      api: apiContractPetBase
    },
    gold: {
      address: _env.CONTRACT.TOKEN_ELEMENT_GOLD,
      api: apiContractRing
    },
    wood: {
      address: _env.CONTRACT.TOKEN_ELEMENT_WOOD,
      api: apiContractRing
    },
    water: {
      address: _env.CONTRACT.TOKEN_ELEMENT_WATER,
      api: apiContractRing
    },
    fire: {
      address: _env.CONTRACT.TOKEN_ELEMENT_FIRE,
      api: apiContractRing
    },
    soil: {
      address: _env.CONTRACT.TOKEN_ELEMENT_SOIL,
      api: apiContractRing
    },
    swapBridge: {
      address: _env.CONTRACT.TOKEN_DEX_BRIDGE,
      api: swapBridge
    },
    justswapExchange: {
      address: _env.CONTRACT.JUSTSWAP_EXCHANGE
    },
    goldRushRaffle: {
      address: _env.CONTRACT.GOLD_RUSH_RAFFLE,
      abi: _abiGoldRushRaffle["default"]
    }
  });
}

var _default = getABI;
exports["default"] = _default;