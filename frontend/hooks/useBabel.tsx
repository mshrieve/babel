import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { useWallet } from '../hooks/useWallet'
import { useAddresses } from '../hooks/useAddresses'
import { BigNumber } from 'bignumber.js'
import Babel from '../../artifacts/contracts/Babel.sol/Babel.json'

const eDecimals = new BigNumber(10).exponentiatedBy(18)
export const useBabel = () => {
  const { provider } = useContext(EthContext)
  const { address } = useWallet()
  const { wordsAddress, vaultAddress, babelAddress, threeAddress } =
    useAddresses()

  const [babelContract, setBabelContract] = useState(
    new ethers.Contract(babelAddress, Babel.abi, provider.getSigner())
  )
  const [balance, setBalance] = useState('0')
  const [wordsAllowance, setWordsAllowance] = useState('0')
  const [vaultAllowance, setVaultAllowance] = useState('0')

  //   mint 1000 tokens to signer
  const mintBabel = useCallback(() => {
    if (address) babelContract.mint(address, eDecimals.times(1000).toFixed())
  }, [address])

  //   increase allowance by 1000
  const approveWords = useCallback(() => {
    if (address)
      babelContract.increaseAllowance(
        wordsAddress,
        eDecimals.times(1000).toFixed()
      )
  }, [address])

  const approveVault = useCallback(() => {
    if (address)
      babelContract.increaseAllowance(
        vaultAddress,
        eDecimals.times(1000).toFixed()
      )
  }, [address])

  const approveThree = useCallback(() => {
    if (address)
      babelContract.increaseAllowance(
        threeAddress,
        eDecimals.times(1000).toFixed()
      )
  }, [address])

  //   initially set the balance
  useEffect(() => {
    if (address)
      babelContract
        .balanceOf(address)
        .then((balance) => setBalance(balance.toString()))
  }, [address])

  //   listen for transfer
  useEffect(() => {
    if (!address) return undefined
    const filter = babelContract.filters.Transfer(null, null)
    const listener = (from, to, amount) =>
      babelContract
        .balanceOf(address)
        .then((balance) => setBalance(balance.toString()))

    babelContract.on(filter, listener)
    return () => {
      babelContract.off(filter, listener)
    }
  }, [address])

  //  listen for approvals
  useEffect(() => {
    if (!address) return undefined
    const filter = babelContract.filters.Approval(address, null)
    const listener = (owner, spender, value) => {
      if (spender == vaultAddress) setVaultAllowance(value.toString())
      if (spender == wordsAddress) setWordsAllowance(value.toString())
    }

    babelContract
      .allowance(address, wordsAddress)
      .then((value) => setWordsAllowance(value.toString()))

    babelContract
      .allowance(address, vaultAddress)
      .then((value) => setVaultAllowance(value.toString()))

    babelContract.on(filter, listener)
    return () => {
      babelContract.off(filter, listener)
    }
  }, [address])

  return {
    balance,
    wordsAllowance,
    vaultAllowance,
    mintBabel,
    approveWords,
    approveVault,
    approveThree
  }
}
