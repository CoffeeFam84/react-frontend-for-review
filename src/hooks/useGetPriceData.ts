import { useEffect, useState } from 'react'
import tokenPriceVsQuote from './useTokenPriceVsQuote'


type ApiResponse = {
  data: {
    [address: string]: {
      name: string
      symbol: string
      price: string
      price_BNB: string
    }
  }
  updated_at: string
}

/**
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */

const useGetPriceData = (symbol: string) => {

  const val = tokenPriceVsQuote(symbol)
  return Number(val.toString())
}

export default useGetPriceData
