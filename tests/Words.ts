import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Interface } from 'ethers/lib/utils'
import { generateRandomBytes32, randomWord } from '../utils'

describe('Words', function () {
  let Words: Contract
  let Bytes32Source: Contract
  let owner: SignerWithAddress
  let iface: Interface

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0]

    const GeneratorFactory = await ethers.getContractFactory('GeneratorHarness')
    const Generator = await GeneratorFactory.deploy()
    const GeneratorInterface = GeneratorFactory.interface
    await Generator.deployed()

    const Bytes32SourceFactory = await ethers.getContractFactory('MockRandom')
    Bytes32Source = await Bytes32SourceFactory.deploy()
    const Bytes32SourceInterface = Bytes32SourceFactory.interface
    await Bytes32Source.deployed()

    const WordsFactory = await ethers.getContractFactory('Words')
    Words = await WordsFactory.deploy(Generator.address, Bytes32Source.address)
    const WordsInterface = WordsFactory.interface
    await Words.deployed()

    iface = new ethers.utils.Interface([
      ...WordsInterface.fragments,
      ...GeneratorInterface.fragments,
      ...Bytes32SourceInterface.fragments
    ])
  })

  it('should request word', async function () {
    let transaction = await Words.requestWord(owner.address)
    let receipt = await transaction.wait()

    // console.log(receipt)
    const wordRequestLog = iface.parseLog(receipt.logs[1])
    expect(wordRequestLog.name).to.equal('WordRequest')
    expect(wordRequestLog.args.to).to.equal(owner.address)
  })

  it('should request word', async function () {
    let transaction = await Words.requestWord(owner.address)
    let receipt = await transaction.wait()

    // console.log(receipt)
    const wordRequestLog = iface.parseLog(receipt.logs[1])
    expect(wordRequestLog.name).to.equal('WordRequest')
    expect(wordRequestLog.args.to).to.equal(owner.address)
  })

  it('should request word', async function () {
    let transaction = await Words.requestWord(owner.address)
    let receipt = await transaction.wait()

    // console.log(receipt)
    const bytes32RequestLog = iface.parseLog(receipt.logs[0])
    const wordRequestLog = iface.parseLog(receipt.logs[1])
    expect(bytes32RequestLog.name).to.equal('Bytes32Requested')

    const requestId = bytes32RequestLog.args.requestId
    expect(bytes32RequestLog.args.callback).to.equal(Words.address)

    transaction = await Bytes32Source.fulfillRandomBytes32(requestId)
    receipt = await transaction.wait()

    const transferLog = iface.parseLog(receipt.logs[0])
    console.log(transferLog)
    console.log('tokenId: ', transferLog.args.tokenId.toHexString())
    expect(transferLog.args.to).be.equal(owner.address)
    console.log(transferLog.args.tokenId.toString())
    expect(transferLog.args.tokenId.lt(2 ** 40)).to.be.true
    expect(transferLog.args.tokenId.lt(2 ** 38)).to.be.false
  })
})
