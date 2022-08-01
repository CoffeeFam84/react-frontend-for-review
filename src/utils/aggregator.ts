import qs from 'qs'
import { parseUnits } from 'ethers/lib/utils'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { wrappedCurrency } from './wrappedCurrency'

const callAggregatorAPI = async (inputCurrency: Currency, outputCurrency: Currency, inputAmount: string) => {

  const inputToken = wrappedCurrency(inputCurrency, ChainId.MAINNET)
  const outputToken = wrappedCurrency(outputCurrency, ChainId.MAINNET)

  const params = {
    tokenIn: inputToken.address,
    tokenOut: outputToken.address,
    amountIn: parseUnits(inputAmount).toString()
  }

  const response = await fetch(
    `https://aggregator-api.kyberswap.com/bsc/route?${qs.stringify({ ...params })}`
  )
  const quote = response.json()
  return quote
}

export default callAggregatorAPI
