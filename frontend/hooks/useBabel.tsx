import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useEth } from '../context/eth'

import { useAddresses } from '../hooks/useAddresses'
import { BigNumber } from 'bignumber.js'
import Babel from '../../artifacts/contracts/Babel.sol/Babel.json'

const eDecimals = new BigNumber(10).exponentiatedBy(18)
export const useBabel = () => {
  const { signer, address } = useEth()
  const { wordsAddress, babelAddress, lyricAddress } = useAddresses()
  const [babelContract, setBabelContract] = useState(undefined)

  // need signer to instantiate contract
  useEffect(() => {
    if (!signer) return undefined
    setBabelContract(new ethers.Contract(babelAddress, Babel.abi, signer))
  }, [signer])

  const [balance, setBalance] = useState('0')
  const [allowances, setAllowances] = useState({
    words: '0',
    vault: '0',
    lyric: '0'
  })

  //   mint 1000 tokens to signer
  const mintBabel = useCallback(() => {
    if (!babelContract || !address) return undefined
    babelContract.mint(address, eDecimals.times(1000).toFixed())
  }, [babelContract, address])

  //   increase allowance by 1000
  const approveWords = useCallback(() => {
    if (!babelContract || !address) return undefined
    babelContract.increaseAllowance(
      wordsAddress,
      eDecimals.times(1000).toFixed()
    )
  }, [babelContract, address])

  // const approveVault = useCallback(() => {
  //   if (!babelContract || !address) return undefined
  //   babelContract.increaseAllowance(
  //     vaultAddress,
  //     eDecimals.times(1000).toFixed()
  //   )
  // }, [babelContract, address])

  const approveLyric = useCallback(() => {
    if (!babelContract || !address) return undefined
    babelContract.increaseAllowance(
      lyricAddress,
      eDecimals.times(1000).toFixed()
    )
  }, [babelContract, address])

  //   initially set the balance
  useEffect(() => {
    if (!babelContract || !address) return undefined
    babelContract
      .balanceOf(address)
      .then((balance) => setBalance(balance.toString()))
  }, [address, babelContract])

  //   listen for transfer
  useEffect(() => {
    if (!babelContract) return undefined
    const filter = babelContract.filters.Transfer(null, null)
    const listener = (from, to, amount) =>
      babelContract
        .balanceOf(address)
        .then((balance) => setBalance(balance.toString()))

    babelContract.on(filter, listener)
    return () => {
      babelContract.off(filter, listener)
    }
  }, [babelContract, address])

  //  listen for approvals
  useEffect(() => {
    if (!babelContract || !address) return undefined
    console.log(address)
    const filter = babelContract.filters.Approval(address, null)
    const listener = (owner, spender, value) => {
      // if (spender == vaultAddress)
      //   setAllowances((allowances) => ({
      //     ...allowances,
      //     vault: value.toString()
      //   }))
      if (spender == wordsAddress)
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

    // babelContract.allowance(address, vaultAddress).then((value) =>
    //   setAllowances((allowances) => ({
    //     ...allowances,
    //     vault: value.toString()
    //   }))
    // )

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
  }, [babelContract, address])

  return {
    balance,
    allowances,
    mintBabel,
    approveWords,
    // approveVault,
    approveLyric
  }
}
