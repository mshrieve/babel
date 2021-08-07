// SPDX-License-Identifier: UNLICENSED

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import './Words.sol';
import './Babel.sol';
import './Libraries/ThreeBytes32.sol';
import 'hardhat/console.sol';

pragma solidity ^0.8.0;

contract Three is Ownable {
    Words immutable words;
    Babel immutable babel;

    bytes32 public state;

    constructor(address _words, address _babel) Ownable() {
        words = Words(_words);
        babel = Babel(_babel);
    }

    function replace(bytes32 _word, uint8 _position) external {
        require(_position < 3);
        require(words.ownerOf(uint256(_word)) == msg.sender);

        babel.transferFrom(msg.sender, address(this), 3);
        state = ThreeBytes32.writeWord(state, _word, _position);
    }
}
