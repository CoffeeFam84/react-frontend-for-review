import React from 'react'
import styled from 'styled-components'
import { useMedia } from 'react-use'
import { Heading, Text } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useGetPriceData from 'hooks/useGetPriceData'

const Header = styled.div`
  padding: 32px 0px 0px 0px;
  background: url('/images/farm-bg-mobile.svg');

  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 24px;
    padding-right: 24px;
  }
`
const LogTitle = styled(Text)`
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: #FCFCFC;
`
const LogPrice = styled(Text)`
  fontWeight: 300; 
  fontSize: 16px;
  line-height: 24px;
  color: #FCFCFC;
  margin-right: 16px;
`

const Hero = () => {
  const TranslateString = useI18n()
  const isMobile = useMedia('(max-width: 970px)')
  const rbsPrice = useGetPriceData('rbs').toFixed(2)
  const rbtPrice = useGetPriceData('rbt').toString()
  const bnbPrice = useGetPriceData('bnb').toString()
  // console.log("rbt:", rbtPrice.toString(), " bnb:", bnbPrice.toString())
  const rbtPriceUSD = (parseFloat(rbtPrice === '' ? '0.0' : rbtPrice) / (1 / parseFloat(bnbPrice === '' ? '1.0' : bnbPrice))).toFixed(2)

  return (
    <>
      {!isMobile && <div style={{ display: 'flex', alignItems: 'center', padding: '12px 48px 16px 40px', width: '100%', position: 'absolute', top: 0 }}>
        <div style={{ borderRight: '1px solid white' }}>
          <LogTitle>
            RBS
          </LogTitle>
          <LogPrice>
            {rbsPrice === '' ? '$0' : '$'}{rbsPrice}
          </LogPrice>
        </div>
        <div style={{ marginLeft: 16 }}>
          <LogTitle>
            RBT
          </LogTitle>
          <LogPrice>
            ${rbtPriceUSD}
          </LogPrice>
        </div>
      </div>}
      <Header>
        <Heading color="#FCFCFC" mb="8px" mt={isMobile ? "8px" : "72px"} style={{ textAlign: 'center', fontSize: 34 }}>
          {TranslateString(500, 'Trade with ease')}
        </Heading>
        <Text mb="16px" style={{ textAlign: 'center', fontSize: 18, fontStyle: 'normal' }}>
          {TranslateString(502, 'ROBUSTSWAP - No bots, hassle-free & fast decentralized exchange.')}
        </Text>
      </Header>
    </>
  )
}

export default Hero
