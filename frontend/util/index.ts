import BigNumber from 'bignumber.js'
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
