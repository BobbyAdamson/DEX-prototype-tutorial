const { assert } = require('chai');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether')
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

contract('EthSwap', ([deployer, investorAccount]) => {

  let token, ethSwap;

  before(async () => {
    // Mock the deploy method
    token = await Token.new()
    ethSwap = await EthSwap.new(token.address)

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

  describe('#buyTokens', async () => {
    let result;

    before(async () => {
      result = await ethSwap.buyTokens({ from: investorAccount, value: tokens('1')});
    })

    it('sender receives tokens', async () => {
      let investorBalance = await token.balanceOf(investorAccount);

      assert.equal(investorBalance.toString(), tokens('100'));
    })

    it('EthSwap sends tokens', async () => {
      let ethSwapTokenBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapTokenBalance.toString(), tokens('999900'))
    })

    it('EthSwap receives ETH', async () => {
      let ethSwapEthBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapEthBalance.toString(), tokens('1'))
    })
  })
})
