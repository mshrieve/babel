import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { useWallet } from '../hooks/useWallet'
import Babel from '../../artifacts/contracts/Token.sol/Token.json'

export const useBabel = () => {
  const { provider } = useContext(EthContext)
  const { address } = useWallet()
  const [babelContract, setBabelContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_BABEL_ADDRESS,
      Babel.abi,
      provider.getSigner()
    )
  )
  const [balance, setBalance] = useState('0')
  const [wordsAllowance, setWordsAllowance] = useState('0')

  //   mint 1000 tokens to signer
  const mintBabel = useCallback(() => {
    if (address) babelContract.mint(address, 1000)
  }, [address])

  //   increase allowance by 1000
  const approve = useCallback(() => {
    if (address)
      babelContract.increaseAllowance(
        process.env.NEXT_PUBLIC_WORDS_ADDRESS,
        1000
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
    const listener = (owner, spender, value) =>
      setWordsAllowance(value.toString())

    babelContract.on(filter, listener)
    return () => {
      babelContract.off(filter, listener)
    }
  }, [address])

  return {
    balance,
    wordsAllowance,
    mintBabel,
    approve
  }
}
