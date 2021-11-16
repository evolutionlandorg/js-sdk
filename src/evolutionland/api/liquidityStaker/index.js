let LiquidityStakerApi = {

  liqidityStakerGetStakerAddress(stakingToken, callback = {}) {
    // heco testnet dusd-ring
    if ((stakingToken || "").toLowerCase() === "0x8d9C7F55dB6f9BCc49559dF9608503E017303279".toLowerCase()) {
      return "0x76b953B76007634BB4953b518bA428266b32f1Ce";
    }

    // heco mainnet dusd-ring
    if ((stakingToken || "").toLowerCase() === "0xcdb3fc40bc0d97a930f0d6f6f776cefdb29c92b0".toLowerCase()) {
      return "0xF4e650E88d595bB6d88C7eDb9fEF16d8c6157Cf4";
    }

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
  },

  // Polygon MyTrade - https://polygon.mytrade.org/pool
  liquidityStakerMytradeGetLpOfPid(lpAddress, callback = {}) {
    return this.callContract(
      {
        methodName: "LpOfPid",
        abiKey: 'myTradePool',
        abiString: this.ABIs["myTradePool"].abi,
        contractParams: [lpAddress],
      },
      callback
    );
  },

  liquidityStakerMytradeGetPoolInfo(pid, callback = {}) {
    return this.callContract(
      {
        methodName: "poolInfo",
        abiKey: 'myTradePool',
        abiString: this.ABIs["myTradePool"].abi,
        contractParams: [pid],
      },
      callback
    );
  },

  liquidityStakerMytradeGetPendingReward(pid, address, callback = {}) {
    return this.callContract(
      {
        methodName: "pending",
        abiKey: 'myTradePool',
        abiString: this.ABIs["myTradePool"].abi,
        contractParams: [pid, address],
      },
      callback
    );
  },
}

export default LiquidityStakerApi;