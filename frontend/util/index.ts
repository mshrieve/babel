import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
export const eDecimals = new BigNumber('10').pow(18)
export const usdcDecimals = new BigNumber('10').pow(6)
export const render18 = (x: BigNumber) => x.div(eDecimals).toFixed()
export const renderUSDC = (x: BigNumber) => x.div(usdcDecimals).toFixed()

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

export const decodeTriplet = (encoded: string) => {
  let lyric = []
  const encodedPadded = ethers.utils.hexZeroPad(encoded, 32)
  // bc of the 0x at beginning
  // words are at 16—20, 22—26, and 28—32
  for (let i = 0; i < 3; i++) {
    let word = ''
    for (let j = 0; j < 5; j++) {
      const offset = 2 * (16 + 6 * i + j)
      const code = encodedPadded[offset] + encodedPadded[offset + 1]
      if (code == '00') word += ' '
      else word = word + hexToChar(code)
    }
    lyric = [...lyric, word]
  }
  console.log(lyric)
  return lyric
}
