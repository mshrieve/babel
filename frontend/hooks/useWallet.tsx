import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/eth'

export const useWallet = () => {
  const { signer } = useContext(EthContext)
  const [address, setAddress] = useState('')

  useEffect(() => {
    setAddress(signer.address)
  }, [signer.address])

  return {
    address
  }
}
