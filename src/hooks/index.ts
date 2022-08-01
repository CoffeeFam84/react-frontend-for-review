import { useEffect, useRef, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useWeb3React } from '@web3-react/core'
import { ConnectorNames } from 'utils/web3React'
import { simpleRpcProvider } from 'utils/providers'
import useAuth from './useAuth'

const _binanceChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc
      },
      set(bsc) {
        this.bsc = bsc

        resolve()
      },
    }),
  )

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> {
  const { library, chainId, ...web3React } = useWeb3React()
  const refEth = useRef(library)
  const [provider, setProvider] = useState(library || simpleRpcProvider)

  useEffect(() => {
    if (library !== refEth.current) {
      setProvider(library || simpleRpcProvider)
      refEth.current = library
    }
  }, [library])

  return { library: provider, chainId: chainId ?? parseInt(process.env.REACT_APP_CHAIN_ID, 10), ...web3React }
}

export function useEagerConnect() {
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem("accountStatus") as ConnectorNames

    if (connectorId) {
      const isConnectorBinanceChain = connectorId === ConnectorNames.BSC
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        _binanceChainListener().then(() => login(connectorId))

        return
      }

      login(connectorId)
    }
  }, [login])

  return true;
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
// export function useInactiveListener(suppress = false) {
//   const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

//   useEffect(() => {
//     const { ethereum } = window

//     if (ethereum && ethereum.on && !active && !error && !suppress) {
//       const handleChainChanged = () => {
//         // eat errors
//         activate(injected, undefined, true).catch((e) => {
//           console.error('Failed to activate after chain changed', e)
//         })
//       }

//       const handleAccountsChanged = (accounts: string[]) => {
//         if (accounts.length > 0) {
//           // eat errors
//           activate(injected, undefined, true).catch((e) => {
//             console.error('Failed to activate after accounts changed', e)
//           })
//         }
//       }

//       ethereum.on('chainChanged', handleChainChanged)
//       ethereum.on('accountsChanged', handleAccountsChanged)

//       return () => {
//         if (ethereum.removeListener) {
//           ethereum.removeListener('chainChanged', handleChainChanged)
//           ethereum.removeListener('accountsChanged', handleAccountsChanged)
//         }
//       }
//     }
//     return undefined
//   }, [active, error, suppress, activate])
// }
