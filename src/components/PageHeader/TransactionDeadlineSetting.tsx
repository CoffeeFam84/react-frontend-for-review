import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Input, Text } from '@robustswap-libs/uikit'
import { useUserDeadline } from 'state/user/hooks'
import { TranslateString } from 'utils/translateTextHelpers'
import QuestionHelper from '../QuestionHelper'

type DeadlineProps = {
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

const Field = styled.div`
  align-items: center;
  display: inline-flex;

  & > ${Input} {
    max-width: 100px;
  }

  & > ${Text} {
    font-size: 14px;
    margin-left: 8px;
  }
`

const TransactionDeadlineSetting = ({ content }: DeadlineProps) => {
  const [deadline, setDeadline] = useUserDeadline()
  const [value, setValue] = useState(deadline / 60) // deadline in minutes
  const [error, setError] = useState<string | null>(null)

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

  return (
    <StyledTransactionDeadlineSetting>
      <Label>
        <Text style={{ fontWeight: 600, width: 'calc(100% - 80px)' }}>
          {content.deadtime}
          <QuestionHelper text={TranslateString(160, "Your transaction will revert if it is pending for more than this long.")} />
        </Text>
        <Input type="number" step="1" min="1" value={value} onChange={handleChange} style={{ width: 73, height: 32, borderRadius: 16, backgroundColor: '#291A83', border: 'none' }} />
      </Label>
      {error && (
        <Text mt="8px" color="failure">
          {error}
        </Text>
      )}
    </StyledTransactionDeadlineSetting>
  )
}

export default TransactionDeadlineSetting
