export type EnvType = {
  CONTRACT_ADDRESS: {
    TOKEN_DEX_BRIDGE: string; // cross land transfer(swapBridge)
    TOKEN_RING: string;
    TOKEN_WITHDRAW: string; // takeback
    TOKEN_WITHDRAW_KTON: string; // takeback
    TOKEN_AUCTION: string; // ClockAuction
    TOKEN_LAND: string; //objectOwnership
    TOKEN_LUCKYBAG: string;
    TOKEN_REDPACKAGE: string;
    TOKEN_BANCOR: string; // BancorExchange
    TOKEN_BANK: string;
    TOKEN_KTON: string;
    TOKEN_LOTTERY: string; // PointsRewardPool
    TOKEN_USER_POINTS: string; //UserPoints
    TOKEN_ROLES_UPDATER: string; // rolesUpdater

    TOKEN_GEN0_APOSTLE: string; //Gen0Apostle
    TOKEN_APOSTLE_TAKE_BACK: string; //TakeBackNFT
    TOKEN_APOSTLE_CLOCK_AUCTION: string; //ApostleClockAuction
    TOKEN_APOSTLE_SIRING_AUCTION: string; //SiringClockAuction
    TOKEN_APOSTLE_BASE: string; //ApostleBase
    TOKEN_LAND_RESOURCE: string; //landResource
    TOKEN_TOKEN_USE: string; //token use

    TOKEN_KITTY_CORE: string; // KittyCore
    TOKEN_PET_BASE: string; // PetBaseProxy
    TOKEN_GEGO?: string; // Dego Token

    TOKEN_ELEMENT_GOLD: string;
    TOKEN_ELEMENT_WOOD: string;
    TOKEN_ELEMENT_WATER: string;
    TOKEN_ELEMENT_FIRE: string;
    TOKEN_ELEMENT_SOIL: string;

    GENESISHOLDER: string;
    UNISWAP_EXCHANGE: string;
    AUCTIONHOLDER: string;

    FURNACE_TREASURE: string; // DrillLuckyBox
    FURNACE_TAKEBACK: string; // DrillTakeBack
    FURNACE_ITEMBASE: string; // ItemBase_Proxy

    GOLD_RUSH_RAFFLE: string;

    LIQUIDITY_STAKER_FACTORY: string;

    ITERING_CALLBACK: string;

    TOKEN_WETH: string; // wht

    TOKEN_POLKAPETS?: string;
    PET_BRIDGE?: string;
    PVETEAM_PROXY?: string; // PVE Team
  };
};
