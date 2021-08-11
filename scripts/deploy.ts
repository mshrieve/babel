import { ethers } from 'hardhat'
import { appendFile, writeFile } from './utils'

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

  const BabelFactory = await ethers.getContractFactory('Babel')
  const Babel = await BabelFactory.deploy()
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

  const VaultFactory = await ethers.getContractFactory('Vault')
  const Vault = await VaultFactory.deploy(Babel.address, Words.address)
  await Vault.deployed()

  const ThreeFactory = await ethers.getContractFactory('Three')
  const Three = await ThreeFactory.deploy(Words.address, Babel.address)
  await Three.deployed()

  let transaction = await Babel.whitelistAddress(Vault.address)
  await transaction.wait()

  const events = Object.values({
    ...WordsInterface.events,
    ...GeneratorInterface.events,
    ...Bytes32SourceInterface.events,
    ...BabelInterface.events
  })

  const envVars: any = {
    GENERATOR_ADDRESS: Generator.address,
    RANDOM_ADDRESS: Bytes32Source.address,
    BABEL_ADDRESS: Babel.address,
    WORDS_ADDRESS: Words.address,
    VAULT_ADDRESS: Vault.address,
    THREE_ADDRESS: Three.address
  }

  try {
    const envVarPath = './frontend/.env.local'
    await writeFile(envVarPath, '')
    for (const varName in envVars) {
      const content = `NEXT_PUBLIC_${varName}=${envVars[varName]}\n`
      await appendFile(envVarPath, content)
    }

    //file written successfully
  } catch (err) {
    console.error(err)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
