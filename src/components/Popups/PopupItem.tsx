import React, { useCallback, useEffect } from 'react'
import { useMedia } from 'react-use'
import { X } from 'react-feather'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import styled, { ThemeContext } from 'styled-components'
import { animated, useSpring } from 'react-spring'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { PopupContent } from '../../state/application/actions'
import { useRemovePopup } from '../../state/application/hooks'
import TransactionPopup from './TransactionPopup'

const StyledClose = styled(X)`
  :hover {
    cursor: pointer;
  }
`
export const Popup = styled.div<{ isMobile: boolean }>`
  position: fixed;
  top: ${({ isMobile }) => isMobile ? "130px" : "70px"};;
  right: ${({ isMobile }) => isMobile ? "0px" : "46px"};
  width: ${({ isMobile }) => isMobile ? "100%" : ""};
  display: ${({ isMobile }) => isMobile ? "flex" : "block"};
  justify-content: ${({ isMobile }) => isMobile ? "center" : "unset"};
`

const Container = styled.div<{ isMobile: boolean }>`
  display: inline-block;
  margin: 0px ${({ isMobile }) => isMobile ? "auto" : "0px"};
  padding: 0px !important;
  background: linear-gradient(90.04deg, #0C0720 0.04%, #291A83 99.97%);
  border-radius: 10px;
  padding: 20px;
  padding-right: 35px;
  overflow: hidden;
  min-width: 290px;
`

const Fader = styled.div`
  height: 4px;
  background-color: ${({ theme }) => theme.colors.tertiary};
`

const AnimatedFader = animated(Fader)

export default function PopupItem({
  removeAfterMs,
  content,
  popKey
}: {
  removeAfterMs: number | null
  content: PopupContent
  popKey: string
}) {
  const isMobile = useMedia('(max-width: 970px)')
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
  const audioPlay = useSelector<AppState, AppState['user']['audioPlay']>((state) => state.user.audioPlay)
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  useEffect(() => {
    if (removeAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      removeThisPopup()
    }, removeAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [removeAfterMs, removeThisPopup])

  let popupContent
  if ('txn' in content) {
    const {
      txn: { hash, success, summary }
    } = content
    popupContent = <TransactionPopup hash={hash} success={success} summary={summary} />
    if (audioPlay) {
      const audio = document.getElementById('bgMusicDing') as HTMLAudioElement
      audio.loop = false;
      if (audio) {
        audio.play()
      }
    }
    setUserslippageTolerance(50)
  }
  // else if ('listUpdate' in content) {
  //   const {
  //     listUpdate: { listUrl, oldList, newList, auto }
  //   } = content
  //   popupContent = <ListUpdatePopup popKey={popKey} listUrl={listUrl} oldList={oldList} newList={newList} auto={auto} />
  // }

  const faderStyle = useSpring({
    from: { width: '100%' },
    to: { width: '0%' },
    config: { duration: removeAfterMs ?? undefined }
  })

  return (
    <>
      {('txn' in content) && <Popup isMobile={isMobile}>
        <Container isMobile={isMobile}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}>
            {popupContent}
            <StyledClose color='white' onClick={removeThisPopup} />
          </div>
          {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
        </Container>
      </Popup>
      }
    </>
  )
}
