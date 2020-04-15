import Ethereum from './chain/ethereum/index'
import Tronweb from './chain/tron/index'
import ethEvolutionLand from './evolutionland/ethereum'
import tronEvolutionLand from './evolutionland/tron'
import units from './evolutionland/utils/unitConversion'

/**
 * @constructor
 * Evolution
 */
class Evolution {
    constructor(options = {}) {
        this.web3js = null
        this.tronweb = null
        this.units = units
    }

    /**
     * create web3js instance.
     * @param config [provider: A URL or one of the Web3 provider classes.]
     */
    async createWeb3js(config) {
        this.web3js = await Ethereum.createWeb3js(config)
    }

    /**
     * create tronweb instance
     * @param config [fullNode, solidityNode, eventServer, privateKey] You can also set a [fullNode]
     */
    createTronweb(config) {
        this.tronweb = Tronweb.createTronweb(config)
    }

    /**
     * create a instance for interacting with Evolution Land
     * @param chain ['ethereum', 'tron']
     * @param env Ethereum for ['main','ropsten']、 Tron for ['main', 'shasta']
     * @returns {*}
     */
    createEvolutionLand(chain, env, option) {
        switch (chain) {
            case 'ethereum':
                return this.ethEvoland = new ethEvolutionLand(this.web3js, env, option)
            case 'tron':
                return this.tronEvoland = new tronEvolutionLand(this.tronweb, env, option)
            default:
                return null;
        }
    }
}

window.Evolution = Evolution;

export default Evolution;
