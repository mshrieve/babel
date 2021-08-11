import { useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { useWallet } from './useWallet'
import { useBabel } from './useBabel'
import { BigNumber } from 'bignumber.js'
import Curve from '../../artifacts/contracts/Curve.sol/Curve.json'
import Words from '../../artifacts/contracts/Words.sol/Words.json'
import Babel from '../../artifacts/contracts/Babel.sol/Babel.json'
import { useAddresses } from './useAddresses'
import { decodeTriplet } from '../util'

export const useLyric = () => {
  const { signer } = useContext(EthContext)
  const { address } = useWallet()
  const { curveAddress } = useAddresses()
  const [curveContract, setCurveThreeContract] = useState(
    new ethers.Contract(curveAddress, Curve.abi, signer)
  )
  const [price, setPrice] = useState('0')
  const [inputs, setInputs] = useState({
    amount: '0'
  })

  const [babelContract, setBabelContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_BABEL_ADDRESS,
      Babel.abi,
      signer
    )
  )

  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))

  //   listen for transfer
  //   useEffect(() => {
  //     if (!address) return undefined

  //     curveContract
  //       .getPrice(inputs.amount)
  //       .then((price) => setPrice(price.toString(16)))
  //   }, [inputs.amount])

  return {
    handleChange,
    price,
    inputs
  }
}
