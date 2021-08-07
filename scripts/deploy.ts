import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import fs from 'fs'

async function main() {
  const [owner] = await ethers.getSigners()

  const GeneratorFactory = await ethers.getContractFactory('Generator')
  const Generator = await GeneratorFactory.deploy()
  const GeneratorInterface = GeneratorFactory.interface
  await Generator.deployed()

  const Bytes32SourceFactory = await ethers.getContractFactory('MockRandom')
  const Bytes32Source = await Bytes32SourceFactory.deploy()
  const Bytes32SourceInterface = Bytes32SourceFactory.interface
  await Bytes32Source.deployed()

  const BabelFactory = await ethers.getContractFactory('Token')
  const Babel = await BabelFactory.deploy('BABEL', 'babel')
  const BabelInterface = BabelFactory.interface
  await Babel.deployed()

  const WordsFactory = await ethers.getContractFactory('Words')
  const Words = await WordsFactory.deploy(
    Generator.address,
    Bytes32Source.address,
    Babel.address
  )
  const WordsInterface = WordsFactory.interface
  await Words.deployed()

  const events = Object.values({
    ...WordsInterface.events,
    ...GeneratorInterface.events,
    ...Bytes32SourceInterface.events,
    ...BabelInterface.events
  })

  const iface = new ethers.utils.Interface(events)

  const envVars: any = {
    GENERATOR_ADDRESS: Generator.address,
    RANDOM_ADDRESS: Bytes32Source.address,
    BABEL_ADDRESS: Babel.address,
    WORDS_ADDRESS: Words.address
  }

  const appendFile = async (path: fs.PathLike, content: string) =>
    new Promise((res, rej) =>
      fs.appendFile(path, content, (err) => {
        if (err) return rej()
        return res(true)
      })
    )

  const writeFile = async (path: fs.PathLike, content: string) =>
    new Promise((res, rej) =>
      fs.writeFile(path, content, (err) => {
        if (err) return rej()
        return res(true)
      })
    )

  try {
    await writeFile('./test.txt', '')
    for (const varName in envVars) {
      const content = `NEXT_PUBLIC_${varName}=${envVars[varName]}\n`
      await appendFile('./test.txt', content)
    }

    //file written successfully
  } catch (err) {
    console.error(err)
  }
  // console.log('owner: ', owner.address)
  // let transaction = await Words.requestNewRandomWord(owner.address)
  // let receipt = await transaction.wait()

  // //   console.log(receipt.logs)
  // const bytes32RequestLog = iface.parseLog(receipt.logs[2])
  // const requestId = bytes32RequestLog.args.requestId

  // transaction = await Bytes32Source.fulfillRandomBytes32(requestId)
  // receipt = await transaction.wait()

  // const tokenId = iface.parseLog(receipt.logs[0]).args.tokenId
  // console.log('tokenId: ', tokenId.toHexString())
  // console.log(receipt.logs.map((log: any) => iface.parseLog(log)))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
