
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER } from '@uniswap/sdk'

function calculateSlippageAmount(value, slippage) {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

export default {
  calculateSlippageAmount
}