import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { useWallet } from '../hooks/useWallet'
import { useAddresses } from '../hooks/useAddresses'
import { BigNumber } from 'bignumber.js'
import Babel from '../../artifacts/contracts/Babel.sol/Babel.json'

const eDecimals = new BigNumber(10).exponentiatedBy(18)
export const useBabel = () => {
  const { signer } = useContext(EthContext)
  const { address } = useWallet()
  const { wordsAddress, vaultAddress, babelAddress, lyricAddress } =
    useAddresses()

  const [babelContract, setBabelContract] = useState(
    new ethers.Contract(babelAddress, Babel.abi, signer)
  )
  const [balance, setBalance] = useState('0')
  const [allowances, setAllowances] = useState({
    words: '0',
    vault: '0',
    lyric: '0'
  })

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

  const approveLyric = useCallback(() => {
    if (address)
      babelContract.increaseAllowance(
        lyricAddress,
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
      if (spender == vaultAddress)
        setAllowances((allowances) => ({
          ...allowances,
          vault: value.toString()
        }))
      else if (spender == wordsAddress)
        setAllowances((allowances) => ({
          ...allowances,
          words: value.toString()
        }))
      else if (spender == lyricAddress)
        setAllowances((allowances) => ({
          ...allowances,
          lyricAddress: value.toString()
        }))
    }

    babelContract.allowance(address, wordsAddress).then((value) =>
      setAllowances((allowances) => ({
        ...allowances,
        words: value.toString()
      }))
    )

    babelContract.allowance(address, vaultAddress).then((value) =>
      setAllowances((allowances) => ({
        ...allowances,
        vault: value.toString()
      }))
    )

    babelContract.allowance(address, lyricAddress).then((value) =>
      setAllowances((allowances) => ({
        ...allowances,
        lyric: value.toString()
      }))
    )

    babelContract.on(filter, listener)
    return () => {
      babelContract.off(filter, listener)
    }
  }, [address])

  return {
    balance,
    allowances,
    mintBabel,
    approveWords,
    approveVault,
    approveLyric
  }
}
