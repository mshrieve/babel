/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import * as dotenv from 'dotenv'
dotenv.config()

import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-gas-reporter'
import './tasks'

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/7c1f2ac532a842dcb851fdbabee9ff16',
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 5
    }
  },
  paths: {
    sources: './contracts',
    tests: './tests',
    cache: './cache',
    artifacts: './artifacts'
  }
}
