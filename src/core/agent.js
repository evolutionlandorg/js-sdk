import axios from "axios";
import isObject from "lodash/isObject";
import queryString from "query-string";
import { Base64 } from "js-base64";
import MD5 from "md5.js";
import uuidv1 from "uuid/v1";
import { capitalize } from "../utils";
import {
  CONF_API_MAIN,
  CONF_API_TEST,
  CONF_CONTRACT_STATUS_TEST
} from "../config";

import { getCurrentBlockChain } from "../config/blockchain";

export default class Agent {
  static parseRes(response) {
    const headers = response.headers;
    const res = response.data;
    const { code } = res;
    if (typeof code !== "undefined") {
      return {
        ...res,
        ...(headers || {})
      };
    }
    return res;
  }

  constructor({ status, blockchain }) {
    this.status = status;
    this.blockchain = blockchain;
    // 设置base url
    this.baseURL =
      status === CONF_CONTRACT_STATUS_TEST ? CONF_API_TEST : CONF_API_MAIN;

    this.instance = axios.create({
      baseURL: this.baseURL
    });


    this.instance.interceptors.request.use(
      config => {
        if (config.baseURL === this.baseURL) {
          config.headers["EVO-NETWORK"] =
            getCurrentBlockChain(this.blockchain) &&
            getCurrentBlockChain(this.blockchain).name
              ? capitalize(getCurrentBlockChain(this.blockchain).name)
              : "";
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  $get(url, data, opt = {}) {
    if (data) opt.params = data;
    return this.instance
      .get(url, {
        ...opt
      })
      .then(response => Agent.parseRes(response));
  }

  $post(url, data, opt) {
    let body = data;
    if (data instanceof FormData) {
      body = data;
    } else if (isObject(data)) {
      body = queryString.stringify(data);
    }
    return this.instance
      .post(url, body, opt)
      .then(response => Agent.parseRes(response));
  }
  /**
   * 用于 相对路径 的数据加载
   */
  $getWithRelativePath(url) {
    return this.$get(url, {}, { baseURL: "/" });
  }

  $getAbi(url) {
    return this.$getWithRelativePath(
      `${this.baseURL}/abi/${
        getCurrentBlockChain(this.blockchain).fullName
      }/${url}`
    );
  }

  // api更新
  apiGasPrice(data) {
    return this.$get("/api/eth/gas_price", data);
  }
  apiLogin(data) {
    return this.$post("/api/login", data);
  }
  // 正常api
  apiChallenge(data) {
    return this.$get("/api/challenge", data);
  }
  apiCallbaclTransaction(data) {
    return this.$post("/api/eth/transaction", data);
  }
  apiCycleItering(data) {
    return this.$get("/api/itering/cycle", data);
  }

  apiResponseQr(data, iteringDomain) {
    const AuthorizationToken = `token:${uuidv1()}`;
    const secretKey = "ffd95e82acd84c4343921d73f7683bb60b7322905ae477d8";

    const result = {
      ...data,
      sign: new MD5().update(`${AuthorizationToken}-${secretKey}`).digest("hex")
    };

    return this.$post("/itering/link/set_rqcode", result, {
      headers: { AuthorizationToken: Base64.encode(AuthorizationToken) },
      baseURL: iteringDomain
    });
  }
}
