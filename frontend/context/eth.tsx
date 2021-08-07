import { createContext, useContext } from 'react'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
const EthContext = createContext({ provider })
const EthProvider = ({ children }) => {
  return (
    <EthContext.Provider value={{ provider }}>{children}</EthContext.Provider>
  )
}
const useEth = () => useContext(EthContext)

export { EthContext, EthProvider, useEth }
