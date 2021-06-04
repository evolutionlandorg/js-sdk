"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _isObject = _interopRequireDefault(require("lodash/isObject"));

var _isString = _interopRequireDefault(require("lodash/isString"));

var _queryString = _interopRequireDefault(require("query-string"));

var _jsBase = require("js-base64");

var _md = _interopRequireDefault(require("md5.js"));

var _v = _interopRequireDefault(require("uuid/v1"));

var _chainMap = _interopRequireDefault(require("./chainMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function capitalize(str) {
  if (str && (0, _isString["default"])(str)) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return "";
}

var ClientFetch = /*#__PURE__*/function () {
  _createClass(ClientFetch, null, [{
    key: "parseRes",
    value: function parseRes(response) {
      var headers = response.headers;
      var res = response.data;
      var code = res.code;

      if (typeof code !== "undefined") {
        return _objectSpread(_objectSpread({}, res), headers || {});
      }

      return res;
    }
  }]);

  function ClientFetch(_ref) {
    var _this = this;

    var baseUrl = _ref.baseUrl,
        evoNetwork = _ref.evoNetwork;

    _classCallCheck(this, ClientFetch);

    this.chainId = evoNetwork;
    this.baseURL = baseUrl;
    this.instance = _axios["default"].create({
      baseURL: this.baseURL
    });
    this.instance.interceptors.request.use(function (config) {
      if (config.baseURL === _this.baseURL) {
        config.headers["EVO-NETWORK"] = capitalize(_this.chainId);
      }

      return config;
    }, function (error) {
      return Promise.reject(error);
    });
  }

  _createClass(ClientFetch, [{
    key: "$get",
    value: function $get(url, data) {
      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (data) opt.params = data;
      return this.instance.get(url, _objectSpread({}, opt)).then(function (response) {
        return ClientFetch.parseRes(response);
      });
    }
  }, {
    key: "$post",
    value: function $post(url, data, opt) {
      var body = data;

      if (data instanceof FormData) {
        body = data;
      } else if ((0, _isObject["default"])(data)) {
        body = _queryString["default"].stringify(data);
      }

      return this.instance.post(url, body, opt).then(function (response) {
        return ClientFetch.parseRes(response);
      });
    }
  }, {
    key: "$getWithRelativePath",
    value: function $getWithRelativePath(url) {
      return this.$get(url, {}, {
        baseURL: "/"
      });
    }
  }, {
    key: "$getAbi",
    value: function $getAbi(url) {
      return this.$getWithRelativePath("".concat(this.baseURL, "/abi/").concat(_chainMap["default"][this.chainId].coin).concat(url));
    }
  }, {
    key: "apiGasPrice",
    value: function apiGasPrice(data, isFixed) {
      if (isFixed) {
        return new Promise(function (resolve, reject) {
          // TODO
          resolve({
            "code": 0,
            "data": {
              "gas_price": {
                "fast": 10000000000,
                "safe": 1000000000,
                "standard": 1100000000
              },
              "nonce": 0
            },
            "detail": "success"
          });
        });
      }

      return this.$get("/api/eth/gas_price", data);
    }
  }, {
    key: "apiLogin",
    value: function apiLogin(data) {
      return this.$post("/api/login", data);
    }
  }, {
    key: "apiChallenge",
    value: function apiChallenge(data) {
      return this.$get("/api/challenge", data);
    }
  }, {
    key: "apiCallbaclTransaction",
    value: function apiCallbaclTransaction(data) {
      return this.$post("/api/eth/transaction", data);
    }
  }, {
    key: "apiCycleItering",
    value: function apiCycleItering(data) {
      return this.$get("/api/itering/cycle", data);
    }
  }, {
    key: "apiResponseQr",
    value: function apiResponseQr(data, iteringDomain) {
      var AuthorizationToken = "token:".concat((0, _v["default"])());
      var secretKey = "ffd95e82acd84c4343921d73f7683bb60b7322905ae477d8";

      var result = _objectSpread(_objectSpread({}, data), {}, {
        sign: new _md["default"]().update("".concat(AuthorizationToken, "-").concat(secretKey)).digest("hex")
      });

      return this.$post("/itering/link/set_rqcode", result, {
        headers: {
          AuthorizationToken: _jsBase.Base64.encode(AuthorizationToken)
        },
        baseURL: iteringDomain
      });
    }
  }]);

  return ClientFetch;
}();

exports["default"] = ClientFetch;