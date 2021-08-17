import { ethers } from 'hardhat'
import { appendFile } from '../utils'

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.addresses' })

async function main() {
  const CurveFactory = await await ethers.getContractFactory('Curve')
  const Curve = await CurveFactory.deploy(process.env.BABEL_ADDRESS)

  console.log(Curve.address)

  //   whitelist Curve to mint Babel
  const Babel = await (
    await ethers.getContractFactory('Babel')
  ).attach(process.env.BABEL_ADDRESS)
  let transaction = await Babel.whitelistAddress(Curve.address)
  await transaction.wait()

  try {
    const envVarPath = '.env.addresses'
    // await writeFile(envVarPath, '')
    const content = `CURVE_ADDRESS=${Curve.address}\n`
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
