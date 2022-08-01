import React, { useMemo, useCallback } from 'react'
import { Button, CheckmarkCircleIcon, ErrorIcon, Flex, LinkExternal, Text, Modal } from '@robustswap-libs/uikit'
import { useMedia } from 'react-use'
import { useDispatch } from 'react-redux'
import { useActiveWeb3React } from 'hooks'
import { getBscScanLink } from 'utils'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { AppDispatch } from 'state'
import { TranslateString } from 'utils/translateTextHelpers'
import { clearAllTransactions } from 'state/transactions/actions'
import styled from 'styled-components'
import Loader from 'components/Loader'

type RecentTransactionsModalProps = {
  onDismiss?: () => void
  title?: string
  content?: any
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => b.addedTime - a.addedTime

const getRowStatus = (sortedRecentTransaction: TransactionDetails) => {
  const { hash, receipt } = sortedRecentTransaction

  if (!hash) {
    return { icon: <Loader />, color: 'text' }
  }

  if (hash && receipt?.status === 1) {
    return { icon: <CheckmarkCircleIcon color="success" />, color: 'success' }
  }

  return { icon: <ErrorIcon color="failure" />, color: 'failure' }
}

const Divider = styled.div`
  width: 100%;
  height: 0px;
  margin-top: 4px;
  margin-bottom: 24px;
  border-top: 1px solid #3924B5;
`

const RecentTransactionsModal = ({ onDismiss = defaultOnDismiss, title, content }: RecentTransactionsModalProps) => {
  const { account, chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()
  const dispatch = useDispatch<AppDispatch>()

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  // Logic taken from Web3Status/index.tsx line 175
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const isMobile = useMedia('(max-width: 970px)')
  const panel = document.getElementsByClassName("LeftSideBar")[0]
  const marginLeft = isMobile ? 0 : panel?.clientWidth;

  return (
    <Modal title={title} onDismiss={onDismiss} margin={`0px 0px 0px ${marginLeft}px`}>
      <Divider />
      {!account && (
        <Flex flexDirection="column">
          <Text mb="8px" bold>
            {content.connect}
          </Text>
        </Flex>
      )}
      {account && chainId && sortedRecentTransactions.length === 0 && (
        <Flex flexDirection="column">
          <Text mb="8px" bold>
            {content.nrecent}
          </Text>
        </Flex>
      )}
      {account && chainId && sortedRecentTransactions.length !== 0 && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text mb="8px" bold>
            {title}
          </Text>
          <Button style={{ width: 70, height: 25, fontSize: 10, padding: 0, marginBottom: 8 }} onClick={clearAllTransactionsCallback}>
            {content.clear}
          </Button>
        </Flex>
      )}
      {account &&
        chainId &&
        sortedRecentTransactions.map((sortedRecentTransaction) => {
          const { hash, summary } = sortedRecentTransaction
          const { icon, color } = getRowStatus(sortedRecentTransaction)

          return (
            <>
              <Flex key={hash} alignItems="center" justifyContent="space-between" mb="4px">
                <LinkExternal href={getBscScanLink(chainId, hash, 'transaction')} color={color}>
                  {summary ?? hash}
                </LinkExternal>
                {icon}
              </Flex>
            </>
          )
        })}
    </Modal>
  )
}

export default RecentTransactionsModal
