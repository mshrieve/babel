import { ethers } from 'hardhat'
import { appendFile } from '../utils'

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  console.log('Account balance:', (await deployer.getBalance()).toString())
  const BabelFactory = await (
    await ethers.getContractFactory('Babel')
  ).connect(deployer)
  const Babel = await BabelFactory.deploy()

  console.log(Babel.address)
  try {
    const envVarPath = '.env.addresses'
    // await writeFile(envVarPath, '')
    const content = `BABEL_ADDRESS=${Babel.address}\n`
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
