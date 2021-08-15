import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { useWallet } from '../hooks/useWallet'
import { BigNumber } from 'bignumber.js'
import Vault from '../../artifacts/contracts/Vault.sol/Vault.json'
import Words from '../../artifacts/contracts/Words.sol/Words.json'
import Babel from '../../artifacts/contracts/Babel.sol/Babel.json'
import { useAddresses } from './useAddresses'

export const useVault = () => {
  const { signer } = useContext(EthContext)
  const { address } = useWallet()
  const { vaultAddress, wordsAddress, babelAddress } = useAddresses()

  const [vaultContract, setVaultContract] = useState(undefined)
  const [wordsContract, setWordsContract] = useState(undefined)
  const [babelContract, setBabelContract] = useState(undefined)

  useEffect(() => {
    if (!signer) return undefined

    setVaultContract(new ethers.Contract(vaultAddress, Vault.abi, signer))
    setWordsContract(new ethers.Contract(wordsAddress, Words.abi, signer))
    setBabelContract(new ethers.Contract(babelAddress, Babel.abi, signer))
  }, [signer])

  const [unclaimedWords, setUnclaimedWords] = useState('0')

  const [vaultWords, setVaultWords] = useState([])

  const depositWord = useCallback(
    (tokenId) => {
      if (!address) return undefined
      //   have to call like this since safeTransferFrom is overloaded
      wordsContract['safeTransferFrom(address,address,uint256)'](
        address,
        vaultContract.address,
        new BigNumber(tokenId).toString()
      )
    },
    [address]
  )

  const redeemWord = useCallback(
    (tokenId) => {
      if (!address) return undefined
      //   have to call like this since safeTransferFrom is overloaded
      vaultContract.redeemWord(new BigNumber(tokenId).toString())
    },
    [address]
  )

  const redeemBabel = useCallback(() => {
    if (!address) return undefined
    vaultContract.redeemBabel()
  }, [address])

  //   listen for transfer
  useEffect(() => {
    if (!address) return undefined

    const filterA = wordsContract.filters.Transfer(null, vaultContract.address)
    const filterB = wordsContract.filters.Transfer(vaultContract.address, null)
    const listener = async () => {
      const balance = await wordsContract.balanceOf(vaultContract.address)
      let vaultWords: string[] = []
      for (let i = 0; i < balance; i++) {
        const indexedWord = await wordsContract.tokenOfOwnerByIndex(
          vaultContract.address,
          i
        )
        vaultWords = [...vaultWords, indexedWord.toHexString()]
      }
      console.log(vaultWords)
      setVaultWords(vaultWords)
    }
    listener()
    wordsContract.on(filterA, listener)
    wordsContract.on(filterB, listener)
    return () => {
      wordsContract.off(filterA, listener)
      wordsContract.off(filterB, listener)
    }
  }, [address])

  useEffect(() => {
    if (!address) return undefined

    const filterA = wordsContract.filters.Transfer(null, vaultContract.address)
    const filterB = vaultContract.filters.RedeemBabel(address)
    const listener = async () => {
      const unclaimedWords = await vaultContract.unclaimedWords(address)
      setUnclaimedWords(unclaimedWords.toString())
    }
    listener()
    wordsContract.on(filterA, listener)
    vaultContract.on(filterB, listener)
    return () => {
      wordsContract.off(filterA, listener)
      vaultContract.off(filterB, listener)
    }
  }, [address])

  return {
    vaultWords,
    depositWord,
    unclaimedWords,
    redeemBabel,
    redeemWord
  }
}
