let LiquidityStakerApi = {

  liqidityStakerGetStakerAddress(stakingToken, callback = {}) {
    return this.callContract(
      {
        methodName: "stakingRewardsInfoByStakingToken",
        abiKey: "liquidityStakerFactory",
        abiString: this.ABIs["liquidityStakerFactory"].abi,
        contractParams: [stakingToken],
      },
      callback
    );
  },

  liqidityStakerTotalSupply(stakerContractAddress, callback = {}) {
    return this.callContract(
      {
        methodName: "totalSupply",
        abiKey: stakerContractAddress,
        abiString: this.ABIs["liquidityStaker"].abi,
        contractParams: [],
      },
      callback
    );
  },

  liqidityStakerBalanceOf(stakerContractAddress, account, callback = {}) {
    return this.callContract(
      {
        methodName: "balanceOf",
        abiKey: stakerContractAddress,
        abiString: this.ABIs["liquidityStaker"].abi,
        contractParams: [account],
      },
      callback
    );
  },

  liqidityStakerLastTimeRewardApplicable(stakerContractAddress, callback = {}) {
    return this.callContract(
      {
        methodName: "lastTimeRewardApplicable",
        abiKey: stakerContractAddress,
        abiString: this.ABIs["liquidityStaker"].abi,
        contractParams: [],
      },
      callback
    );
  },

  liqidityStakerGetRewardForDuration(stakerContractAddress, callback = {}) {
    return this.callContract(
      {
        methodName: "getRewardForDuration",
        abiKey: stakerContractAddress,
        abiString: this.ABIs["liquidityStaker"].abi,
        contractParams: [],
      },
      callback
    );
  },

  liqidityStakerRewardPerToken(stakerContractAddress, callback = {}) {
    return this.callContract(
      {
        methodName: "rewardPerToken",
        abiKey: stakerContractAddress,
        abiString: this.ABIs["liquidityStaker"].abi,
        contractParams: [],
      },
      callback
    );
  },

  liqidityStakerEarned(stakerContractAddress, account, callback = {}) {
    return this.callContract(
      {
        methodName: "earned",
        abiKey: stakerContractAddress,
        abiString: this.ABIs["liquidityStaker"].abi,
        contractParams: [account],
      },
      callback
    );
  },

  liqidityStakerPeriodFinish(stakerContractAddress, callback = {}) {
    return this.callContract(
      {
        methodName: "periodFinish",
        abiKey: stakerContractAddress,
        abiString: this.ABIs["liquidityStaker"].abi,
        contractParams: [],
      },
      callback
    );
  },

  /**
   * This function is used to stake token for farm
   * @param {*} stakerContractAddress The staker contract address
   * @param {*} amount Staked amount
   * @param {*} callback
   */
  liqidityStakerStakeToken(stakerContractAddress, amount, callback = {}) {
    return this.triggerContract(
      {
        methodName: "stake",
        abiKey: stakerContractAddress,
        abiString: this.ABIs['liquidityStaker'].abi,
        contractParams: [amount],
      },
      callback
    );
  },

  liqidityStakerWithdraw(stakerContractAddress, amount, callback = {}) {
    return this.triggerContract(
      {
        methodName: "withdraw",
        abiKey: stakerContractAddress,
        abiString: this.ABIs['liquidityStaker'].abi,
        contractParams: [amount],
      },
      callback
    );
  },

  liqidityStakerGetReward(stakerContractAddress, callback = {}) {
    return this.triggerContract(
      {
        methodName: "getReward",
        abiKey: stakerContractAddress,
        abiString: this.ABIs['liquidityStaker'].abi,
        contractParams: [],
      },
      callback
    );
  },

  liqidityStakerExit(stakerContractAddress, callback = {}) {
    return this.triggerContract(
      {
        methodName: "exit",
        abiKey: stakerContractAddress,
        abiString: this.ABIs['liquidityStaker'].abi,
        contractParams: [],
      },
      callback
    );
  }
}

export default LiquidityStakerApi;