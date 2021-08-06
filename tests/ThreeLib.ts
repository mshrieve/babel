import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
import {
  encodeWord,
  decodeWord,
  charToHex,
  randomWord,
  encodeTriplet
} from '../utils'

describe('ThreeLib', function () {
  let ThreeLib: Contract

  before(async () => {
    const [owner] = await ethers.getSigners()
    const ThreeLibFactory = await ethers.getContractFactory('ThreeLibHarness')
    ThreeLib = await ThreeLibFactory.deploy()
    await ThreeLib.deployed()
  })

  it('should replace the word at a position', async function () {
    const word1 = randomWord()
    const zeroBytes = new Array(32).fill(0)
    let result = await ThreeLib.writeWord(
      ethers.utils.hexZeroPad(zeroBytes, 32),
      word1,
      0
    )

    const word2 = randomWord()

    result = await ThreeLib.writeWord(
      ethers.utils.hexZeroPad(result, 32),
      word2,
      1
    )

    const word3 = randomWord()

    result = await ThreeLib.writeWord(
      ethers.utils.hexZeroPad(result, 32),
      word3,
      2
    )

    const expected = encodeTriplet(
      [word1, word2, word3].map((word) => decodeWord(word))
    )

    expect(result).to.equal(expected)
  })
})
