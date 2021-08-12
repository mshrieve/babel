import { ethers } from 'hardhat'
import { BigNumber, Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Interface } from 'ethers/lib/utils'
import { encodeWord, randomWord } from '../utils'

describe('Lyric', function () {
  let Lyric: Contract
  let Words: Contract
  let Babel: Contract
  let Bytes32Source: Contract
  let owner: SignerWithAddress
  let iface: Interface
  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0]

    const Bytes32SourceFactory = await ethers.getContractFactory('MockBytes')
    Bytes32Source = await Bytes32SourceFactory.deploy()
    const Bytes32SourceInterface = Bytes32SourceFactory.interface
    await Bytes32Source.deployed()

    const BabelFactory = await ethers.getContractFactory('Babel')
    Babel = await BabelFactory.deploy()
    const BabelInterface = BabelFactory.interface
    await Babel.deployed()

    const WordsFactory = await ethers.getContractFactory('Words')
    Words = await WordsFactory.deploy(Bytes32Source.address, Babel.address)
    const WordsInterface = WordsFactory.interface
    await Words.deployed()

    const LyricFactory = await ethers.getContractFactory('Lyric')
    Lyric = await LyricFactory.deploy(Words.address, Babel.address)
    const LyricInterface = LyricFactory.interface
    await Lyric.deployed()

    let transaction = await Babel.mint(
      owner.address,
      ethers.utils.parseEther('1000')
    )
    await transaction.wait()

    transaction = await Babel.approve(
      Lyric.address,
      ethers.utils.parseEther('1000')
    )
    await transaction.wait()

    iface = new ethers.utils.Interface([
      ...WordsInterface.fragments,
      ...Bytes32SourceInterface.fragments
    ])
  })

  it('should complete round', async function () {
    let babelBalance = await Babel.balanceOf(owner.address)
    const baseBid = ethers.utils.parseEther('.001')
    for (let i = 0; i < 8; i++) {
      // each transaction is one block
      // rounds last 5 blocks
      const word = randomWord()
      let transaction = await Words.mintWord(owner.address, word)
      let receipt = await transaction.wait()
      transaction = await Lyric.bidNewLyric(
        word,
        ethers.utils.hexZeroPad('0x' + (i % 3), 32),
        baseBid.mul(i + 1)
      )
      await transaction.wait()
      console.log(i)
      const newBabelBalance = await Babel.balanceOf(owner.address)
      if (i < 7)
        expect(newBabelBalance.toString()).to.equal(
          babelBalance.sub(baseBid).toString()
        )
      if (i == 7)
        expect(newBabelBalance).to.equal(babelBalance.sub(baseBid.mul(8)))
      babelBalance = newBabelBalance
    }
    // const filter = Lyric.filters.RoundComplete()
    // const query = await Lyric.queryFilter(filter)
    // console.log(query)
    console.log(babelBalance.toString())
  })
  // const wordRequestLog = iface.parseLog(receipt.logs[1])
  // expect(wordRequestLog.name).to.equal('WordRequest')
  // expect(wordRequestLog.args.to).to.equal(owner.address)
})
