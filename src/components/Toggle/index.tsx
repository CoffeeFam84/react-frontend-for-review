import React from 'react'
import styled from 'styled-components'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  border-radius: 14px;
  background: ${({ theme, isActive, isOnSwitch }) =>
    isActive ? (isOnSwitch ? theme.colors.primary : theme.colors.textDisabled) : 'none'};
  color: ${({ theme, isActive, isOnSwitch }) =>
    isActive ? (isOnSwitch ? '#FFFFFF' : 'white') : theme.colors.textDisabled};
  font-size: 0.825rem;
  font-weight: 400;
`

const StyledToggle = styled.div<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 4px;
  display: flex;
  width: 40px;
  height: 8px;
  cursor: pointer;
  outline: none;
  padding: 0;
  background-color: #6C60F7;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.25);
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  return (
    <StyledToggle id={id} isActive={isActive} onClick={toggle}>
      <ToggleElement isActive={isActive} isOnSwitch style={{ opacity: isActive ? '0' : '1', marginLeft: '-10%', marginTop: '-20%' }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#5F47EE', border: '1px solid #FCFCFC' }} />
      </ToggleElement>
      <ToggleElement isActive={!isActive} isOnSwitch={false} style={{ opacity: isActive ? '1' : '0', marginTop: '-20%' }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'white', border: '1px solid #FCFCFC' }} />
      </ToggleElement>
    </StyledToggle>
  )
}
