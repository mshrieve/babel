import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
import {
  encodeWord,
  charToNumber,
  charToHex,
  setStringIndex,
  decodeWord
} from '../utils'

describe('ByteArray', function () {
  let ByteArrayHarness: Contract
  let ByteArrayAssemblyHarness: Contract
  before(async () => {
    const ByteArrayHarnessFactory = await ethers.getContractFactory(
      'ByteArrayHarness'
    )
    ByteArrayHarness = await ByteArrayHarnessFactory.deploy()
    const ByteArrayHarnessInterface = ByteArrayHarnessFactory.interface

    const ByteArrayAssemblyHarnessFactory = await ethers.getContractFactory(
      'ByteArrayAssemblyHarness'
    )
    ByteArrayAssemblyHarness = await ByteArrayAssemblyHarnessFactory.deploy()
    const ByteArrayAssemblyHarnessInterface =
      ByteArrayAssemblyHarnessFactory.interface
    await Promise.all([
      ByteArrayHarness.deployed(),
      ByteArrayAssemblyHarness.deployed()
    ])
  })

  it('solidity: should set the character at an index', async function () {
    const string = 'hello'
    const word = encodeWord(string)
    for (let i = 0; i < 5; i++) {
      const index = await ByteArrayHarness.setIndex(word, i, charToNumber('a'))
      const newWord = decodeWord(index.toString(16))
      expect(newWord).to.equal(setStringIndex(string, i, 'a'))
    }
  })

  it('assembly: should set the character at an index', async function () {
    const string = 'hello'
    const word = encodeWord(string)
    for (let i = 0; i < 5; i++) {
      const index = await ByteArrayAssemblyHarness.setIndex(
        word,
        i,
        charToNumber('a')
      )
      const newWord = decodeWord(index.toString(16))
      expect(newWord).to.equal(setStringIndex(string, i, 'a'))
    }
  })

  it('solidity: should slice the word', async function () {
    const string = 'hello'
    const encoded = encodeWord(string)
    for (let i = 0; i <= 5; i++) {
      const actual = decodeWord(
        (await ByteArrayHarness.slice(encoded, i)).toString(16)
      )
      const expected = string.slice(0, i)
      console.log(encoded)
      console.log('expected', expected)
      expect(actual).to.equal(expected)
    }
  })

  it('assembly: should slice the word', async function () {
    const string = 'hello'
    const encoded = encodeWord(string)
    for (let i = 0; i <= 5; i++) {
      const actual = decodeWord(
        (await ByteArrayAssemblyHarness.slice(encoded, i)).toString(16)
      )
      const expected = string.slice(0, i)
      console.log(encoded)
      console.log('expected', expected)
      expect(actual).to.equal(expected)
    }
  })

  //   it('should generate random bytes32', async function () {
  //     for (let i = 0; i < 5; i++) {
  //       const random = generateRandomBytes32()
  //       const word = await ByteArray.convertRandomToWord(random)
  //       expect(word).to.equal(randomToEncodedWord(random))
  //     }
})
