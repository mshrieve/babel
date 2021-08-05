import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
describe('ByteArray', function () {
  let ByteArray: Contract

  before(async () => {
    const [owner] = await ethers.getSigners()
    const ByteArrayFactory = await ethers.getContractFactory('ByteArrayHarness')
    ByteArray = await ByteArrayFactory.deploy()
    await ByteArray.deployed()
  })

  it('should get the character at an index', async function () {
    const [owner] = await ethers.getSigners()

    const string = 'hello'
    const word = encodeWord(string)
    for (let i = 0; i < 5; i++) {
      const index = await ByteArray.getIndex(word, i)
      expect(index.toString(16)).to.equal(charToHex(string[i]))
    }
  })

  it('should set the character at an index', async function () {
    const string = 'hello'
    const word = encodeWord(string)
    for (let i = 0; i < 5; i++) {
      const index = await ByteArray.setIndex(word, i, charToNumber('a'))
      const newWord = decodeWord(index.toString(16))
      expect(newWord).to.equal(setStringIndex(string, i, 'a'))
    }
  })

  it('should set the character at an index', async function () {
    const string = 'hello'
    const word = encodeWord(string)
    for (let i = 0; i < 5; i++) {
      const index = await ByteArray.setIndex(word, i, charToNumber('a'))
      const newWord = decodeWord(index.toString(16))
      expect(newWord).to.equal(setStringIndex(string, i, 'a'))
    }
  })

  it('should slice the word', async function () {
    const string = 'hello'
    const encoded = encodeWord(string)
    for (let i = 0; i <= 5; i++) {
      const actual = decodeWord(
        (await ByteArray.slice(encoded, i)).toString(16)
      )
      const expected = string.slice(0, i)
      console.log(encoded)
      console.log('expected', expected)
      expect(actual).to.equal(expected)
    }
  })

  it('should generate random bytes32', async function () {
    for (let i = 0; i < 5; i++) {
      const random = generateRandomBytes32()
      const word = await ByteArray.convertRandomToWord(random)
      expect(word).to.equal(randomToEncodedWord(random))
    }
  })

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
    let encodedWord = '0x' + '0'.repeat(54)
    for (let i = 0; i < 5; i++) {
      encodedWord = encodedWord + word.charCodeAt(i).toString(16)
    }
    return encodedWord
  }

  const setStringIndex = (word: string, index: number, char: string) =>
    word.slice(0, index) + char + word.slice(index + 1, 5)

  const decodeWord = (code: string) => {
    let word = ''
    // from 28 to 32, bc of the 0x at beginning
    for (let j = 28; j < 33; j++) {
      if (code[2 * j + 1] != '0')
        word = word + hexToChar(code[2 * j] + code[2 * j + 1])
    }
    return word
  }

  const generateRandomBytes32 = () => {
    const bytes = new Array(32)

    return (
      '0x' +
      bytes
        .fill(undefined)
        .map((_) =>
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, '0')
        )
        .join('')
    )
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
})
