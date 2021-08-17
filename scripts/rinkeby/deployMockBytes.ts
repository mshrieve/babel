import { ethers } from 'hardhat'
import { appendFile } from '../utils'

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.addresses' })

async function main() {
  const BytesourceFactory = await ethers.getContractFactory('MockBytes')
  const BytesSource = await BytesourceFactory.deploy()
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
