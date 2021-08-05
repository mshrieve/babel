import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Interface } from 'ethers/lib/utils'
import { generateRandomBytes32, randomWord } from '../utils'

describe('Generator', function () {
  let Generator: Contract
  let owner: SignerWithAddress
  let GeneratorInterface: Interface
  let generatedWords: string[]

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0]

    const GeneratorFactory = await ethers.getContractFactory('GeneratorHarness')
    Generator = await GeneratorFactory.deploy()
    GeneratorInterface = GeneratorFactory.interface
    await Generator.deployed()

    generatedWords = []
  })

  it('should be available word', async function () {
    for (let i = 0; i < 10; i++) {
      const result = await Generator._isWordAvailable(randomWord())
      expect(result).to.be.true
    }
    //   console.log(receipt.logs)
    // const args = GeneratorInterface.parseLog(receipt.logs[0]).args
  })

  it('should generate word', async function () {
    for (let i = 0; i < 10; i++) {
      const randomBytes = generateRandomBytes32()

      let transaction = await Generator._generateWord(randomBytes)
      let receipt = await transaction.wait()

      // console.log(receipt)
      const word: string = GeneratorInterface.parseLog(receipt.logs[0]).args
        .word
      generatedWords = [word, ...generatedWords]
    }
  })

  it('should not be available word', async function () {
    for (const word of generatedWords) {
      const result = await Generator._isWordAvailable(word)
      expect(result).to.be.false
    }

    //   console.log(receipt.logs)
    // const args = GeneratorInterface.parseLog(receipt.logs[0]).args
  })
})
