const { assert } = require('chai');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'Ether')
}

contract('Token', () => {

  describe('deployment', async () => {

    it('contract has a name', async () => {
      const token = await Token.new()
      const name = await token.name()

      assert.equal(name, 'DApp Token');
    })
  })
})

contract('EthSwap', (accounts) => {

  let token, ethSwap;

  before(async () => {
    // Mock the deploy method
    token = await Token.new()
    ethSwap = await EthSwap.new()

    await token.transfer(ethSwap.address, tokens('1000000'))
  })

  describe('EthSwap deployment', async () => {

    it('contract has a name', async () => {
      const name = await ethSwap.name()

      assert.equal(name, 'EthSwap exchange');
    })

    it('contract has tokens', async () => {
      const balance = await token.balanceOf(ethSwap.address)

      assert.equal(balance.toString(), tokens('1000000'))
    })
  })
})
