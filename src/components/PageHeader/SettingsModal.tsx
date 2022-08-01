import React from 'react'
import { Modal } from '@robustswap-libs/uikit'
import { useMedia } from 'react-use'
import { TranslateString } from 'utils/translateTextHelpers'
import SlippageToleranceSetting from './SlippageToleranceSetting'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'
import SoundSetting from './SoundSetting'

type SettingsModalProps = {
  onDismiss?: () => void
  title?: string
  content?: any
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const SettingsModal = ({ onDismiss = defaultOnDismiss, title, content }: SettingsModalProps) => {
  const isMobile = useMedia('(max-width: 970px)')
  const panel = document.getElementsByClassName("LeftSideBar")[0]
  const marginLeft = isMobile ? 0 : panel?.clientWidth

  console.log("Modal:", TranslateString(142, "Settings"))

  return (
    <Modal title={title} onDismiss={onDismiss} margin={`0px 0px 0px ${marginLeft}px`}>
      <SlippageToleranceSetting content={content} />
      <TransactionDeadlineSetting content={content} />
      <SoundSetting content={content} />
    </Modal>
  )
}

export default SettingsModal
