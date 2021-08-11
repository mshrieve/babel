import { createContext, useContext } from 'react'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider(
  'https://rinkeby.infura.io/v3/7c1f2ac532a842dcb851fdbabee9ff16'
)
const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY).connect(
  provider
)
// const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
const EthContext = createContext({ signer })
const EthProvider = ({ children }) => {
  return (
    <EthContext.Provider value={{ signer }}>{children}</EthContext.Provider>
  )
}
const useEth = () => useContext(EthContext)

export { EthContext, EthProvider, useEth }
