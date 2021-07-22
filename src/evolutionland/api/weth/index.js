import { Token } from '@uniswap/sdk'

let WethApi = {

  wethGetToken(symbol='WEHT', name='Wrapped ether') {
    return new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_WETH, 18, symbol, name)
  },

};

export default WethApi;
