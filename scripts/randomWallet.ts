import { ethers } from 'hardhat'
import { appendFile, writeFile } from './utils'

async function main() {
  const wallet = ethers.Wallet.createRandom(Date.now() + 2 ** 57 - 612)
  await appendFile(
    './.env',
    '\n' +
      'PRIVATE_KEY=' +
      wallet.privateKey +
      '\n' +
      'ADDRESS=' +
      wallet.address
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
