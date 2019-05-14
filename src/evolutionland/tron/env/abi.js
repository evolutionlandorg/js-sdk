import {Env} from './index'

export function apiContractlottey() {
    return ("/abi-lottery.json");
}

export function apiContractPetBase() {
    return ("/abi-petbase.json");
}

export function apiContractRing() {
    return ("/abi-ring.json");
}

export function apiContractAuction() {
    return ("/abi-auction.json");
}

export function apiContractLand() {
    return ("/abi-land.json");
}

export function apiContractWithdraw() {
    return ("/abi-withdraw.json");
}

export function apiContractLuckybag() {
    return ("/abi-luckyBag.json");
}

export function apiContractBancor() {
    return ("/abi-bancor.json");
}

export function apiContractBank() {
    return ("/abi-bank.json");
}

export function apiContractKton() {
    return ("/abi-kton.json");
}

export function apiContractRolesUpdater() {
    return ("/abi-rolesUpdater.json");
}

export function apiContractApostle() {
    return ("/abi-land.json");
}
export function apiContractApostleBase() {
    return ("/abi-apostleBase.json");
}
export function apiContractApostleAuction() {
    return ("/abi-apostleAuction.json");
}

export function apiContractApostleSiring() {
    return ("/abi-apostleSiring.json");
}

export function apiContractLandResource() {
    return ("/abi-landResource.json");
}

export function apiContractTokenUse() {
    return ("/abi-tokenUse.json");
}

export function apiContractTakeBack() {
    return ("/abi-takeBack.json");
}

function getABI(env){
    let _env = Env(env)
    return Object.freeze({
        ring: {
            address: _env.CONTRACT.TOKEN_RING,
            api: apiContractRing
        },
        withdraw: {
            address: _env.CONTRACT.TOKEN_WITHDRAW,
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
        }
    });
}

export default getABI
