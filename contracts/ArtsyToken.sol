// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ArtsyToken is ERC20 {
    uint256 public TOTAL_SUPPLY = 1_000;

    address public owner;
    mapping(address => uint256) balances;

    constructor() ERC20("ArtsyToken", "ART") {
        owner = msg.sender;
        balances[owner] = TOTAL_SUPPLY;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function totalSupply() public view override returns (uint256) {
        return TOTAL_SUPPLY;
    }

    function balanceOf(address wallet) public view override returns (uint256) {
        return balances[wallet];
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        require(balances[msg.sender] >= amount, "Not enough tokens");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        return true;
    }
}
