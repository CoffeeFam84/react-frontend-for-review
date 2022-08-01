import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Flex, Input, Text } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { TranslateString } from 'utils/translateTextHelpers'
import QuestionHelper from '../QuestionHelper'

type SlippageProps = {
  content?: any
}

const MAX_SLIPPAGE = 5000
const RISKY_SLIPPAGE_LOW = 50
const RISKY_SLIPPAGE_HIGH = 500

const StyledSlippageToleranceSettings = styled.div`
  margin-bottom: 16px;
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
	  -webkit-appearance: none;
  }
  input[type=number] {
    -moz-appearance:textfield;
  }
`

const Option = styled.div`
  padding: 0 4px;
`

const Options = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;

  ${Option}:first-child {
    padding-left: 0;
  }

  ${Option}:last-child {
    padding-right: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 8px;
`

const predefinedValues = [
  { label: '0.1%', value: 0.1 },
  { label: '0.5%', value: 0.5 },
  { label: '1%', value: 1 }
]

const SlippageToleranceSettings = ({ content }: SlippageProps) => {
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [value, setValue] = useState(userSlippageTolerance / 100)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseFloat(inputValue))
  }
  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 100
      if (!Number.isNaN(rawValue) && rawValue >= 0 && rawValue < MAX_SLIPPAGE) {
        setUserslippageTolerance(rawValue)
        setError(null)
      } else if (rawValue < 0) {
        setError(content.percent)
      }
    } catch {
      setError(content.percent)
    }
  }, [content.percent, value, setError, setUserslippageTolerance])

  // Notify user if slippage is risky

  useEffect(() => {
    if (userSlippageTolerance < RISKY_SLIPPAGE_LOW) {
      setError(content.fail)
    } else if (userSlippageTolerance > RISKY_SLIPPAGE_HIGH) {
      setError(content.front)
    }
  }, [content.fail, content.front, userSlippageTolerance, setError])

  return (
    <StyledSlippageToleranceSettings>
      <Label>
        <Text style={{ fontWeight: 500, fontSize: 18 }}>
          {content.slippage}
        </Text>
        <QuestionHelper text={TranslateString(158, "Your transaction will revert if the price changes unfavorably by more than this percentage.")} />
      </Label>
      <Options>
        <Flex mb={['8px', 0]} mr={[0, '8px']}>
          {predefinedValues.map(({ label, value: predefinedValue }) => {
            const handleClick = () => setValue(predefinedValue)

            return (
              <Option key={predefinedValue}>
                <Button variant={value === predefinedValue ? 'tertiary' : 'primary'} onClick={handleClick} style={{ borderRadius: 28, color: '#5F47EE', fontWeight: 600, backgroundColor: 'transparent', border: '1px solid', width: 65, height: 32 }}>
                  {label}
                </Button>
              </Option>
            )
          })}
          <Option>
            <Input
              type="number"
              scale="lg"
              step={0.1}
              min={0.1}
              max={5}
              placeholder="0.5"
              value={value}
              onChange={handleChange}
              isWarning={error !== null}
              style={{ width: 73, height: 32, borderRadius: 16, border: 'none', backgroundColor: '#291A83' }}
            />
          </Option>
          <Option>
            <Text fontSize="18px">%</Text>
          </Option>
        </Flex>
      </Options>
      {error && (
        <Text mt="8px" color="failure">
          {error}
        </Text>
      )}
    </StyledSlippageToleranceSettings>
  )
}

export default SlippageToleranceSettings
