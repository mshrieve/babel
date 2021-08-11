import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Interface } from 'ethers/lib/utils'
import { BigNumber } from 'bignumber.js'

describe('Words', function () {
  let Babel: Contract
  let BabelInterface: Interface

  let Words: Contract
  let WordsInterface: Interface

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

    const Bytes32SourceFactory = await ethers.getContractFactory('MockBytes')
    Bytes32Source = await Bytes32SourceFactory.deploy()
    const Bytes32SourceInterface = Bytes32SourceFactory.interface
    await Bytes32Source.deployed()

    const BabelFactory = await ethers.getContractFactory('Token')
    Babel = await BabelFactory.deploy('BABEL', 'babel')
    BabelInterface = BabelFactory.interface
    await Babel.deployed()

    let transaction = await Babel.mint(
      owner.address,
      new BigNumber(10).exponentiatedBy(18).times(1000).toFixed()
    )
    await transaction.wait()

    const WordsFactory = await ethers.getContractFactory('Words')
    Words = await WordsFactory.deploy(
      Generator.address,
      Bytes32Source.address,
      Babel.address
    )
    WordsInterface = WordsFactory.interface
    await Words.deployed()

    transaction = await Babel.approve(Words.address, 1000)
    await transaction.wait()

    const events = Object.values({
      ...WordsInterface.events,
      ...GeneratorInterface.events,
      ...Bytes32SourceInterface.events,
      ...BabelInterface.events
    })

    iface = new ethers.utils.Interface(events)
  })

  it('should request word', async function () {
    let transaction = await Words.requestWord(owner.address)
    let receipt = await transaction.wait()

    const logs = receipt.logs.map((log: any) => iface.parseLog(log))

    // expect(wordRequestLog.name).to.equal('WordRequest')
    // expect(wordRequestLog.args.to).to.equal(owner.address)
  })

  it('should fulfill request', async function () {
    let transaction = await Words.requestWord(owner.address)
    let receipt = await transaction.wait()

    const bytes32RequestLog = iface.parseLog(receipt.logs[2])
    const wordRequestLog = iface.parseLog(receipt.logs[3])
    expect(bytes32RequestLog.name).to.equal('Bytes32Requested')

    const requestId = bytes32RequestLog.args.requestId
    expect(bytes32RequestLog.args.callback).to.equal(Words.address)

    transaction = await Bytes32Source.fulfillRandomBytes32(requestId)
    receipt = await transaction.wait()

    // const logs = receipt.logs.map((log: any) => iface.parseLog(log))
    // console.log(logs)
    let transferLog
    try {
      transferLog = iface.parseLog(receipt.logs[0])
    } catch (e) {
      transferLog = WordsInterface.parseLog(receipt.logs[0])
    }
    console.log(transferLog)
    // ERC20 transfer is different from ERC721 transfer, the tokenId is indexed on the latter.
    // this is unfortunately causing issues debugging
    // console.log(iface.events['Transfer(address,address,uint256)'].inputs)
    // console.log(
    //   WordsInterface.events['Transfer(address,address,uint256)'].inputs
    // )
    // expect(transferLog.args.to).be.equal(owner.address)

    // expect(transferLog.args.tokenId.lt(2 ** 40)).to.be.true
    // expect(transferLog.args.tokenId.lt(2 ** 38)).to.be.false
  })

  //   it('should get events', async () => {
  //     const filter = Words.filters.Transfer(null, owner.address)
  //     const query = await Words.queryFilter(filter)
  //     console.log(query)
  //   })
})
