import { ethers } from 'hardhat'
import { appendFile } from '../utils'

async function main() {
  const [receiverAddress] = process.argv.slice(2)
  const [account0] = await ethers.getSigners()

  const transaction = await account0.sendTransaction({
    to: receiverAddress,
    value: ethers.utils.parseEther('1.0')
  })
  await transaction.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
