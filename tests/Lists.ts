import { ethers } from 'hardhat'
import { BigNumber, Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Interface } from 'ethers/lib/utils'
import { encodeWord, randomWord } from '../utils'

describe('Lyric', function () {
  let Words: Contract
  let Lists: Contract
  let owner: SignerWithAddress
  let iface: Interface

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0]

    const Bytes32SourceFactory = await ethers.getContractFactory('MockBytes')
    const Bytes32Source = await Bytes32SourceFactory.deploy()
    const Bytes32SourceInterface = Bytes32SourceFactory.interface
    await Bytes32Source.deployed()

    const BabelFactory = await ethers.getContractFactory('Babel')
    const Babel = await BabelFactory.deploy()
    const BabelInterface = BabelFactory.interface
    await Babel.deployed()

    const WordsFactory = await ethers.getContractFactory('Words')
    Words = await WordsFactory.deploy(Bytes32Source.address, Babel.address)
    const WordsInterface = WordsFactory.interface
    await Words.deployed()

    const ListsFactory = await ethers.getContractFactory('Lists')
    Lists = await ListsFactory.deploy(Words.address)
    const ListsInterface = ListsFactory.interface
    await Lists.deployed()

    iface = new ethers.utils.Interface([
      ...WordsInterface.fragments,
      ...Bytes32SourceInterface.fragments
    ])
  })

  it('should make list', async function () {
    // each transaction is one block
    // rounds last 5 blocks
    const word = randomWord()
    let transaction = await Words.mintWord(owner.address, word)
    let receipt = await transaction.wait()
    transaction = await Lists.mintList(word, 0)
    receipt = await transaction.wait()
  })

  it('should add to list', async function () {
    // each transaction is one block
    // rounds last 5 blocks
    const word = randomWord()
    let transaction = await Words.mintWord(owner.address, word)
    let receipt = await transaction.wait()
    transaction = await Words.approve(Lists.address, word)
    await transaction.wait()
    transaction = await Lists.modifyList(0, word, 2)
    receipt = await transaction.wait()
  })
})
