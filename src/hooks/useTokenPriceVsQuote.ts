import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

const rbsAddress = "0x95336aC5f7E840e7716781313e1607F7C9D6BE25"
const rbsPairAddress = "0x4f8FD7B0A83E506d022d45ce0913BDD89596cf25"
const rbtAddress = "0x891e4554227385c5c740f9b483e935e3cbc29f01"
const rbtPairAddress = "0xFB3A3e8e9A1fBfDFB237442168A96eC84A331b1f"
const bnbPairAddress = "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16"
const bnbAddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"

const useTokenPriceVsQuote = (symbol: string) => {
  let cakeAddress = ""
  let quoteAddress = ""
  let param = ""
  switch (symbol) {
    case 'rbs':
      cakeAddress = rbsAddress
      quoteAddress = busdAddress
      param = rbsPairAddress
      break;
    case 'rbt':
      cakeAddress = rbtAddress
      quoteAddress = bnbAddress
      param = rbtPairAddress
      break;
    case 'bnb':
      cakeAddress = bnbAddress
      quoteAddress = busdAddress
      param = bnbPairAddress
      break;
  }
  const contract1 = useTokenContract(cakeAddress, false)
  const contract2 = useTokenContract(quoteAddress, false)
  const tokenBalanceLP = useSingleCallResult(contract1, 'balanceOf', [param ?? undefined])?.result?.[0]
  const quoteTokenBalanceLP = useSingleCallResult(contract2, 'balanceOf', [param ?? undefined])?.result?.[0]
  return useMemo(() => {
    if (tokenBalanceLP === undefined) return ''
    if (quoteTokenBalanceLP === undefined) return ''
    return new BigNumber(quoteTokenBalanceLP.toString()).div(new BigNumber(tokenBalanceLP.toString()))
  }, [tokenBalanceLP, quoteTokenBalanceLP])
}

export default useTokenPriceVsQuote