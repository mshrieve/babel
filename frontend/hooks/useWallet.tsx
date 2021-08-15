import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/eth'

export const useWallet = () => {
  const { signer } = useContext(EthContext)
  const [address, setAddress] = useState(undefined)

  useEffect(() => {
    if (signer) signer.getAddress().then((address) => setAddress(address))
  }, [signer])

  return {
    address
  }
}
