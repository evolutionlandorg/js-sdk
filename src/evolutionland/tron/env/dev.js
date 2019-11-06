export default {
    CONTRACT: {
        // 合约
        TOKEN_DEX_BRIDGE: "4179d9d3bba6aff413e82dd919cb3f401cae9842e2", // DexBridge swap
        TOKEN_RING: "4168ed5320553d88b4b20e6878f992f4ad47160977",
        TOKEN_WITHDRAW: "4169f8420fe9a8312196fe37e78bd71af3f19ce473", // takeback
        TOKEN_AUCTION: "419ec03447c6dd7b4ccdb2f200b22185b5eadeac2e", // ClockAuction
        TOKEN_LAND: "41c77e8e5d157254e0315f50c36ba34032ff761a35", //objectOwnership
        TOKEN_LUCKYBAG: "",
        TOKEN_REDPACKAGE: "",
        TOKEN_BANCOR: "4108b5e5c13baf1cd59030f3c6fb8fb2b56dc8a8e4", // BancorExchange
        TOKEN_BANK: "419fa4a698db2624563f606e134d774347d07f3120", // GringottsBank
        TOKEN_KTON: "419b61a6c1cf890057adefede265b0a6adb898ef06",
        TOKEN_LOTTERY: "41f1e3a5fad71ca8beb66736a217331bad9ed2640a", // PointsRewardPool
        TOKEN_USER_POINTS: "416910e1b0a8473608aafc74a72327e6612cb2eca0", //UserPoints
        TOKEN_ROLES_UPDATER: "418599a1684f012ba58c01a227afb61cd4bbfda5c2", // rolesUpdater

        TOKEN_GEN0_APOSTLE: "4111375bedef0677ba12f9afcdb8122365e6a35a08", //Gen0Apostle
        TOKEN_APOSTLE_TAKE_BACK: "", //TakeBackNFT
        TOKEN_APOSTLE_CLOCK_AUCTION:
            "416c502bbc972a606c1393e375718f7fb427ab9b12", //ApostleClockAuction
        TOKEN_APOSTLE_SIRING_AUCTION:
            "41f1b300e4272bd170845aeb50df89ae5976593ae2", //SiringClockAuction
        TOKEN_APOSTLE_BASE: "41ed19d63c5aca912d33c8db9ebbfb7e36fe826683", //ApostleBase
        TOKEN_LAND_RESOURCE: "41008fbcf28f1946fc389ccc276dfedd928837ece2", //landResource
        TOKEN_TOKEN_USE: "41a8de30a5c8d6f6339943eec59dfdf6b0527c038e", //token use

        // new
        TOKEN_KITTY_CORE: "414c52f61dc2671c3f9c93ae78cb02382c4903e29c", // KittyCore
        TOKEN_PET_BASE: "41df4f38ff9a7b99979c9f6749dadce7a3f1153066", // PetBaseProxy
        /**
         * 5个元素地址
         * */
        TOKEN_ELEMENT_GOLD: "41b8cd780bb8977187c2095c6c8dfc0079f4d6ad52", //金
        TOKEN_ELEMENT_WOOD: "414d090eedc454467ad147c1bed9c0780e8e631000", //木
        TOKEN_ELEMENT_WATER: "413be6bb5b83c15e20e3c91fa59c5962990e557e25", //水
        TOKEN_ELEMENT_FIRE: "414108875ce975049e8f23559118c6ab890d029898", //火
        TOKEN_ELEMENT_SOIL: "413422a9b635722704d3c1ea9d42a08fe7bf07026b", //土

        PROVIDER: "https://api.shasta.trongrid.io",

        SCAN_URL: "https://shasta.tronscan.org/#/",
        SCAN_TRANSACTION: "https://shasta.tronscan.org/#/transaction",
        SCAN_ADDRESS: "https://shasta.tronscan.org/#/address",

        NETWORK: "https://api.shasta.trongrid.io",
        NETWORK_NODE: "1",

        GENESISHOLDER: "416edd447e90cb1026d5765afde68e1a4bdc987024",
        AUCTIONHOLDER: "",
        // 扫描返回
        ITERING_CALLBACK:
            "https://alpha.evolution.land/api/tron/raw_sign_broadcast"
    },
    DOMAIN: "https://alpha.evolution.land",
    ABI_DOMAIN: "https://devstatic.l2me.com/static"
};
