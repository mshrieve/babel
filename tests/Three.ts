import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Interface } from 'ethers/lib/utils'

describe('Words', function () {
  let Three: Contract
  let Words: Contract
  let Bytes32Source: Contract
  let owner: SignerWithAddress
  let iface: Interface

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0]

    const ThreeFactory = await ethers.getContractFactory('Three')
    const Three = await ThreeFactory.deploy()
    const ThreeInterface = ThreeFactory.interface
    await Three.deployed()

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

    const wordRequestLog = iface.parseLog(receipt.logs[1])
    expect(wordRequestLog.name).to.equal('WordRequest')
    expect(wordRequestLog.args.to).to.equal(owner.address)
  })

  it('should fulfill request', async function () {
    let transaction = await Words.requestWord(owner.address)
    let receipt = await transaction.wait()

    const bytes32RequestLog = iface.parseLog(receipt.logs[0])
    const wordRequestLog = iface.parseLog(receipt.logs[1])
    expect(bytes32RequestLog.name).to.equal('Bytes32Requested')

    const requestId = bytes32RequestLog.args.requestId
    expect(bytes32RequestLog.args.callback).to.equal(Words.address)

    transaction = await Bytes32Source.fulfillRandomBytes32(requestId)
    receipt = await transaction.wait()

    const transferLog = iface.parseLog(receipt.logs[0])

    expect(transferLog.args.to).be.equal(owner.address)

    expect(transferLog.args.tokenId.lt(2 ** 40)).to.be.true
    expect(transferLog.args.tokenId.lt(2 ** 38)).to.be.false
  })

  it('should get events', async () => {
    // const filter = {
    //   address: Words.address,
    //   topics: [
    //     ethers.utils.id('Transfer(address,address,uint256)'),
    //     null,
    //     ethers.utils.hexZeroPad(owner.address, 32)
    //   ]
    // }
    const filter = Words.filters.Transfer(null, owner.address)
    const query = await Words.queryFilter(filter)
    console.log(query)
  })
})
