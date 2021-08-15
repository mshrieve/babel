import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect
} from 'react'
import { ethers } from 'ethers'

import Web3Modal from 'web3modal'

const providerOptions = {
  /* See Provider Options Section */
}

// const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY).connect(
//   provider
// )
// const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
const EthContext = createContext({
  signer: undefined,
  loadWeb3Modal: undefined
})
const EthProvider = ({ children }) => {
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  const [address, setAddress] = useState()
  const [web3Modal, setWeb3Modal] = useState(undefined)

  // const logoutOfWeb3Modal = useCallback(async () => {
  //   await web3Modal.clearCachedProvider()
  //   if (
  //     provider &&
  //     provider.provider &&
  //     typeof provider.provider.disconnect == 'function'
  //   ) {
  //     await provider.provider.disconnect()
  //   }
  //   setTimeout(() => {
  //     window.location.reload()
  //   }, 1)
  // }, [provider])

  const loadWeb3Modal = useCallback(async () => {
    // await window.ethereum.send('eth_requestAccounts')
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    window.ethereum.on('chainChanged', (chainId) => {
      console.log(`chain changed to ${chainId}! updating providers`)
      setProvider(new ethers.providers.Web3Provider(window.ethereum))
    })
    setSigner(provider.getSigner())

    window.ethereum.on('accountsChanged', () => {
      console.log(`account changed!`)
      provider
        .getSigner()
        .getAddress()
        .then((address) => console.log(address))
      setProvider(new ethers.providers.Web3Provider(window.ethereum))
      // const ethersProvider = new ethers.providers.Web3Provider(provider)
      // console.log('ethersProvider:', ethersProvider)
      // console.log('ethersSigner: ', ethersProvider.getSigner())
    })

    // // Subscribe to session disconnection
    // provider.on('disconnect', (code, reason) => {
    //   console.log(code, reason)
    //   logoutOfWeb3Modal()
    // })
  }, [setProvider])

  useEffect(() => {
    loadWeb3Modal()
  }, [])

  useEffect(() => {
    if (provider && provider.getSigner) setSigner(provider.getSigner())
  }, [provider])

  // useEffect(() => {
  //   if (web3Modal && web3Modal.cachedProvider) {
  //     web3Modal
  //       .connect()
  //       .then((provider) => new ethers.providers.Web3Provider(provider))
  //       .then((web3provider) => setProvider(web3provider))
  //   }

  //   // .then((signer) => setSigner(signer))
  // }, [web3Modal])

  // const load = useCallback(() => {
  //   console.log('web3modal: ', web3Modal)
  //   if (web3Modal)
  //     web3Modal
  //       .connect()
  //       .then((provider) => new ethers.providers.Web3Provider(provider))
  //       .then((web3provider) => setProvider(web3provider))
  // }, [web3Modal])

  // const provider = new ethers.providers.JsonRpcProvider(
  //   'https://rinkeby.infura.io/v3/7c1f2ac532a842dcb851fdbabee9ff16'
  // )
  // const loadWeb3Modal = useCallback(async () => {
  //   const provider = await web3Modal.connect();
  //   setInjectedProvider(new ethers.providers.Web3Provider(provider));

  //   provider.on("chainChanged", chainId => {
  //     console.log(`chain changed to ${chainId}! updating providers`);
  //     setInjectedProvider(new ethers.providers.Web3Provider(provider));
  //   });

  //   provider.on("accountsChanged", () => {
  //     console.log(`account changed!`);
  //     setInjectedProvider(new ethers.providers.Web3Provider(provider));
  //   });

  //   // Subscribe to session disconnection
  //   provider.on("disconnect", (code, reason) => {
  //     console.log(code, reason);
  //     logoutOfWeb3Modal();
  //   });
  // }, [setInjectedProvider]);

  // useEffect(() => {
  //   if (web3Modal.cachedProvider) {
  //     loadWeb3Modal();
  //   }
  // }, [loadWeb3Modal]);

  return (
    <EthContext.Provider value={{ signer, loadWeb3Modal }}>
      {children}
    </EthContext.Provider>
  )
}
const useEth = () => useContext(EthContext)

export { EthContext, EthProvider, useEth }
