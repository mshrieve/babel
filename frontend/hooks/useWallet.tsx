import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/eth'

export const useWallet = () => {
  const { provider } = useContext(EthContext)
  const [address, setAddress] = useState('')

  useEffect(() => {
    console.log(provider)
    provider
      .getSigner()
      .getAddress()
      .then((address) => setAddress(address))
  }, [provider])

  return {
    address
  }
}
