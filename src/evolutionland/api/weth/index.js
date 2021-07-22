import { Token } from '@uniswap/sdk'

let WethApi = {

  wethGetToken() {
    return new Token(parseInt(this.env.CONTRACT.NETWORK), this.env.CONTRACT.TOKEN_WETH, 18, 'WHT', "Wrapped HT")
  },

};

export default WethApi;
