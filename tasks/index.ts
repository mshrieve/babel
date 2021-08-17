import { task } from 'hardhat/config'
import './localhost'

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

task('deployBabel', 'deploys babel').setAction(async (args, { ethers }) => {
  const BabelFactory = await ethers.getContractFactory('Babel')
  const Babel = await BabelFactory.deploy()

  console.log(Babel.address)
})

task('getRandom', 'Looks up deployments').setAction(
  async (args, { ethers }) => {
    const Words = await ethers.getContractFactory('Words')
    const wordsContract = await Words.deploy()
    await wordsContract.deployed()

    const random = await wordsContract.getRandom()
    console.log(random)
  }
)

// task('isBabelWhitelist', 'returns true if contract is on the babel whitelist')
//   .addParam('contractAddress', "The contract's address")
//   .addParam('babelAddress', "The babel's address")
//   .setAction(async (args, { ethers }) => {
//     const Babel = await (
//       await ethers.getContractFactory('Babel')
//     ).attach(args.address)

//     Babel
//     // const word = await Words.currentWord()
//     // console.log((await Words.allocated()).toString())
//   })

const hexToChar = (hex: string) => {
  return String.fromCharCode(97 + Number.parseInt(hex, 16))
}

const decodeWord = (hex: string) => {
  const letters = hex.slice(56)
  const lettersArray = new Array<string>()
  for (let j = 0; j < 5; j++) {
    lettersArray.push(letters[2 * j] + letters[2 * j + 1])
  }
  return lettersArray.map((x) => hexToChar(x)).join('')
}

task('getManyWords', 'gets many random words').setAction(
  async (args, { ethers }) => {
    const Words = await ethers.getContractFactory('Words')
    const wordsContract = await Words.deploy()
    await wordsContract.deployed()
    let collisions = 0
    let allocated = 0
    for (let i = 0; i < 26 ** 5; i++) {
      for (let j = 0; j < 10000; j++) wordsContract.getWord()
      // const receipt = await sent.wait()
      // return receipt

      // await Promise.all(transactions)

      console.log(
        'collisions: ' +
          (await wordsContract.collisions()) +
          ', allocated: ' +
          (await wordsContract.allocated())
      )
    }
  }
)

task('testWord', 'emits a test word').setAction(async (args, { ethers }) => {
  const Words = await ethers.getContractFactory('Words')
  const wordsContract = await Words.deploy()
  await wordsContract.deployed()

  // const [signer] = await ethers.getSigners()
  // const wordsContractWithSigner = wordsContract.connect(signer)
  wordsContract.on('testEvent', (args) => {
    console.log('testEvents: ', args)
  })

  const random = await wordsContract.emitTestWord()
  const receipt = await random.wait()
  console.log(receipt.events[0].args)
  console.log(receipt.events[1].args)
  // console.log(receipt.events[0].args[0])
  const testEvent = wordsContract.filters.testEvent()
  // console.log(testEvent)
})
