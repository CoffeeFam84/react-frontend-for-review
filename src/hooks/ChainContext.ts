import React, { createContext } from "react";

export enum ChainNames {
  ETHEREUM = 'ethereum',
  BNBCHAIN = 'BNBchain',
  POLYGON = 'polygon',
  FANTOM = 'fantom',
  CRONOS = 'cronos',
  AVALANCHE = 'avalanche',
  OASIS = 'oasis',
  VELAS = 'velvas'
}

interface ChainState {
  chain: ChainNames
  setChain: (chain: ChainNames) => void
}

const defaultChainState: ChainState = {
  chain: ChainNames.ETHEREUM,
  setChain: (): void => undefined
}

export const ChainContext = createContext(defaultChainState as ChainState);
export default ChainContext;