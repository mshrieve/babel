import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useEth } from '../context/eth'
import { useBabel } from '../hooks/useBabel'
import { BigNumber } from 'bignumber.js'
import Lyric from '../../artifacts/contracts/Lyric.sol/Lyric.json'
import Babel from '../../artifacts/contracts/Babel.sol/Babel.json'
import { useAddresses } from './useAddresses'
import { decodeTriplet } from '../util'

export const useLyric = () => {
  const { signer, address } = useEth()
  const { lyricAddress, babelAddress } = useAddresses()
  const { approveLyric } = useBabel()
  const [lyricContract, setLyricContract] = useState(undefined)
  const [usersLyrics, setUsersLyrics] = useState([])
  useEffect(() => {
    if (!signer) return
    console.log('lyric address:', lyricAddress)
    setLyricContract(new ethers.Contract(lyricAddress, Lyric.abi, signer))
  }, [signer])

  const [lyricState, setLyricState] = useState({
    id: ethers.utils.hexZeroPad('0x0', 32),
    roundStart: ethers.constants.Zero,
    highestBidder: ethers.constants.AddressZero,
    highestBid: ethers.constants.Zero,
    proposedLyricId: ethers.constants.Zero
  })
  const [decodedLyric, setDecodedLyric] = useState<String[] | undefined>(
    undefined
  )

  useEffect(() => {
    const lyric = decodeTriplet(lyricState.id)
    setDecodedLyric(lyric)
  }, [lyricState.id])

  const bid = useCallback(
    (tokenId, position, bid) => {
      if (!lyricContract) return
      lyricContract.bidNewLyric(
        new BigNumber(tokenId).toString(),
        position,
        bid
      )
    },
    [lyricContract]
  )

  const completeRound = useCallback(() => {
    if (!lyricContract) return
    lyricContract.completeRound()
  }, [lyricContract])

  // get initial state
  useEffect(() => {
    if (!lyricContract) return

    lyricContract.currentLyric().then((id) =>
      setLyricState((state) => ({
        ...state,
        id: ethers.utils.hexZeroPad(id.toHexString(), 32)
      }))
    )
    lyricContract.roundStart().then((roundStart) =>
      setLyricState((state) => ({
        ...state,
        roundStart: roundStart.toString()
      }))
    )
  }, [lyricContract])

  //   listen for mintLyric
  useEffect(() => {
    if (!lyricContract) return

    const filter = lyricContract.filters.MintLyric()
    const listener = async (to, lyric) => {
      setLyricState((state) => ({
        ...state,
        id: ethers.utils.hexZeroPad(lyric.toHexString(), 32)
      }))
    }

    lyricContract.on(filter, listener)
    return () => {
      lyricContract.off(filter, listener)
    }
  }, [lyricContract])

  //   listen for submit bid
  useEffect(() => {
    if (!lyricContract) return undefined

    const filter = lyricContract.filters.SubmitBid()
    const listener = async (roundStart, highestBid, highestBidder, lyricId) => {
      setLyricState((state) => ({
        ...state,
        roundStart,
        highestBidder,
        highestBid,
        proposedLyricId: lyricId
      }))
    }
    // lyricContract.currentLyric().then((id) =>
    //   setLyricState((state) => ({
    //     ...state,
    //     id: ethers.utils.hexZeroPad(id.toHexString(), 32)
    //   }))
    // )

    lyricContract.on(filter, listener)
    return () => {
      lyricContract.off(filter, listener)
    }
  }, [lyricContract])

  useEffect(() => {
    if (!lyricContract || !address) return undefined

    const filter = lyricContract.filters.Transfer(null, null)

    const listener = async (from, to, tokenId) => {
      const balance = await lyricContract.balanceOf(address)
      let usersLyrics: string[] = []
      for (let i = 0; i < balance; i++) {
        const indexedWord = await lyricContract.tokenOfOwnerByIndex(address, i)
        usersLyrics = [...usersLyrics, indexedWord.toHexString()]
      }
      console.log(usersLyrics)
      setUsersLyrics(usersLyrics)
    }
    listener(null, null, null)
    lyricContract.on(filter, listener)
    return () => {
      lyricContract.off(filter, listener)
    }
  }, [lyricContract])

  //   listen for transfer
  // useEffect(() => {
  //   if (!babelContract) return undefined

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
    approveLyric,
    completeRound,
    bid,
    lyricState,
    decodedLyric,
    usersLyrics
  }
}
