import { ethers } from 'hardhat'

async function main() {
  // We get the contract to deploy
  const GeneratorFactory = await ethers.getContractFactory('Generator')
  const Generator = await GeneratorFactory.deploy()
  const GeneratorInterface = GeneratorFactory.interface
  await Generator.deployed()

  const MockWordsFactory = await ethers.getContractFactory('MockWords')
  const Words = await MockWordsFactory.deploy(Generator.address)
  const WordsInterface = MockWordsFactory.interface
  await Words.deployed()

  console.log(WordsInterface)
  const transaction = await Words.requestNewRandomWord()
  const receipt = await transaction.wait()
  const iface = new ethers.utils.Interface([
    ...WordsInterface.fragments,
    ...GeneratorInterface.fragments
  ])
  //   console.log(receipt.logs)
  console.log(receipt.logs.map((log: any) => iface.parseLog(log)))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
