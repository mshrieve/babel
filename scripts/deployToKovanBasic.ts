import { ethers } from 'hardhat'
import { appendFile, writeFile } from './utils'

async function main() {
  const RotorFactory = await ethers.getContractFactory('Rotor')
  const Rotor = await RotorFactory.deploy()
  await Rotor.deployed()

  const BytesSourceFactory = await ethers.getContractFactory('Bytes')
  const BytesSource = await BytesSourceFactory.deploy(
    '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9', // VRF Coordinator
    '0xa36085F69e2889c224210F603D836748e7dC0088' // LINK Token
  )
  await BytesSource.deployed()

  const BabelFactory = await ethers.getContractFactory('Babel')
  const Babel = await BabelFactory.deploy()
  await Babel.deployed()

  const WordsFactory = await ethers.getContractFactory('Words')
  const Words = await WordsFactory.deploy(
    Rotor.address,
    BytesSource.address,
    Babel.address
  )
  await Words.deployed()

  const Link = await (
    await ethers.getContractFactory('ERC20')
  ).attach('0xa36085F69e2889c224210F603D836748e7dC0088')

  const envVars: any = {
    ROTOR_ADDRESS: Rotor.address,
    BYTES_ADDRESS: BytesSource.address,
    BABEL_ADDRESS: Babel.address,
    WORDS_ADDRESS: Words.address,
    LYRIC_ADDRESS: Link.address
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
