import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

const cakeAddress = "0x95336aC5f7E840e7716781313e1607F7C9D6BE25"

export const useMaxTransferLimitAmount = () => {
  const contract = useTokenContract(cakeAddress, false)
  const maxTransferLimitAmount = useSingleCallResult(contract, 'maxTransferLimitAmount')?.result?.[0]
  return useMemo(() => {
    if (maxTransferLimitAmount === undefined) return ''
    return new BigNumber(maxTransferLimitAmount.toString()).div(10 ** 18).toFixed(2)
  }, [maxTransferLimitAmount])
}

export const useSellTax = () => {
  const contract = useTokenContract(cakeAddress, false)
  const sellTax = useSingleCallResult(contract, 'transferTaxRateSell')?.result?.[0]
  return useMemo(() => {
    if (sellTax === undefined) return ''
    return (new BigNumber(sellTax).toNumber() / 100).toString()
  }, [sellTax])
}

export const useBuyTax = () => {
  const contract = useTokenContract(cakeAddress, false)
  const buyTax = useSingleCallResult(contract, 'transferTaxRateBuy')?.result?.[0]
  return useMemo(() => {
    if (buyTax === undefined) return ''
    return (new BigNumber(buyTax).toNumber() / 100).toString()
  }, [buyTax])
}
