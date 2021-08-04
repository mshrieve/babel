// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Interfaces/IWords.sol';
import './Interfaces/IRandom.sol';

contract MockRandom is IRandom {
    uint256 private salt;
    IWords public words;

    constructor(address _words) {
        words = IWords(_words);
    }

    function randomize() internal returns (bytes32) {
        salt++;
        return keccak256(abi.encodePacked(block.timestamp, salt));
    }

    function requestRandomBytes32()
        external
        override
        returns (bytes32 requestId)
    {
        requestId = keccak256(abi.encodePacked(block.timestamp, salt));
        words.fulfillRandomBytes32(requestId, randomize());
    }
}
