import { Base64 } from "js-base64";
import to from "await-to-js";
import bs58 from "bs58";
import { Buffer } from "buffer";
import MD5 from "md5.js";
import isObject from "lodash/isObject";
import isString from "lodash/isString";
import uuidv1 from "uuid/v1";
import {
  CONF_ITERING_DOMAIN_MAIN,
  CONF_ITERING_DOMAIN_TEST,
  CONF_ITERING_ID,
  CONF_CONTRACT_STATUS_TEST
} from "../config";
import { getCurrentBlockChain } from "../config/blockchain";

function createRandom() {
  return Base64.encode(uuidv1()).substr(0, 6);
}

function createBase58(data, sha3) {
  const md5 = new MD5().update(sha3(data)).digest("hex");
  const buffer = Buffer.from(md5, "hex");
  return bs58.encode(buffer);
}

export default class IteringId {
  /**
   * @param agent ajax
   * @param blockchain eth or tron
   * @param domain CONF_ITERING_DOMAIN
   * @param sha3 method
   */
  constructor({ status, blockchain, agent, sha3, languge = "zh-CN" }) {
    this.domain =
      status === CONF_CONTRACT_STATUS_TEST
        ? CONF_ITERING_DOMAIN_TEST
        : CONF_ITERING_DOMAIN_MAIN;

    this.agent = agent;
    this.sha3 = sha3;
    this.blockchain = blockchain;
    this.blockchainName = getCurrentBlockChain(blockchain)
      ? getCurrentBlockChain(blockchain).name
      : "";
    this.languge = languge;
    this.token = createRandom();
    this.name = CONF_ITERING_ID;
    this.index = 0;
    this.onOff = true;
  }

  // 登录
  onLogin({ invite, callback, afterGetSignature = () => {} }) {
    this._actionPoll({
      mode: "login",
      message: invite,
      callback,
      afterGetSignature
    });
  }

  // 绑定
  onBinding({ invite, callback, afterGetSignature = () => {} }) {
    this._actionPoll({
      mode: "binding",
      message: invite,
      callback,
      afterGetSignature
    });
  }

  // 交易
  async onTransaction({ message, callback, afterGetSignature = () => {} }) {
    this._actionPoll({
      mode: "transaction",
      message: message,
      callback,
      afterGetSignature
    });
  }

  async _actionPoll({ mode, message, callback, afterGetSignature }) {
    const self = this;
    let link;
    link = await this.render(mode, message, this.token);
    if (link) {
      callback && callback(link);
    }
    async function loop({ afterGetSignature }) {
      self.index = self.index + 2;

      if (self.onOff) {
        self.onOff = false;
        if (self.index >= 60 * 5) {
          self.index = 0;
          self.token = createRandom();
          link = await self.render(mode, message, self.token);
          if (link) {
            callback && callback(link);
          }
        }

        let err, response;
        [err, response] = await to(
          self.agent.apiCycleItering({ code: self.token })
        );
        self.onOff = true;
        const { code, data } = response;

        if (err || code !== 0) {
          setTimeout(() => {
            loop({ mode, message, callback, afterGetSignature });
          }, 1000);
          if (err) {
            throw new Error(err);
          }
        }
        if (data) {
          afterGetSignature && afterGetSignature(data);
        }
      }
    }
    loop({ afterGetSignature });
  }

  _generateLoginContent({ invite, token }) {
    const result = {
      action: "login",
      token: token,
      type: this.blockchainName,
      data: {
        appid: "10001",
        invite,
        typedData: [
          {
            type: "string",
            name: this.name,
            value: token
          }
        ],
        address: "",
        callback: ""
      }
    };
    return JSON.stringify(result);
  }

  async _generateBindingContent({ invite, token }) {
    let err, response, content;
    [err, response] = await to(this.agent.apiChallenge());
    if (err) throw Error(err);

    const { code, data, name } = response;
    if (code === 0) {
      if (this.blockchain === 1) {
        content = `${name} ${data}`;
      } else if (this.blockchain === 2) {
        content = this.sha3(`${name} ${data}`);
      }
      const result = {
        action: "SignTypedData",
        token,
        invite,
        type: this.blockchainName,
        data: {
          appid: "10001",
          typedData: content,
          address: "",
          callback: `${this.domain}/itering/v3/users/sign_call`
        }
      };
      return JSON.stringify(result);
    }
    return "";
  }

  _generateTransactionContent({ message, token }) {
    let result;
    if (isObject(message)) {
      result = {
        action: "signTransaction",
        token,
        type: this.blockchainName,
        data: message
      };
    } else if (isString(message)) {
      try {
        result = {
          action: "signTransaction",
          token,
          type: this.blockchainName,
          data: JSON.parse(message)
        };
      } catch (err) {
        console.warn(err);
      }
    }
    return JSON.stringify(result);
  }

  async _generateLink(content) {
    let err, response;
    [err, response] = await to(
      this.agent.apiResponseQr(
        {
          code_params: content,
          h: createBase58(content, this.sha3)
        },
        this.domain
      )
    );

    if (err) throw new Error(err);

    const { code } = response;

    // todo
    // 2.0.0 为tron环境，如果以后添加第三个大陆的话，则可能为别的version
    // 建议大陆相关，写一个config,
    // 时间关系，这里简单处理了。
    const VERSION = this.blockchain === 1 ? "1.0.0" : "2.0.0";
    const link = `${this.domain}/${this.languge === "zh-CN" ? "b" : "a"}/`;

    if (code === 0) {
      return `${link}?t=${createBase58(content, this.sha3)}&v=${VERSION}`;
    }

    return {
      code,
      message: code === 20003 ? "Network Error, Waiting for 1 minute" : "Error"
    };
  }

  async render(mode, message, token) {
    let content;
    if (mode === "login") {
      content = this._generateLoginContent({ invite: message, token });
    } else if (mode === "binding") {
      content = await this._generateBindingContent({
        invite: message,
        token
      });
    } else if (mode === "transaction") {
      content = this._generateTransactionContent({ message, token });
    }
    return await this._generateLink(content);
  }
}
