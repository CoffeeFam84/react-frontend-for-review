import { ChainId } from '@pancakeswap/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B', // TODO
  // [ChainId.TESTNET]: '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576'
  // [ChainId.TESTNET]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A' // Kovan
  [ChainId.TESTNET]: '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C'

}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
