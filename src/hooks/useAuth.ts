import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { AppDispatch } from 'state'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { ConnectorNames } from '@robustswap-libs/uikit'
import { connectorsByName } from 'utils/web3React'
import { setupNetwork } from 'utils/wallet'
import { clearAllTransactions } from 'state/transactions/actions'

const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { chainId, activate, deactivate } = useWeb3React()
  // const { toastError } = useToast()

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID]
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork()
            if (hasSetup) {
              activate(connector)
            }
          } else {
            window.localStorage.removeItem("accountStatus")
            if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
              console.log("Provider Error")
              // toastError(t('Provider Error'), t('No provider was found'))
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector
                walletConnector.walletConnectProvider = null
              }
              console.log("Authorization Error")
              // toastError(t('Authorization Error'), t('Please authorize to access your account'))
            } else {
              console.log(error.name)
              // toastError(error.name, error.message)
            }
          }
        })
        console.log('chinId:', chainId);
      } else {
        console.log("Unable to find connector")
        // toastError(t('Unable to find connector'), t('The connector config is wrong'))
      }
    },
    [activate, chainId]
  )

  const logout = useCallback(() => {
    deactivate()
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.walletconnect.close()
      connectorsByName.walletconnect.walletConnectProvider = null
    }
    window.localStorage.removeItem("accountStatus")
    if (chainId) {
      dispatch(clearAllTransactions({ chainId }))
    }
  }, [deactivate, dispatch, chainId])

  return { login, logout }
}

export default useAuth
