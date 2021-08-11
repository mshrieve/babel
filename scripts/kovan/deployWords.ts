import { link } from 'ethereum-waffle'
import { ethers } from 'hardhat'
import { appendFile, writeFile } from '../utils'

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.addresses' })

async function main() {
  const WordsFactory = await ethers.getContractFactory('Words')
  const Words = await WordsFactory.deploy(
    process.env.BYTES_ADDRESS,
    process.env.BABEL_ADDRESS
  )
  await Words.deployed()

  //   whitelist Words to use BytesSource
  const BytesSource = await (
    await ethers.getContractFactory('Bytes')
  ).attach(process.env.BYTES_ADDRESS)
  let transaction = await BytesSource.whitelistRequester(Words.address)
  await transaction.wait()

  // const VaultFactory = await ethers.getContractFactory('Vault')
  // const Vault = await VaultFactory.deploy(Babel.address, Words.address)
  // await Vault.deployed()

  // const LyricFactory = await ethers.getContractFactory('Lyric')
  // const Lyric = await LyricFactory.deploy(Words.address, Babel.address)
  // await Lyric.deployed()

  // transaction = await Babel.whitelistAddress(Vault.address)
  // await transaction.wait()

  // for LINK
  // const ERC20Factory = await (
  //   await ethers.getContractFactory('ERC20')
  // ).attach('0xa36085F69e2889c224210F603D836748e7dC0088')
  console.log(Words.address)
  try {
    const envVarPath = '.env.addresses'
    // await writeFile(envVarPath, '')
    const content = `WORDS_ADDRESS=${Words.address}\n`
    await appendFile(envVarPath, content)

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
