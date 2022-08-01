import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Toggle from 'components/Toggle'
import { Text } from '@robustswap-libs/uikit'
import { useAudioModeManager, useUserDeadline } from 'state/user/hooks'

type SoundProps = {
  content?: any
}

const StyledTransactionDeadlineSetting = styled.div`
  margin-bottom: 16px;
  margin-bottom: 16px;
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
	  -webkit-appearance: none;
  }
  input[type=number] {
    -moz-appearance:textfield;
  }
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 8px;
`

const TransactionDeadlineSetting = ({ content }: SoundProps) => {
  const [deadline, setDeadline] = useUserDeadline()
  const [value, setValue] = useState(deadline / 60) // deadline in minutes
  const [error, setError] = useState<string | null>(null)
  const [audioPlay, toggleSetAudioMode] = useAudioModeManager()

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseInt(inputValue, 10))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 60
      if (!Number.isNaN(rawValue) && rawValue > 0) {
        setDeadline(rawValue)
        setError(null)
      } else {
        setError(content.validD)
      }
    } catch {
      setError(content.validD)
    }
  }, [content.validD, value, setError, setDeadline])

  console.log(content)

  return (
    <StyledTransactionDeadlineSetting>
      <Label>
        <div style={{ width: 'calc(100% - 50px)' }}>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>
            {content.soundsH}
          </Text>
          <Text style={{ fontWeight: 500, width: '218px', fontSize: 10, lineHeight: '14px', color: '#A0B9FB' }}>
            {content.soundsC}
          </Text>
        </div>
        <Toggle id="toggle" isActive={audioPlay} toggle={toggleSetAudioMode} />
      </Label>
    </StyledTransactionDeadlineSetting>
  )
}

export default TransactionDeadlineSetting
