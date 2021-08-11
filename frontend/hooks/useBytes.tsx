import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWallet } from './useWallet'
import { useAddresses } from './useAddresses'
import { EthContext } from '../context/eth'
import MockBytes from '../../artifacts/contracts/Mocks/MockBytes.sol/MockBytes.json'

export const useBytes = () => {
  const { signer } = useContext(EthContext)
  const { bytesAddress } = useAddresses()
  const { address } = useWallet()
  const [randomContract, setRandomContract] = useState(
    new ethers.Contract(bytesAddress, MockBytes.abi, signer)
  )

  const fulfillRequest = useCallback(
    (requestId) => {
      if (!address) return undefined
      randomContract.fulfillRandomBytes32(requestId)
    },
    [address]
  )

  return {
    fulfillRequest
  }
}
