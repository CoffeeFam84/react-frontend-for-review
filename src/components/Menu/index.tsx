import React, { useContext, useState } from 'react'
import { Menu as UikitMenu } from '@robustswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { allLanguages } from 'constants/localisation/languageCodes'
import { LanguageContext } from 'hooks/LanguageContext'
import { ChainContext } from 'hooks/ChainContext'
import useTheme from 'hooks/useTheme'
import useGetPriceData from 'hooks/useGetPriceData'
import useAuth from 'hooks/useAuth'
import { useEagerConnect } from 'hooks'
// import useGetLocalProfile from 'hooks/useGetLocalProfile'
import config from './config'
import configtw from './configtw'
import configcn from './configcn'

const Menu: React.FC = (props) => {
  useEagerConnect()

  const { account } = useWeb3React()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { chain, setChain } = useContext(ChainContext)
  const { isDark, toggleTheme } = useTheme()
  const { login, logout } = useAuth()

  const rbsPrice = useGetPriceData('rbs').toString()
  const rbtPrice = useGetPriceData('rbt').toString()
  const bnbPrice = useGetPriceData('bnb').toString()
  const rbsAddress = '0x95336aC5f7E840e7716781313e1607F7C9D6BE25'
  const rbtAddress = '0x891e4554227385c5c740f9b483e935e3cbc29f01'
  let links = config;
  if (selectedLanguage.code === 'zh-CN') {
    links = configcn;
  }
  else if (selectedLanguage.code === 'zh-TW') {
    links = configtw;
  }

  const rbtPriceUSD = (parseFloat(rbtPrice === '' ? '0.0' : rbtPrice) / (1 / parseFloat(bnbPrice === '' ? '1.0' : bnbPrice))).toFixed(2)

  return (
    <UikitMenu
      links={links}
      account={account as string}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage?.code || ''}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      rbsPriceUsd={parseFloat(rbsPrice)}
      rbsPriceLink={`https://bscscan.com/token/${rbsAddress}`}
      rbtPriceUsd={parseFloat(rbtPriceUSD)}
      rbtPriceLink={`https://bscscan.com/token/${rbtAddress}`}
      // profile={profile}
      {...props}
    />
  )
}

export default Menu
