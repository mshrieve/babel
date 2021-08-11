import { link } from 'ethereum-waffle'
import { ethers } from 'hardhat'
import { appendFile, writeFile } from '../utils'

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.addresses' })

async function main() {
  const BytesourceFactory = await ethers.getContractFactory('Bytes')
  const BytesSource = await BytesourceFactory.deploy(
    '0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B', // VRF Coordinator
    '0x01BE23585060835E02B77ef475b0Cc51aA1e0709' // LINK Token
  )
  await BytesSource.deployed()

  console.log(BytesSource.address)
  try {
    const envVarPath = '.env.addresses'
    // await writeFile(envVarPath, '')
    const content = `BYTES_ADDRESS=${BytesSource.address}\n`
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
