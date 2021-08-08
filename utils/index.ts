import { ethers } from 'ethers'

const hexToChar = (hex: string) => {
  return String.fromCharCode(Number.parseInt(hex, 16))
}

const charToHex = (char: string) => {
  return char.charCodeAt(0).toString(16)
}

const charToNumber = (char: string) => {
  return char.charCodeAt(0)
}

const encodeWord = (word: string) => {
  let encodedWord = ''
  for (let i = 0; i < 5; i++) {
    encodedWord = encodedWord + word.charCodeAt(i).toString(16)
  }
  return ethers.utils.hexZeroPad('0x' + encodedWord, 32)
}

const encodeTriplet = (words: string[]) => {
  console.log(words)
  let encodedWord = '0x' + '0'.repeat(28)

  for (const word of words) {
    encodedWord += '00'
    for (let i = 0; i < 5; i++) {
      encodedWord = encodedWord + word.charCodeAt(i).toString(16)
    }
  }
  return encodedWord
}

const setStringIndex = (word: string, index: number, char: string) =>
  word.slice(0, index) + char + word.slice(index + 1, 5)

const decodeWord = (code: string) => {
  let word = ''
  // from 28 to 32, bc of the 0x at beginning
  for (let j = 28; j < 33; j++) {
    word = word + hexToChar(code[2 * j] + code[2 * j + 1])
  }
  return word
}

const decodeTriplet = (encoded: string) => {
  let word = ''
  // bc of the 0x at beginning
  // words are at 16—20, 22—26, and 28—32
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 5; j++) {
      const offset = 2 * (16 + 6 * i + j)
      const code = encoded[offset] + encoded[offset + 1]
      if (code == '00') word += ' '
      else word = word + hexToChar(code)
    }
    if (i < 2) word += ' '
  }
  return word
}

const generateRandomBytes32 = () => {
  return '0x' + ethers.utils.randomBytes(32).join('')
  // const bytes = new Array(32)

  // return (
  //   '0x' +
  //   bytes
  //     .fill(undefined)
  //     .map((_) =>
  //       Math.floor(Math.random() * 256)
  //         .toString(16)
  //         .padStart(2, '0')
  //     )
  //     .join('')
  // )
}

const randomToEncodedWord = (random: string) => {
  const bytes = new Array(5)

  return (
    '0x' +
    bytes
      .fill(undefined)
      // start at 28 bc of '0x' (+1 byte)
      .map((_, i) => random[2 * (i + 28)] + random[2 * (i + 28) + 1])
      // parse the hex
      .map((x) => parseInt(x, 16))
      // get ascii char code
      .map((x) => (x % 26) + 97)
      // export to hex
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      // pad the string so that we have bytes32
      .padStart(64, '0')
  )
}

const randomWord = () => randomToEncodedWord(generateRandomBytes32())

export {
  hexToChar,
  charToHex,
  charToNumber,
  encodeWord,
  setStringIndex,
  decodeWord,
  generateRandomBytes32,
  randomToEncodedWord,
  randomWord,
  encodeTriplet,
  decodeTriplet
}
