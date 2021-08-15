import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { useWallet } from './useWallet'
import { BigNumber } from 'bignumber.js'
import Lyric from '../../artifacts/contracts/Lyric.sol/Lyric.json'
import Babel from '../../artifacts/contracts/Babel.sol/Babel.json'
import { useAddresses } from './useAddresses'
import { decodeTriplet } from '../util'

export const useLyric = () => {
  const { signer } = useContext(EthContext)
  const { address } = useWallet()
  const { lyricAddress, babelAddress } = useAddresses()
  // const { approveThree } = useBabel()
  const [lyricContract, setLyricContract] = useState(undefined)
  const [babelContract, setBabelContract] = useState(undefined)

  useEffect(() => {
    if (!signer) return undefined

    setLyricContract(new ethers.Contract(lyricAddress, Lyric.abi, signer))
    setBabelContract(new ethers.Contract(babelAddress, Babel.abi, signer))
  }, [signer])

  const [lyricState, setLyricState] = useState({
    id: ethers.utils.hexZeroPad('0x0', 32),
    roundStart: ethers.BigNumber.from(0),
    highestBidder: ethers.constants.AddressZero,
    winningLyricId: ethers.BigNumber.from(0)
  })
  const [decodedLyric, setDecodedLyric] = useState('')

  useEffect(() => {
    setDecodedLyric(decodeTriplet(lyricState.id))
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
    if (!lyricContract) return undefined

    const filter = lyricContract.filters.MintLyric()
    const listener = async (state) => {
      setLyricState(state.toHexString())
    }
    lyricContract.currentLyric().then((id) =>
      setLyricState((state) => ({
        ...state,
        id: ethers.utils.hexZeroPad(id.toHexString(), 32)
      }))
    )

    lyricContract.on(filter, listener)
    return () => {
      lyricContract.off(filter, listener)
    }
  }, [lyricContract])

  // //   listen for transfer
  // useEffect(() => {
  //   if (!signer) return undefined

  //   const filter = babelContract.filters.Transfer()
  //   const listener = async (state) => {
  //     setLyricState(state.toHexString())
  //   }
  //   lyricContract.currentLyric().then((id) =>
  //     setLyricState((state) => ({
  //       ...state,
  //       id: ethers.utils.hexZeroPad(id.toHexString(), 32)
  //     }))
  //   )

  //   lyricContract.on(filter, listener)
  //   return () => {
  //     lyricContract.off(filter, listener)
  //   }
  // }, [address])

  return {
    // approveThree,
    bid,
    lyricState,
    decodedLyric
  }
}
