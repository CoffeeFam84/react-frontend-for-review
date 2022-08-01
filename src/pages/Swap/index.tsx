import { ChainId, CurrencyAmount, JSBI, Percent, Token, Trade } from '@pancakeswap/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, Flex } from '@robustswap-libs/uikit'
import { ThemeContext } from 'styled-components'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import getSwapParameters, { ETHER_ADDRESS } from '@kyberswap/aggregator-sdk'
import AddressInputPanel from 'components/AddressInputPanel'
import Card, { GreyCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import ConfirmSwapModal from 'components/swap/ConfirmSwapModal'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CardNav from 'components/CardNav'
import { AutoRow, RowBetween } from 'components/Row'
import AdvancedSwapDetailsDropdown from 'components/swap/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from 'components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper, SwapMining } from 'components/swap/styleds'
import TradePrice from 'components/swap/TradePrice'
import TokenWarningModal from 'components/TokenWarningModal'
import SyrupWarningModal from 'components/SyrupWarningModal'
import ProgressSteps from 'components/ProgressSteps'

import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { useSwapMiningContract, useAggregationRouterContract } from 'hooks/useContract'
import { Field } from 'state/swap/actions'
import { tryParseAmount, useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useSingleCallResult } from 'state/multicall/hooks'
import { LinkStyledButton, TYPE } from 'components/Shared'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity, computeSlippageAdjustedAmounts } from 'utils/prices'
import Loader from 'components/Loader'
import { TranslateString } from 'utils/translateTextHelpers'
import PageHeader from 'components/PageHeader'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { utils } from 'ethers'
import callAggregatorAPI from 'utils/aggregator'
import AppBody from '../AppBody'

const { main: Main } = TYPE
export const ONE = JSBI.BigInt(1)

