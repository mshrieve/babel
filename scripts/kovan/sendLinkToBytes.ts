import { link } from 'ethereum-waffle'
import { ethers } from 'hardhat'
import { appendFile, writeFile } from '../utils'

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.addresses' })

async function main() {
  const [owner] = await ethers.getSigners()
  const Link = await (
    await ethers.getContractFactory('ERC20')
  ).attach('0x01BE23585060835E02B77ef475b0Cc51aA1e0709')
  const balance = await Link.balanceOf(owner.address)

  console.log(ethers.utils.formatEther(balance))

  const transaction = await Link.transfer(
    process.env.BYTES_ADDRESS,
    ethers.utils.parseEther('10')
  )
  const receipt = await transaction.wait()

  console.log(receipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
