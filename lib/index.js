"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime.js");

var _index = _interopRequireDefault(require("./chain/ethereum/index"));

var _index2 = _interopRequireDefault(require("./chain/tron/index"));

var _ethereum = _interopRequireDefault(require("./evolutionland/ethereum"));

var _tron = _interopRequireDefault(require("./evolutionland/tron"));

var _crab = _interopRequireDefault(require("./evolutionland/crab"));

var _heco = _interopRequireDefault(require("./evolutionland/heco"));

var _bsc = _interopRequireDefault(require("./evolutionland/bsc"));

var _unitConversion = _interopRequireDefault(require("./evolutionland/utils/unitConversion"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @constructor
 * Evolution
 */
var Evolution = /*#__PURE__*/function () {
  function Evolution() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Evolution);

    this.web3js = null;
    this.tronweb = null;
    this.units = _unitConversion["default"];
  }
  /**
   * create web3js instance.
   * @param config [provider: A URL or one of the Web3 provider classes.]
   */


  _createClass(Evolution, [{
    key: "createWeb3js",
    value: function () {
      var _createWeb3js = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(config) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _index["default"].createWeb3js(config);

              case 2:
                this.web3js = _context.sent;

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createWeb3js(_x) {
        return _createWeb3js.apply(this, arguments);
      }

      return createWeb3js;
    }()
    /**
     * create tronweb instance
     * @param config [fullNode, solidityNode, eventServer, privateKey] You can also set a [fullNode]
     */

  }, {
    key: "createTronweb",
    value: function createTronweb(config) {
      this.tronweb = _index2["default"].createTronweb(config);
    }
    /**
     * create a instance for interacting with Evolution Land
     * @param chain ['ethereum', 'tron']
     * @param env Ethereum for ['main','ropsten']、 Tron for ['main', 'shasta']
     * @returns {*}
     */

  }, {
    key: "createEvolutionLand",
    value: function createEvolutionLand(chain, env, option) {
      switch (chain) {
        case 'ethereum':
          this.ethEvoland = new _ethereum["default"](this.web3js, env, option);
          return this.ethereumEvoland = this.ethEvoland;

        case 'tron':
          return this.tronEvoland = new _tron["default"](this.tronweb, env, option);

        case 'crab':
          return this.crabEvoland = new _crab["default"](this.web3js, env, option);

        case 'heco':
          return this.hecoEvoland = new _heco["default"](this.web3js, env, option);

        case 'bsc':
          return this.bscEvoland = new _bsc["default"](this.web3js, env, option);

        default:
          return null;
      }
    }
  }]);

  return Evolution;
}();

window.Evolution = Evolution;
var _default = Evolution;
exports["default"] = _default;