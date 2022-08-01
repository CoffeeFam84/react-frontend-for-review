import { Token } from '@pancakeswap/sdk'
import { transparentize } from 'polished'
import { Button, Text } from '@robustswap-libs/uikit'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AlertTriangle } from 'react-feather'
import {
  useSellTax,
  useBuyTax,
  useMaxTransferLimitAmount
} from 'hooks/useTokenBalance'
import BigNumber from 'bignumber.js'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens } from '../../hooks/Tokens'
import { ExternalLink, TYPE } from '../Shared'
import { getBscScanLink, shortenAddress } from '../../utils'
import CurrencyLogo from '../CurrencyLogo'
import Modal from '../Modal'
import { AutoRow, RowBetween } from '../Row'
import { AutoColumn } from '../Column'

const { main: Main, blue: Blue } = TYPE

const Wrapper = styled.div<{ error: boolean }>`
  background: ${({ theme }) => transparentize(0.6, theme.colors.tertiary)};
  padding: 0.75rem;
  border-radius: 16px;
`

const WarningContainer = styled.div<{ native: boolean }>`
  max-width: 420px;
  width: 100%;
  padding: 1rem;
  background: rgba(242, 150, 2, 0.05);
  border: ${({ native }) => native ? '1px solid #f3841e' : '1px solid yellow'};
  border-radius: 20px;
  overflow: auto;
`

const StyledWarningIcon = styled(AlertTriangle)`
  stroke: ${({ theme }) => theme.colors.failure};
`

interface TokenWarningCardProps {
  token?: Token
}

function TokenWarningCard({ token }: TokenWarningCardProps) {
  const { chainId } = useActiveWeb3React()

  const tokenSymbol = token?.symbol?.toLowerCase() ?? ''
  const tokenName = token?.name?.toLowerCase() ?? ''
  const sellTax = useSellTax()
  const buyTax = useBuyTax()
  const limitAmount = useMaxTransferLimitAmount()

  const allTokens = useAllTokens()

  const duplicateNameOrSymbol = useMemo(() => {
    if (!token || !chainId) return false

    return Object.keys(allTokens).some((tokenAddress) => {
      const userToken = allTokens[tokenAddress]
      if (userToken.equals(token)) {
        return false
      }
      return userToken.symbol?.toLowerCase() === tokenSymbol || userToken.name?.toLowerCase() === tokenName
    })
  }, [token, chainId, allTokens, tokenSymbol, tokenName])

  if (!token) return null

  return (
    <Wrapper error={duplicateNameOrSymbol}>
      {tokenSymbol === 'rbs' ?
        <>
          <div style={{ display: 'flex' }}>
            <StyledWarningIcon style={{ stroke: 'yellow', width: 40 }} />
            <div style={{ marginLeft: 8 }}>
              <Text style={{ marginBottom: 8 }}>Click settings and set slippage tolerance to:</Text>
              <Text><b>Buying</b>: {buyTax}</Text>
              <Text style={{ marginBottom: 8 }}><b>Selling</b>: {sellTax}</Text>
              <Text><b>Amount Limit</b>: {limitAmount} <b>RBS</b></Text>
              <Text style={{ marginTop: 8, marginBottom: 8 }}>• RBS taxes each transaction for automatic liquidity generation.</Text>
              <Text>• Multiple smaller amount transactions required if transacting above the amount limit.</Text>
            </div>
          </div>
        </> :
        tokenSymbol === 'rbt' ?
          <>
            <div style={{ display: 'flex' }}>
              <StyledWarningIcon style={{ stroke: 'yellow', width: 40 }} />
              <div style={{ marginLeft: 8 }}>
                <Text>Click settings and set slippage tolerance to 1 - 2%</Text>
                <Text style={{ marginTop: 16, marginBottom: 8 }}>Warning: <b>DO NOT</b> exceed 2% slippage tolerance to avoid front-running bots.</Text>
                <Text>• RBT burns 1% from every transaction.</Text>
              </div>
            </div>
          </> :
          <AutoRow gap="6px">
            <AutoColumn gap="24px">
              <CurrencyLogo currency={token} size="16px" />
              <div> </div>
            </AutoColumn>
            <AutoColumn gap="10px" justify="flex-start">
              <Main>
                {token && token.name && token.symbol && token.name !== token.symbol
                  ? `${token.name} (${token.symbol})`
                  : token.name || token.symbol}{' '}
              </Main>
              {chainId && (
                <ExternalLink style={{ fontWeight: 400 }} href={getBscScanLink(chainId, token.address, 'token')}>
                  <Blue title={token.address}>{shortenAddress(token.address)} (View on BscScan)</Blue>
                </ExternalLink>
              )}
            </AutoColumn>
          </AutoRow>}
    </Wrapper>
  )
}

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm,
}: {
  isOpen: boolean
  tokens: Token[]
  onConfirm: () => void
}) {
  const [understandChecked, setUnderstandChecked] = useState(false)
  const toggleUnderstand = useCallback(() => setUnderstandChecked((uc) => !uc), [])
  const nativeToken = tokens.filter(x => { return x.symbol === 'RBS' || x.symbol === 'RBT' })[0]

  const handleDismiss = useCallback(() => null, [])
  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
      <WarningContainer className="token-warning-container" native={nativeToken === null}>
        <AutoColumn gap="lg">
          <AutoRow gap="6px">
            {nativeToken ?
              <Text color="white" fontSize="20px" style={{ fontWeight: 800 }}>
                TRADING {nativeToken?.symbol}
              </Text> :
              <>
                <StyledWarningIcon />
                <Text color="failure">Token imported</Text>
              </>
            }
          </AutoRow>
          {!nativeToken && <>
            <Text>
              Anyone can create an BEP20 token on BSC with <em>any</em> name, including creating fake versions of existing
              tokens and tokens that claim to represent projects that do not have a token.
            </Text>
            <Text>
              This interface can load arbitrary tokens by token addresses. Please take extra caution and do your research
              when interacting with arbitrary BEP20 tokens.
            </Text>
            <Text>
              If you purchase an arbitrary token, <strong>you may be unable to sell it back.</strong>
            </Text></>
          }
          {tokens.map((token) => {
            return <TokenWarningCard key={token.address} token={token} />
          })}
          <RowBetween>
            <div>
              <label htmlFor="understand-checkbox" style={{ cursor: 'pointer', userSelect: 'none' }}>
                <input
                  id="understand-checkbox"
                  type="checkbox"
                  className="understand-checkbox"
                  checked={understandChecked}
                  onChange={toggleUnderstand}
                />{' '}
                <Text as="span" ml="4px">
                  I understand
                </Text>
              </label>
            </div>
            <Button
              disabled={!understandChecked}
              variant="subtle"
              style={{ width: '140px' }}
              className="token-dismiss-button"
              onClick={() => {
                setUnderstandChecked(false)
                onConfirm()
              }}
            >
              Continue
            </Button>
          </RowBetween>
        </AutoColumn>
      </WarningContainer>
    </Modal >
  )
}
