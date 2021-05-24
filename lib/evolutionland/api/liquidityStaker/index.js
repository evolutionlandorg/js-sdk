"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var LiquidityStakerApi = {
  liqidityStakerGetStakerAddress: function liqidityStakerGetStakerAddress(stakingToken) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.callContract({
      methodName: "stakingRewardsInfoByStakingToken",
      abiKey: "liquidityStakerFactory",
      abiString: this.ABIs["liquidityStakerFactory"].abi,
      contractParams: [stakingToken]
    }, callback);
  },
  liqidityStakerTotalSupply: function liqidityStakerTotalSupply(stakerContractAddress) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.callContract({
      methodName: "totalSupply",
      abiKey: stakerContractAddress,
      abiString: this.ABIs["liquidityStaker"].abi,
      contractParams: []
    }, callback);
  },
  liqidityStakerBalanceOf: function liqidityStakerBalanceOf(stakerContractAddress, account) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.callContract({
      methodName: "balanceOf",
      abiKey: stakerContractAddress,
      abiString: this.ABIs["liquidityStaker"].abi,
      contractParams: [account]
    }, callback);
  },
  liqidityStakerLastTimeRewardApplicable: function liqidityStakerLastTimeRewardApplicable(stakerContractAddress) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.callContract({
      methodName: "lastTimeRewardApplicable",
      abiKey: stakerContractAddress,
      abiString: this.ABIs["liquidityStaker"].abi,
      contractParams: []
    }, callback);
  },
  liqidityStakerGetRewardForDuration: function liqidityStakerGetRewardForDuration(stakerContractAddress) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.callContract({
      methodName: "getRewardForDuration",
      abiKey: stakerContractAddress,
      abiString: this.ABIs["liquidityStaker"].abi,
      contractParams: []
    }, callback);
  },
  liqidityStakerRewardPerToken: function liqidityStakerRewardPerToken(stakerContractAddress) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.callContract({
      methodName: "rewardPerToken",
      abiKey: stakerContractAddress,
      abiString: this.ABIs["liquidityStaker"].abi,
      contractParams: []
    }, callback);
  },
  liqidityStakerEarned: function liqidityStakerEarned(stakerContractAddress, account) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.callContract({
      methodName: "earned",
      abiKey: stakerContractAddress,
      abiString: this.ABIs["liquidityStaker"].abi,
      contractParams: [account]
    }, callback);
  },
  liqidityStakerPeriodFinish: function liqidityStakerPeriodFinish(stakerContractAddress) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.callContract({
      methodName: "periodFinish",
      abiKey: stakerContractAddress,
      abiString: this.ABIs["liquidityStaker"].abi,
      contractParams: []
    }, callback);
  },

  /**
   * This function is used to stake token for farm
   * @param {*} stakerContractAddress The staker contract address
   * @param {*} amount Staked amount
   * @param {*} callback
   */
  liqidityStakerStakeToken: function liqidityStakerStakeToken(stakerContractAddress, amount) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.triggerContract({
      methodName: "stake",
      abiKey: stakerContractAddress,
      abiString: this.ABIs['liquidityStaker'].abi,
      contractParams: [amount]
    }, callback);
  },
  liqidityStakerWithdraw: function liqidityStakerWithdraw(stakerContractAddress, amount) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.triggerContract({
      methodName: "withdraw",
      abiKey: stakerContractAddress,
      abiString: this.ABIs['liquidityStaker'].abi,
      contractParams: [amount]
    }, callback);
  },
  liqidityStakerGetReward: function liqidityStakerGetReward(stakerContractAddress) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.triggerContract({
      methodName: "getReward",
      abiKey: stakerContractAddress,
      abiString: this.ABIs['liquidityStaker'].abi,
      contractParams: []
    }, callback);
  },
  liqidityStakerExit: function liqidityStakerExit(stakerContractAddress) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.triggerContract({
      methodName: "exit",
      abiKey: stakerContractAddress,
      abiString: this.ABIs['liquidityStaker'].abi,
      contractParams: []
    }, callback);
  }
};
var _default = LiquidityStakerApi;
exports["default"] = _default;