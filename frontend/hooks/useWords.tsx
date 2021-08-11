import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { useWallet } from '../hooks/useWallet'
import Words from '../../artifacts/contracts/Words.sol/Words.json'

const hexToChar = (hex: string) => {
  return String.fromCharCode(Number.parseInt(hex, 16))
}

export const decodeTokenId = (code: string) => {
  let word = ''
  console.log(code)
  // from 28 to 32, bc of the 0x at beginning
  for (let j = 1; j < 6; j++) {
    {
      const hex = code[2 * j] + code[2 * j + 1]
      word = word + hexToChar(hex)
    }
  }
  return word
}

export const useWords = () => {
  const { signer } = useContext(EthContext)
  const { address } = useWallet()
  const [wordsContract, setWordsContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_WORDS_ADDRESS,
      Words.abi,
      signer
    )
  )
  const [requestId, setRequestId] = useState('')
  const [word, setWord] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [usersWords, setUsersWords] = useState([])

  const requestWord = useCallback(() => {
    if (!address) return undefined
    wordsContract.requestWord()
  }, [address])

  //   listen for request
  useEffect(() => {
    if (!address) return undefined

    const filter = wordsContract.filters.WordRequest(address, null)
    const listener = (to, requestId) => setRequestId(requestId)

    wordsContract.on(filter, listener)
    return () => {
      wordsContract.off(filter, listener)
    }
  }, [address])

  //   listen for transfer
  useEffect(() => {
    if (!address) return undefined

    const filter = wordsContract.filters.Transfer(null, address)
    const listener = (from, to, tokenId) => {
      setWord(decodeTokenId(tokenId.toHexString()))
      setTokenId(tokenId.toHexString())
      return undefined
    }

    wordsContract.on(filter, listener)
    return () => {
      wordsContract.off(filter, listener)
    }
  }, [address])

  //   listen for transfer
  useEffect(() => {
    if (!address) return undefined

    const filterA = wordsContract.filters.Transfer(null, address)
    const filterB = wordsContract.filters.Transfer(address, null)

    const listener = async (from, to, tokenId) => {
      const balance = await wordsContract.balanceOf(address)
      let usersWords: string[] = []
      for (let i = 0; i < balance; i++) {
        const indexedWord = await wordsContract.tokenOfOwnerByIndex(address, i)
        usersWords = [...usersWords, indexedWord.toHexString()]
      }
      console.log(usersWords)
      setUsersWords(usersWords)
    }
    listener(null, null, null)
    wordsContract.on(filterA, listener)
    wordsContract.on(filterB, listener)
    return () => {
      wordsContract.off(filterA, listener)
      wordsContract.off(filterB, listener)
    }
  }, [address])

  return {
    wordsContract,
    requestWord,
    requestId,
    word,
    usersWords,
    tokenId
  }
}
