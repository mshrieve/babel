import { ethers } from 'hardhat'
import { task } from 'hardhat/config'

task('sendEth', 'sends 1 eth to receiver')
  .addParam('receiver', "The receiver's address")
  .setAction(async (args, { ethers }) => {
    const [account0] = await ethers.getSigners()

    const transaction = await account0.sendTransaction({
      to: args.receiver,
      value: ethers.utils.parseEther('1.0')
    })
    await transaction.wait()
  })

task('mintBabel', 'mints 1000 babel to receiver')
  .addParam('babel', "The babel contract's address")
  .addParam('receiver', "The receiver's address")
  .setAction(async (args, { ethers }) => {
    const Babel = await (
      await ethers.getContractFactory('Babel')
    ).attach(args.babel)
    const transaction = await Babel.mint(
      args.receiver,
      ethers.utils.parseEther('1000')
    )
    await transaction.wait()
  })

task('deployWords', 'deploys the words contract')
  .addParam('bytes', "The bytes contract's address")
  .addParam('babel', "The babel contract's address")
  .setAction(async (args, { ethers }) => {
    const WordsFactory = await ethers.getContractFactory('Words')
    const Words = await WordsFactory.deploy(args.bytes, args.babel)

    console.log(Words.address)
    // no need to whitelist with MockBytes
    const BytesSource = await (
      await ethers.getContractFactory('MockBytes')
    ).attach(args.bytes)
    let transaction = await BytesSource.whitelistRequester(Words.address)
    await transaction.wait()
  })
