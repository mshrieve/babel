import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { Interface } from 'ethers/lib/utils'
import { BigNumber } from 'bignumber.js'
import { Decimal } from 'decimal.js'

const eDecimals = new BigNumber(10).exponentiatedBy(18)
describe('Bank', function () {
  let Bank: Contract
  let BankInterface: Interface

  let Babel: Contract
  let BabelInterface: Interface

  before(async () => {
    // deploy Babel
    const BabelFactory = await ethers.getContractFactory('Babel')
    Babel = await BabelFactory.deploy()
    BabelInterface = BabelFactory.interface
    await Babel.deployed()

    // deploy Bank
    const BankFactory = await ethers.getContractFactory('Bank')
    Bank = await BankFactory.deploy(Babel.address)
    BankInterface = BankFactory.interface
    await Bank.deployed()

    // whitelist Bank
    let transaction = await Babel.whitelistAddress(Bank.address)
    await transaction.wait()
  })

  it('Should get price 1', async () => {
    const actual = await Bank.getPrice(1)
    const expected = await Bank.floor()
    expect(actual.toString()).to.equal(expected.toString())
  })

  it('Should get price 100', async () => {
    const fDecimals = new Decimal('1e-18')
    const actual = await Bank.getPrice(eDecimals.times(1000).toFixed())
    const two = new Decimal(2)
    const floor = new Decimal((await Bank.floor()).toString()).mul(fDecimals)
    const gamma = new Decimal((await Bank.gamma()).toString()).mul(fDecimals)
    const expected = floor
      .plus(two.pow(gamma.times(1000)))
      .minus(1)
      .times('1e18')
      .floor()

    expect(actual.toString()).to.equal(expected.toFixed())
  })

  it('Should get decrease after 1 block', async () => {
    const fDecimals = new Decimal('1e-18')
    let transaction = await Bank.purchase(eDecimals.toFixed(), {
      value: eDecimals.toFixed()
    })
    await transaction.wait()

    transaction = await Bank.purchase(eDecimals.toFixed(), {
      value: eDecimals.toFixed()
    })
    await transaction.wait()

    const actual = await Bank.getPrice(eDecimals.times(1000).toFixed())
    const two = new Decimal(2)
    const floor = new Decimal((await Bank.floor()).toString()).mul(fDecimals)
    const gamma = new Decimal((await Bank.gamma()).toString()).mul(fDecimals)
    const expected = floor
      .plus(two.pow(gamma.times(1000)))
      .minus(1)
      .times('1e18')
      .floor()

    expect(actual.toString()).to.equal(expected.toFixed())
  })
})
