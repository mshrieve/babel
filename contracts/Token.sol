// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Token is ERC20, Ownable {
    constructor(string memory symbol, string memory name)
        Ownable()
        ERC20(symbol, name)
    {}

    function mint(address account, uint256 amount) public virtual onlyOwner {
        _mint(account, amount);
    }

    // can receive words directly
    function onERC721Received() public {}
}
