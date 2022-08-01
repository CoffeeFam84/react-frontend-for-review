import { useEffect } from 'react'
import useGetPriceData from './useGetPriceData'

const useGetDocumentTitlePrice = (page: string) => {
  const cakePriceUsd = useGetPriceData('rbs').toFixed(2)

  const cakePriceUsdString = cakePriceUsd === ''
    ? ''
    : `$${Number(cakePriceUsd).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  useEffect(() => {
    document.title = `RobustSwap | ${cakePriceUsdString} | ${page}`
  }, [cakePriceUsdString, page])
}
export default useGetDocumentTitlePrice
