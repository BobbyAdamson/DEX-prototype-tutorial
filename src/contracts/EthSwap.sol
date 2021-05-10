pragma solidity >0.5.2;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap exchange";
  uint public redemptionRate = 100;
  Token public token;

  constructor(Token _token) public {
    token = _token;
  }

  function buyTokens() public payable {
    uint tokenAmount = msg.value * redemptionRate;
    token.transfer(msg.sender, tokenAmount);
  }
}
