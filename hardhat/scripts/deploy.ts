import { ethers } from 'hardhat'

async function main() {
  // We get the contract to deploy
  const Words = await ethers.getContractFactory('Words')
  const wordsContract = await Words.deploy()

  await wordsContract.deployed()
  console.log('Words deployed by: ', await wordsContract.signer.getAddress())
  console.log('Words deployed to: ', wordsContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
