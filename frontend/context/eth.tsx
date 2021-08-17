import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect
} from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

// const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY).connect(
//   provider
// )
// const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
const EthContext = createContext({
  signer: undefined,
  address: undefined,
  loginWeb3: undefined,
  logoutWeb3: undefined,
  chainId: 0,
  blockNumber: 0
})

const EthProvider = ({ children }) => {
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  const [address, setAddress] = useState(undefined)
  const [web3Modal, setWeb3Modal] = useState(undefined)
  const [chainId, setChainId] = useState(0)
  const [blockNumber, setBlockNumber] = useState(0)
  useEffect(() => {
    setWeb3Modal(
      new Web3Modal({
        // network: 'localhost',
        // cacheProvider: true,
        providerOptions: {}
      })
    )
  }, [])

  // set the provider and the signer
  // set up provider event subscriptions
  const loginWeb3 = useCallback(async () => {
    if (!web3Modal) return
    const web3Provider = await web3Modal.connect()
    // the (web3) provider from web3modal has the event subscriptions
    web3Provider.on('chainChanged', (chainId) => {
      console.log(`chain changed to ${chainId}`)
      setChainId(chainId)
      setProvider(new ethers.providers.Web3Provider(web3Provider))
    })
    web3Provider.on('accountsChanged', () => {
      console.log(`account changed`)
      setProvider(new ethers.providers.Web3Provider(web3Provider))
    })
    web3Provider.on('disconnect', (code, reason) => {
      console.log(code, reason)
      logoutWeb3()
    })
    const provider = new ethers.providers.Web3Provider(web3Provider)
    provider.on('block', (blockNumber) => {
      setBlockNumber(blockNumber)
    })
    setProvider(provider)
  }, [web3Modal, setProvider])

  // handle 'logging out' of web3
  const logoutWeb3 = useCallback(async () => {
    if (!web3Modal) return
    await web3Modal.clearCachedProvider()
    if (
      provider &&
      provider.provider &&
      typeof provider.provider.disconnect == 'function'
    ) {
      await provider.provider.disconnect()
      setSigner(undefined)
    }
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }, [web3Modal])

  // initial login
  useEffect(() => {
    if (!web3Modal) return
    console.log('login web3')
    loginWeb3()
  }, [web3Modal])

  // set signer, if provider changes
  useEffect(() => {
    if (provider && provider.getSigner) {
      const signer = provider.getSigner()

      // set signer and address at the same time
      signer.getAddress().then((address) => {
        setAddress(address)
        setSigner(signer)
      })
    }
  }, [provider])

  return (
    <EthContext.Provider
      value={{ blockNumber, chainId, signer, address, loginWeb3, logoutWeb3 }}
    >
      {children}
    </EthContext.Provider>
  )
}
const useEth = () => useContext(EthContext)

export { EthContext, EthProvider, useEth }
