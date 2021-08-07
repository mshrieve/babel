import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { useWallet } from '../hooks/useWallet'
import { BigNumber } from 'bignumber.js'
import Vault from '../../artifacts/contracts/Vault.sol/Vault.json'
import Words from '../../artifacts/contracts/Words.sol/Words.json'
import Babel from '../../artifacts/contracts/Babel.sol/Babel.json'

export const useVault = () => {
  const { provider } = useContext(EthContext)
  const { address } = useWallet()
  const [vaultContract, setVaultContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_VAULT_ADDRESS,
      Vault.abi,
      provider.getSigner()
    )
  )
  const [wordsContract, setWordsContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_WORDS_ADDRESS,
      Words.abi,
      provider.getSigner()
    )
  )
  const [babelContract, setBabelContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_BABEL_ADDRESS,
      Babel.abi,
      provider.getSigner()
    )
  )

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

  const whitelistVault = useCallback(() => {
    if (!address) return undefined
    babelContract.whitelistAddress(vaultContract.address)
  }, [address])

  const redeemBabel = useCallback(() => {
    if (!address) return undefined
    vaultContract.redeemBabel()
  }, [address])

  //   listen for transfer
  useEffect(() => {
    if (!address) return undefined

    const filter = wordsContract.filters.Transfer(null, vaultContract.address)
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
    wordsContract.on(filter, listener)
    return () => {
      wordsContract.off(filter, listener)
    }
  }, [address])

  useEffect(() => {
    if (!address) return undefined

    const filterA = wordsContract.filters.Transfer(null, vaultContract.address)
    const filterB = vaultContract.filters.RedeemBabel(address)
    const listener = async () => {
      console.log('hmm')
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
    whitelistVault
  }
}
