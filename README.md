# evolutionland.js

> 进化星球合约操作 sdk, 使用建议参考源码注释

> 建议使用的时候，二次封装，可以更灵活的进行 ui 的定制操作，比如，合约交互前，如果是调用网页钱包的前提下， 可以先运行 runtimeValidate 来判断是否是合法的合约环境，可以减少一些出错；

> 应用层示例可以参考进化星球, evo-static/utils/contract/ethereum/index.js 或者 evo-static/utils/contract/tron/index.js;

> dist 文件较大，可以考虑项目之间引入 src 文件夹内容，然后进行 import() 分片加载；

> **简单用法**

```
    this.contract = new Evolutionland({ // 定义对象
      status: "main", // 主网
      isIteringId: true, // 使用itering id
      blockchain: 1, // ethereum
      languge: "zh-CN" // 中文
    });

  <!-- 交易 -->
    axios.get("/abi/ethereum/abi-ring.json").then(({ data }) => {
      this.contract.triggerContractMethod({
        wallet: // 钱包地址 "0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5",
        tokenABI: data, // 合约 json 数据
        tokenAddr:  // 合约地址"0xf8720eb6ad4a530cccb696043a0d10831e2ff60e",
        methodName: "transfer", // 合约方法
        methodParams: [ // 方法参数
          "0x4038a368eebe4f374417cdc358d2f99b4c7f161e",
          this.contract.toWei(1000),
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ],
        value: 0, // eth 数量
        tokenId: ""
      })({
        callback: res => {  // 如果使用itering id 时，callback获得itering id 需要的url
          console.log('callback',res);
        },
        onSendBefore: res => { // 发送合约前钩子函数
          console.log("onSendBefore", res);
        },
        onTransactionHash: res => { // 发送合约获得hash值时的钩子函数
          console.log("onTransactionHash", res);
        },
        onSuccess: res => { // 合约交互成功后的钩子函数
          console.log("onSuccess", res);
        },
        onFail: res => { // 合约交互失败的钩子函数
          console.log("onFail", res);
        },
        onError: res => { // 合约执行出错的钩子函数
          console.log("onError", res);
        }
      });
    });

    <!-- 签名 -->
    this.contract.sign(address:string)

    <!-- 常用方法 -->
    1. runtimeValidate
    作用：检测是否是正确的网页端钱包环境（是否安装，是否登录，是否是正确的网络）
    返回值：
    -3   错误的网络
    -2   未登录
    -1   未安装
    1    成功

    2. validateMetamaskPrivacy
    作用：metamask 如果首次登录的时候，会唤起授权页面

    <!-- 常见问题 -->
    1. 报错：errors.js:85 Uncaught (in promise) Error: invalid number value (arg="_tokenId", coderType="uint256", value="2a01000101000101000000000000000100000000000000000000000000000484", version=4.0.27)

    解释： web3最新版本中，调用方法参数如果包含tokenid的话，需要在tokenid前面加上0x, this.contract.add0x(tokenId); 和波场方法保持一致

```
