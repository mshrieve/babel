import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useAddresses } from './useAddresses'
import { EthContext } from '../context/eth'
import MockBytes from '../../artifacts/contracts/Mocks/MockBytes.sol/MockBytes.json'

export const useBytes = () => {
  const { signer } = useContext(EthContext)
  const { bytesAddress } = useAddresses()

  const [bytesContract, setBytesContract] = useState(undefined)

  useEffect(() => {
    if (!signer) return
    console.log('bytes address:', bytesAddress)
    setBytesContract(new ethers.Contract(bytesAddress, MockBytes.abi, signer))
  }, [signer])

  const fulfillRequest = useCallback(
    (requestId) => {
      if (!bytesContract) return undefined
      bytesContract.fulfillRandomBytes32(requestId)
    },
    [bytesContract]
  )

  return {
    fulfillRequest
  }
}
