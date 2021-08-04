import { task } from 'hardhat/config'
import { encodeWord, charToNumber, setStringIndex, decodeWord } from '../utils'
task('compareSetIndex', 'gets a random word').setAction(
  async (args, { ethers }) => {
    const ByteArrayHarnessFactory = await ethers.getContractFactory('Words')
    const ByteArrayHarness = await ByteArrayHarnessFactory.deploy()
    const ByteArrayHarnessInterface = ByteArrayHarnessFactory.interface
    await ByteArrayHarness.deployed()

    // const [signer] = await ethers.getSigners()
    // const wordsContractWithSigner = wordsContract.connect(signer)

    const string = 'hello'
    const word = encodeWord(string)

    const newWord = await ByteArrayHarness.setIndex(word, 3, charToNumber('a'))
  }
)