const Swap = () => {
  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const [rbsToken, empToken1] = [
    useCurrency("0x95336aC5f7E840e7716781313e1607F7C9D6BE25"),
    useCurrency("")
  ]
  const [rbtToken, empToken2] = [
    useCurrency("0x891e4554227385c5c740f9b483e935e3cbc29f01"),
    useCurrency("")
  ]
  const urlRbsToken: Token[] = useMemo(
    () => [rbsToken, empToken1]?.filter((c): c is Token => c instanceof Token) ?? [],
    [rbsToken, empToken1]
  )
  const urlRbtToken: Token[] = useMemo(
    () => [rbtToken, empToken2]?.filter((c): c is Token => c instanceof Token) ?? [],
    [rbtToken, empToken2]
  )
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const [isSyrup, setIsSyrup] = useState<boolean>(false)
  const [isRBS, setIsRBS] = useState<boolean>(false)
  const [isRBT, setIsRBT] = useState<boolean>(false)
  const [syrupTransactionType, setSyrupTransactionType] = useState<string>('')

  const [bestInputAmount, setBestInputAmount] = useState<CurrencyAmount | undefined>(undefined)
  const [bestOutputAmount, setBestOutputAmount] = useState<CurrencyAmount | undefined>(undefined)
  const [priceImpactWithAgg, setPriceImpactWithAgg] = useState<Percent>()

  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
    setIsRBS(false)
    setIsRBT(false)
  }, [])

  const handleConfirmSyrupWarning = useCallback(() => {
    setIsSyrup(false)
    setSyrupTransactionType('')
  }, [])

  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient, isAggregated } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo(bestInputAmount, bestOutputAmount)
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = v2Trade

  const parsedAmounts = showWrap
    ? {
      [Field.INPUT]: parsedAmount,
      [Field.OUTPUT]: parsedAmount,
    }
    : {
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
    }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  useEffect(() => {
    const inputCurrency = currencies[independentField]
    const outputCurrency = currencies[dependentField]
    const isExactIn: boolean = independentField === Field.INPUT
    if (inputCurrency && outputCurrency && typedValue && Number(typedValue)) {
      callAggregatorAPI(inputCurrency, outputCurrency, typedValue).then((res) => {
        if (res) {
          const inputAmount = tryParseAmount(formatUnits(res.inputAmount), inputCurrency)
          const outputAmount = tryParseAmount(formatUnits(res.outputAmount), outputCurrency)
          const amountInUsd = parseUnits(res.amountInUsd.toFixed(inputCurrency.decimals))
          const amountOutUsd = parseUnits(res.amountOutUsd.toFixed(outputCurrency.decimals))
          const priceImpactUsd = amountInUsd.sub(amountOutUsd)
          const priceImpactPercent = new Percent(JSBI.BigInt(priceImpactUsd.toString()), JSBI.BigInt(amountInUsd.toString()))
          setBestInputAmount(isExactIn ? inputAmount : outputAmount)
          setBestOutputAmount(isExactIn ? outputAmount : inputAmount)
          setPriceImpactWithAgg(priceImpactPercent)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue, independentField, dependentField])

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, isAggregated)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient
  )

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade, isAggregated, priceImpactWithAgg)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    if (swapCallback !== null) {
      setSwapState((prevState) => ({ ...prevState, attemptingTxn: true, swapErrorMessage: undefined, txHash: undefined }))
      swapCallback()
        .then((hash) => {
          setSwapState((prevState) => ({
            ...prevState,
            attemptingTxn: false,
            swapErrorMessage: undefined,
            txHash: hash,
          }))
        })
        .catch((error) => {
          setSwapState((prevState) => ({
            ...prevState,
            attemptingTxn: false,
            swapErrorMessage: error.message,
            txHash: undefined,
          }))
        })
    }
  }, [priceImpactWithoutFee, swapCallback, setSwapState])

  const handleAggregator = async () => {
    const res = await callAggregatorAPI(currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmounts[Field.INPUT].toExact())
    if (res) {
      const inputCurrency = currencies[Field.INPUT]
      const outputCurrency = currencies[Field.OUTPUT]
      const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
      const slippageAdjustedAmountOut = parseUnits(slippageAdjustedAmounts[Field.OUTPUT].toExact()).toString()
      const swapParameters = await getSwapParameters({
        chainId: ChainId.MAINNET,
        currencyInAddress: inputCurrency instanceof Token ? inputCurrency.address : ETHER_ADDRESS,
        currencyInDecimals: inputCurrency.decimals,
        amountIn: res.inputAmount,
        currencyOutAddress: outputCurrency instanceof Token ? outputCurrency.address : ETHER_ADDRESS,
        currencyOutDecimals: outputCurrency.decimals,
        tradeConfig: {
          minAmountOut: slippageAdjustedAmountOut,
          recipient: account,
          deadline: Date.now() + deadline * 1000
        },
        feeConfig: {
          isInBps: true,
          feeAmount: '0',
          feeReceiver: account,
          chargeFeeBy: 'currency_in',
        },
        customTradeRoute: JSON.stringify(res.swaps),
      })
      const { methodNames, args, value } = swapParameters
      const gasLimit = BigNumber.from(3000000)
      setSwapState((prevState) => ({ ...prevState, attemptingTxn: true, swapErrorMessage: undefined, txHash: undefined }))
      aggregationRouterContract[methodNames[0]](...args, { gasLimit, value, from: account })
        .then((response: any) => {
          setSwapState((prevState) => ({
            ...prevState,
            attemptingTxn: false,
            swapErrorMessage: undefined,
            txHash: response.hash,
          }))
        })
        .catch((error) => {
          setSwapState((prevState) => ({
            ...prevState,
            attemptingTxn: false,
            swapErrorMessage: error.message,
            txHash: undefined,
          }))
        })
    }
  }


  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  const addTransaction = useTransactionAdder()
  const swapMining = useSwapMiningContract(true)
  const aggregationRouterContract = useAggregationRouterContract()

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, showConfirm: false }))

    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [onUserInput, txHash, setSwapState])

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }))
  }, [trade])

  // This will check to see if the user has selected Syrup to either buy or sell.
  // If so, they will be alerted with a warning message.
  const checkForSyrup = useCallback(
    (selected: string, purchaseType: string) => {
      if (selected === 'syrup') {
        setIsSyrup(true)
        setSyrupTransactionType(purchaseType)
      }
    },
    [setIsSyrup, setSyrupTransactionType]
  )

  const checkForNative = useCallback(
    (selected: string) => {
      if (selected === 'rbs') {
        setIsRBS(true)
      } else if (selected === 'rbt') {
        setIsRBT(true)
      }
    },
    [setIsRBS, setIsRBT]
  )

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      if (inputCurrency.symbol.toLowerCase() === 'syrup') {
        checkForSyrup(inputCurrency.symbol.toLowerCase(), 'Selling')
      } else if (inputCurrency.symbol.toLowerCase() === 'rbs' || inputCurrency.symbol.toLowerCase() === 'rbt') {
        checkForNative(inputCurrency.symbol.toLowerCase())
      }
    },
    [onCurrencySelection, setApprovalSubmitted, checkForSyrup, checkForNative]
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      if (outputCurrency.symbol.toLowerCase() === 'syrup') {
        checkForSyrup(outputCurrency.symbol.toLowerCase(), 'Buying')
      } else if (outputCurrency.symbol.toLowerCase() === 'rbs' || outputCurrency.symbol.toLowerCase() === 'rbt') {
        checkForNative(outputCurrency.symbol.toLowerCase())
      }
    },
    [onCurrencySelection, checkForSyrup, checkForNative]
  )
  const handleWithdraw = useCallback(
    async () => {
      console.log('abc: ', swapMining)
      // const estimatedGas = await swapMining.estimateGas.takerWithdraw()
      // const estimatedGas = '30000000';
      // console.log('estimateGas: ', estimatedGas)
      return swapMining
        .takerWithdraw({
          // gasLimit: calculateGasMargin(estimatedGas),
          gasLimit: '5000000'
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Widthdraw Trade Mining RBS`
          })
        })
        .catch((error: Error) => {
          console.error('Failed to approve token', error)
          throw error
        })
    },
    [addTransaction, swapMining]
  )

  const [claimableRBS, setClaimableRBS] = useState<string>("0.0000")
  const claimableBalance = useSingleCallResult(swapMining, 'getReward', [account])?.result
  // console.log('claimableBalance: ', claimableBalance[0]?.toString(), claimableBalance[1]?.div(BigNumber.from(10).pow(18)).toString())

  useEffect(() => {
    //   // console.log('eeror')
    //   // setClaimableRBS("0.0145")
    //   // const amount = await swapMining.getUserReward(0, 0x6f837e2DbAa6F4A76806861f518eF3d097AA0c3B); 
    if (claimableBalance !== undefined)
      //     // console.log('claimableBalance: ', claimableBalance)
      setClaimableRBS(Number.parseFloat(utils.formatEther(claimableBalance[0])).toFixed(4).toString())
  }, [claimableBalance])

  return (
    <>
      <TokenWarningModal
        isOpen={(urlLoadedTokens.length > 0 && !dismissTokenWarning) || isRBS || isRBT}
        tokens={
          (urlLoadedTokens.length > 0 && !dismissTokenWarning) ? urlLoadedTokens :
            isRBS ? urlRbsToken : urlRbtToken
        }
        onConfirm={handleConfirmTokenWarning}
      />
      <SyrupWarningModal
        isOpen={isSyrup}
        transactionType={syrupTransactionType}
        onConfirm={handleConfirmSyrupWarning}
      />
      <CardNav />
      <SwapMining>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="16px" color="#fff">
            {TranslateString(10042, "Trade Mining Reward")} {claimableRBS} RBS
          </Text>
          <Button
            size='sm'
            onClick={handleWithdraw}
          >
            Withdraw
          </Button>
        </Flex>
      </SwapMining>
      <AppBody>
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={!isAggregated ? handleSwap : handleAggregator}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
            priceImpactWithAgg={priceImpactWithAgg}
          />
          <PageHeader title={TranslateString(278, "Swap")} description={TranslateString(138, "Trade tokens in an instant")} />
          <CardBody>
            <AutoColumn gap="8px">
              <CurrencyInputPanel
                label={
                  independentField === Field.OUTPUT && !showWrap && trade
                    ? 'From (estimated)'
                    : TranslateString(76, 'From')
                }
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
              />
              <AutoColumn justify="space-between">
                <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable>
                    <IconButton
                      onClick={() => {
                        setApprovalSubmitted(false) // reset 2 step UI for approvals
                        onSwitchTokens()
                      }}
                      style={{ borderRadius: '50%', backgroundColor: 'transparent' }}
                      size="sm"
                    >
                      <ArrowDownIcon width="24px" />
                    </IconButton>
                  </ArrowWrapper>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                      + Add a send (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
              </AutoColumn>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={
                  independentField === Field.INPUT && !showWrap && trade ? 'To (estimated)' : TranslateString(80, 'To')
                }
                showMaxButton={false}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
              />

              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                    <ArrowWrapper clickable={false}>
                      <ArrowDown size="16" />
                    </ArrowWrapper>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      - Remove send
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}

              {showWrap ? null : (
                <Card padding=".25rem .75rem 0 .75rem" borderRadius="20px">
                  <AutoColumn gap="4px">
                    <RowBetween align="center">
                      <Text fontSize="14px" color="#A0B9FB">
                        {TranslateString(359, "Price")}
                      </Text>
                      <TradePrice
                        price={trade?.executionPrice}
                        showInverted={showInverted}
                        setShowInverted={setShowInverted}
                      />
                    </RowBetween>
                    <RowBetween align="center">
                      <Text fontSize="14px" color="#A0B9FB">
                        {TranslateString(140, "Slippage Tolerance")}
                      </Text>
                      <Text fontSize="14px">{allowedSlippage / 100}%</Text>
                    </RowBetween>
                  </AutoColumn>
                </Card>
              )}
            </AutoColumn>
            <BottomGrouping>
              {!account ? (
                <ConnectWalletButton fullWidth />
              ) : showWrap ? (
                <Button disabled={Boolean(wrapInputError)} onClick={onWrap} fullWidth>
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                </Button>
              ) : noRoute && userHasSpecifiedInputOutput ? (
                <GreyCard style={{ textAlign: 'center' }}>
                  <Main mb="4px">Insufficient liquidity for this trade.</Main>
                </GreyCard>
              ) : showApproveFlow ? (
                <RowBetween>
                  <Button
                    onClick={approveCallback}
                    disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    style={{ width: '48%' }}
                    variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        Approving <Loader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                      'Approved'
                    ) : (
                      `Approve ${currencies[Field.INPUT]?.symbol}`
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap()
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        })
                      }
                    }}
                    style={{ width: '48%' }}
                    id="swap-button"
                    disabled={
                      !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                    }
                    variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                  >
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact High`
                      : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                  </Button>
                </RowBetween>
              ) : (
                <Button
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      })
                    }
                  }}
                  id="swap-button"
                  disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                  variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'subtle'}
                  fullWidth
                >
                  {swapInputError ||
                    (priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact Too High`
                      : `SWAP${priceImpactSeverity > 2 ? ' Anyway' : ''}`)}
                </Button>
              )}
              {showApproveFlow && <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />}
              {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            </BottomGrouping>
          </CardBody>
        </Wrapper>
      </AppBody>
      <AdvancedSwapDetailsDropdown trade={trade} priceImpactWithAgg={priceImpactWithAgg} />
    </>
  )
}

export default Swap
