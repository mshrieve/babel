import { ethers } from 'hardhat'
import { appendFile, writeFile } from '../utils'

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.addresses' })

async function main() {
  //   whitelist Words to use BytesSource
  //   const BytesSource = await (
  //     await ethers.getContractFactory('Bytes')
  //   ).attach(process.env.BYTES_ADDRESS)
  //   let transaction = await BytesSource.whitelistRequester(Words.address)
  //   await transaction.wait()

  // const VaultFactory = await ethers.getContractFactory('Vault')
  // const Vault = await VaultFactory.deploy(Babel.address, Words.address)
  // await Vault.deployed()

  const LyricFactory = await ethers.getContractFactory('Lyric')
  const Lyric = await LyricFactory.attach(process.env.LYRIC_ADDRESS)

  console.log(Lyric.address)
  const supply = await Lyric.totalSupply()
  console.log(supply.toString())
  for (let i = 0; i < supply; i++) {
    const word = await Lyric.tokenByIndex(i)
    console.log(word.toString())
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
