// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// babel
// coins

contract Babel is ERC20 {
    mapping(address => bool) internal minters;
    address internal owner;

    modifier onlyMinter() {
        require(minters[msg.sender], 'Babel: msg.sender not in whitelist');
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() ERC20('babel', 'BBL') {
        owner = msg.sender;
        minters[owner] = true;
    }

    function whitelistAddress(address minter) external onlyOwner {
        minters[minter] = true;
    }

    function mint(address account, uint256 amount) external onlyMinter {
        _mint(account, amount);
    }
}
