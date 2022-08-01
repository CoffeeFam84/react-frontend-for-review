import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { Credentials, StringTranslations } from '@crowdin/crowdin-api-client'
import useGetDocumentTitlePrice from 'hooks/useGetDocumentTitlePrice'
import { useEagerConnect } from 'hooks'
import Popups from '../components/Popups'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import AddLiquidity from './AddLiquidity'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import Swap from './Swap'
import Hero from './Hero'
import { RedirectPathToSwapOnly } from './Swap/redirects'
import { EN, allLanguages } from '../constants/localisation/languageCodes'
import { LanguageContext, LanguageObject } from '../hooks/LanguageContext'
import { TranslationsContext } from '../hooks/TranslationsContext'
import { ChainContext, ChainNames } from '../hooks/ChainContext'

import Menu from '../components/Menu'

const CACHE_KEY = 'robustSwapLanguage'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  justify-content: center;
  background-image: url('/images/exchange/back-trade-bg.png');
  background-size: cover;
  background-repeat: no-repeat;

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: cover;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    // background-image: url('/images/arch-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg'),
    //   url('/images/left-pancake.svg'), url('/images/right-pancake.svg');
    // background-repeat: no-repeat;
    // background-position: center 420px, 10% 230px, 90% 230px;
    // background-size: contain, 266px, 266px;
    min-height: 100vh;
  }
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(EN)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(EN)
  const [translations, setTranslations] = useState<Array<any>>([])
  const [chain, setChain] = useState(ChainNames.ETHEREUM);

  const apiKey = `${process.env.REACT_APP_CROWDIN_APIKEY}`
  const projectId = parseInt(`${process.env.REACT_APP_CROWDIN_PROJECTID}`)
  useGetDocumentTitlePrice('Exchange')
  const fileId = 6

  const credentials: Credentials = {
    token: apiKey,
  }

  const stringTranslationsApi = new StringTranslations(credentials)

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem('robustSwapLanguage')
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode)
      setSelectedLanguage(storedLang)
    } else {
      setSelectedLanguage(EN)
    }
  }, [])

  // const fetchTranslationsForSelectedLanguage = async () => {
  //   stringTranslationsApi
  //     .listLanguageTranslations(projectId, selectedLanguage.code, undefined, fileId, 200)
  //     .then((translationApiResponse) => {
  //       if (translationApiResponse.data.length < 1) {
  //         setTranslations(['error'])
  //       } else {
  //         setTranslations(translationApiResponse.data)
  //       }
  //     })
  //     .then(() => setTranslatedLanguage(selectedLanguage))
  //     .catch((error) => {
  //       setTranslations(['error'])
  //       console.error(error)
  //     })
  // }

  useEffect(() => {
    if (selectedLanguage) {
      // console.log(`import(\`../../../public/i18n/${selectedLanguage.code}.json\`)`)
      fetch(`./i18n/${selectedLanguage.code}.json`)
        .then((r) => r.json())
        // fetchTranslationsForSelectedLanguage(selectedLanguage)
        .then((translationApiResponse) => {
          if (translationApiResponse.data.length < 1) {
            setTranslations(['error'])
          } else {
            setTranslations(translationApiResponse.data)
          }
        })
        .then(() => setTranslatedLanguage(selectedLanguage))
        .catch((e) => {
          console.error('ERROR')
          console.error(e)
          setTranslations(['error'])
        })
    }
  }, [selectedLanguage, setTranslations])

  const handleLanguageSelect = (langObject: LanguageObject) => {
    setSelectedLanguage(langObject)
    localStorage.setItem(CACHE_KEY, langObject.code)
  }

  // useEffect(() => {
  //   if (selectedLanguage) {
  //     fetchTranslationsForSelectedLanguage()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedLanguage])

  return (
    <Suspense fallback={null}>
      <HashRouter>
        <AppWrapper>
          <LanguageContext.Provider
            value={{ selectedLanguage, setSelectedLanguage: handleLanguageSelect, translatedLanguage, setTranslatedLanguage }}
          >
            <TranslationsContext.Provider value={{ translations, setTranslations }}>
              <ChainContext.Provider value={{ chain, setChain }}>
                <Popups />
                <Menu>
                  <BodyWrapper>
                    <Hero />
                    <Switch>
                      <Route exact strict path="/swap" component={Swap} />
                      <Route exact strict path="/find" component={PoolFinder} />
                      <Route exact strict path="/pool" component={Pool} />
                      <Route exact path="/add" component={AddLiquidity} />
                      <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

                      {/* Redirection: These old routes are still used in the code base */}
                      <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                      <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                      <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />

                      <Route component={RedirectPathToSwapOnly} />
                    </Switch>
                    <Marginer />
                  </BodyWrapper>
                </Menu>
              </ChainContext.Provider>
            </TranslationsContext.Provider>
          </LanguageContext.Provider>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}
