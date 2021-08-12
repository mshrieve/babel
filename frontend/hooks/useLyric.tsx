import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { useWallet } from './useWallet'
import { BigNumber } from 'bignumber.js'
import Lyric from '../../artifacts/contracts/Lyric.sol/Lyric.json'
import { useAddresses } from './useAddresses'
import { decodeTriplet } from '../util'

export const useLyric = () => {
  const { signer } = useContext(EthContext)
  const { address } = useWallet()
  const { lyricAddress } = useAddresses()
  // const { approveThree } = useBabel()
  const [lyricContract, setLyricContract] = useState(
    new ethers.Contract(lyricAddress, Lyric.abi, signer)
  )
  const [lyricState, setLyricState] = useState(ethers.utils.hexZeroPad('', 32))
  const [decodedLyric, setDecodedLyric] = useState('')
  useEffect(() => {
    setDecodedLyric(decodeTriplet(lyricState))
  }, [lyricState])

  // const [babelContract, setBabelContract] = useState(
  //   new ethers.Contract(
  //     process.env.NEXT_PUBLIC_BABEL_ADDRESS,
  //     Babel.abi,
  //     signer
  //   )
  // )

  const bid = useCallback(
    (tokenId, position, bid) => {
      if (!signer) return undefined
      lyricContract.bidNewLyric(
        new BigNumber(tokenId).toString(),
        position,
        bid
      )
    },
    [address]
  )

  //   listen for transfer
  useEffect(() => {
    if (!signer) return undefined

    const filter = lyricContract.filters.LyricMinted()
    const listener = async (state) => {
      setLyricState(state.toHexString())
    }
    lyricContract.state().then((state) => setLyricState(state.toString(16)))

    lyricContract.on(filter, listener)
    return () => {
      lyricContract.off(filter, listener)
    }
  }, [address])

  return {
    // approveThree,
    bid,
    lyricState,
    decodedLyric
  }
}
