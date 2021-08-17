import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useEth } from '../context/eth'
import Words from '../../artifacts/contracts/Words.sol/Words.json'
import { useAddresses } from './useAddresses'

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
  const { signer, address } = useEth()
  const { wordsAddress } = useAddresses()

  const [wordsContract, setWordsContract] = useState(undefined)
  useEffect(() => {
    if (signer)
      setWordsContract(new ethers.Contract(wordsAddress, Words.abi, signer))
  }, [signer])

  const [requestId, setRequestId] = useState('')
  const [word, setWord] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [usersWords, setUsersWords] = useState([])

  const requestWord = useCallback(() => {
    if (!wordsContract) return undefined
    console.log('requstWord')
    wordsContract.requestWord()
  }, [wordsContract])

  //   listen for request
  useEffect(() => {
    if (!wordsContract || !address) return undefined

    const filter = wordsContract.filters.WordRequest(address, null)
    const listener = (to, requestId) => setRequestId(requestId)

    wordsContract.on(filter, listener)
    return () => {
      wordsContract.off(filter, listener)
    }
  }, [wordsContract])

  //   listen for transfer
  useEffect(() => {
    if (!wordsContract || !address) return undefined

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
  }, [wordsContract])

  //   listen for transfer
  useEffect(() => {
    if (!wordsContract || !address) return undefined

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
  }, [wordsContract])

  return {
    wordsContract,
    requestWord,
    requestId,
    word,
    usersWords,
    tokenId
  }
}
