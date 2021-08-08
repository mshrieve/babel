import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { useWallet } from '../hooks/useWallet'
import { useBabel } from '../hooks/useBabel'
import { BigNumber } from 'bignumber.js'
import Three from '../../artifacts/contracts/Three.sol/Three.json'
import Words from '../../artifacts/contracts/Words.sol/Words.json'
import Babel from '../../artifacts/contracts/Babel.sol/Babel.json'
import { useAddresses } from './useAddresses'
import { decodeTriplet } from '../util'

export const useThree = () => {
  const { provider } = useContext(EthContext)
  const { address } = useWallet()
  const { threeAddress } = useAddresses()
  const { approveThree } = useBabel()
  const [threeContract, setThreeContract] = useState(
    new ethers.Contract(threeAddress, Three.abi, provider.getSigner())
  )
  const [threeState, setThreeState] = useState('')
  const [decodedTriplet, setDecodedTriplet] = useState('')
  useEffect(() => {
    setDecodedTriplet(decodeTriplet(threeState))
  }, [threeState])
  //   const [wordsContract, setWordsContract] = useState(
  //     new ethers.Contract(
  //       process.env.NEXT_PUBLIC_WORDS_ADDRESS,
  //       Words.abi,
  //       provider.getSigner()
  //     )
  //   )
  const [babelContract, setBabelContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_BABEL_ADDRESS,
      Babel.abi,
      provider.getSigner()
    )
  )

  //   const depositWord = useCallback(
  //     (tokenId) => {
  //       if (!address) return undefined
  //       //   have to call like this since safeTransferFrom is overloaded
  //       wordsContract['safeTransferFrom(address,address,uint256)'](
  //         address,
  //         vaultContract.address,
  //         new BigNumber(tokenId).toString()
  //       )
  //     },
  //     [address]
  //   )

  const replaceWord = useCallback(
    (tokenId, position) => {
      if (!address) return undefined
      threeContract.replaceWord(new BigNumber(tokenId).toString(), position)
    },
    [address]
  )

  //   listen for transfer
  useEffect(() => {
    if (!address) return undefined

    const filter = threeContract.filters.PoemMinted()
    const listener = async (state) => {
      setThreeState(state.toHexString())
    }
    threeContract.state().then((state) => setThreeState(state.toString(16)))

    threeContract.on(filter, listener)
    return () => {
      threeContract.off(filter, listener)
    }
  }, [address])

  return {
    approveThree,
    replaceWord,
    threeState,
    decodedTriplet
  }
}
