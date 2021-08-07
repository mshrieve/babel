import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '../hooks/useWallet'
import { EthContext } from '../context/eth'
import MockRandom from '../../artifacts/contracts/Mocks/MockRandom.sol/MockRandom.json'

export const useRandom = () => {
  const { provider } = useContext(EthContext)
  const { address } = useWallet()
  const [randomContract, setRandomContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_RANDOM_ADDRESS,
      MockRandom.abi,
      provider.getSigner()
    )
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
