import React from 'react'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem } from '@robustswap-libs/uikit'
import { darken } from 'polished'
import { NavLink, Link as HistoryLink } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { RowBetween } from 'components/Row'
import QuestionHelper from 'components/QuestionHelper'
import TranslatedText from 'components/TranslatedText'
import PageHeader from 'components/PageHeader'
import { TranslateString } from 'utils/translateTextHelpers'

const Tabs = styled.div`
  margin-bottom:8px;
`

const activeClassName = 'ACTIVE'

const StyledAbsoluteLink = styled.a`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textDisabled};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.colors.text)};
  }
`

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textDisabled};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.colors.text)};
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.colors.text};
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  return (
    <Tabs style={{ marginBottom: '20px' }}>
      <StyledNavLink id="swap-nav-link" to="/swap" isActive={() => active === 'swap'}>
        <TranslatedText translationId={278}>Swap</TranslatedText>
      </StyledNavLink>
      <StyledNavLink id="pool-nav-link" to="/pool" isActive={() => active === 'pool'}>
        <TranslatedText translationId={74}>Pool</TranslatedText>
      </StyledNavLink>
    </Tabs>
  )
}

export const Nav = ({ activeIndex = 0 }: { activeIndex?: number }) => (
  <ButtonMenu activeIndex={activeIndex} size="sm" variant="subtle">
    <ButtonMenuItem id="swap-nav-link" to="/swap" as={HistoryLink}>
      <TranslatedText translationId={278}>Swap</TranslatedText>
    </ButtonMenuItem>
    <ButtonMenuItem id="pool-nav-link" to="/pool" as={HistoryLink}>
      <TranslatedText translationId={280}>Liquidity</TranslatedText>
    </ButtonMenuItem>
  </ButtonMenu>
)

export function FindPoolTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{TranslateString(318, "Import Pool")}</ActiveText>
        <QuestionHelper text={TranslateString(319, "Use this tool to find pairs that don't automatically appear in the interface.")} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding, currencyA, currencyB }: { adding: boolean, currencyA?: string, currencyB?: string }) {
  const removeTitle = TranslateString(297, "Remove Liquidity")
  const removeDescription = `To receive ${currencyA} and ${currencyB}`

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem', paddingBottom: 0 }}>
        <div style={{ display: 'flex', width: '100%' }}>
          <HistoryLink to="/pool" style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: 12 }}>
            <StyledArrowLeft />
          </HistoryLink>
          {adding && <PageHeader title={TranslateString(296, "Add Liquidity")} description={TranslateString(298, "Add liquidity to receive LP tokens")} />}
          {!adding && <PageHeader title={removeTitle} description={removeDescription} />}
        </div>
      </RowBetween>
    </Tabs>
  )
}
