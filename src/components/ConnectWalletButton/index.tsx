import React from 'react'
import { useMedia } from 'react-use'
import { useWeb3React } from '@web3-react/core'
import { Button, ButtonProps, useWalletModal } from '@robustswap-libs/uikit'
import useAuth from 'hooks/useAuth'
import { TranslateString } from 'utils/translateTextHelpers'
import { margin } from 'polished'

const UnlockButton: React.FC<ButtonProps> = props => {
  const { account, activate, deactivate } = useWeb3React()
  const { login, logout } = useAuth()

  // const handleLogin = (connectorId: ConnectorId) => {
  //   if (connectorId === 'walletconnect') {
  //     return activate(walletconnect)
  //   }
  //   return activate(injected)
  // }

  const isMobile = useMedia('(max-width: 970px)')
  const panel = document.getElementsByClassName("LeftSideBar")[0]
  const marginLeft = isMobile ? 0 : panel?.clientWidth;
  const { onPresentConnectModal } = useWalletModal(login, `${marginLeft}px`, logout, account as string)

  return (
    <Button variant="subtle" onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, 'UNLOCK WALLET')}
    </Button>
  )
}

export default UnlockButton
