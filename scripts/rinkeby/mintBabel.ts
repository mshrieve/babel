import { ethers } from 'hardhat'

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.addresses' })

async function main() {
  const [owner] = await ethers.getSigners()
  const Babel = await (
    await ethers.getContractFactory('Babel')
  ).attach(process.env.BABEL_ADDRESS)
  let transaction = await Babel.mint(
    '0x9d3C32c4Cd52508092fbfB10471Eaab72abF2497',
    ethers.utils.parseEther('10')
  )
  await transaction.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
