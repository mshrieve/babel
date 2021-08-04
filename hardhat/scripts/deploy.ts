import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

async function main() {
  const [owner] = await ethers.getSigners()

  const GeneratorFactory = await ethers.getContractFactory('Generator')
  const Generator = await GeneratorFactory.deploy()
  const GeneratorInterface = GeneratorFactory.interface
  await Generator.deployed()

  const Bytes32SourceFactory = await ethers.getContractFactory(
    'MockRandomBytes32'
  )
  const Bytes32Source = await Bytes32SourceFactory.deploy()
  const Bytes32SourceInterface = Bytes32SourceFactory.interface
  await Bytes32Source.deployed()

  const WordsFactory = await ethers.getContractFactory('Words')
  const Words = await WordsFactory.deploy(
    Generator.address,
    Bytes32Source.address
  )
  const WordsInterface = WordsFactory.interface
  await Words.deployed()

  const iface = new ethers.utils.Interface([
    ...WordsInterface.fragments,
    ...GeneratorInterface.fragments,
    ...Bytes32SourceInterface.fragments
  ])
  console.log('owner: ', owner.address)
  let transaction = await Words.requestNewRandomWord(owner.address)
  let receipt = await transaction.wait()

  //   console.log(receipt.logs)
  const requestId = iface.parseLog(receipt.logs[0]).args.requestId
  console.log('requestId: ', requestId)

  transaction = await Bytes32Source.fulfillRandomBytes32(requestId)
  receipt = await transaction.wait()

  const tokenId = iface.parseLog(receipt.logs[0]).args.tokenId
  console.log('tokenId: ', tokenId.toHexString())
  // console.log(receipt.logs.map((log: any) => iface.parseLog(log)))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
