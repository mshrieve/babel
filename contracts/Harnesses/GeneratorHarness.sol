// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../Generator.sol';

contract GeneratorHarness is Generator {
    event WordGenerated(bytes32 indexed word);

    constructor() Generator() {}

    function _generateWord(bytes32 random) external returns (bytes32 word) {
        word = generateWord(random);
        emit WordGenerated(word);
    }

    function _isWordAvailable(bytes32 word)
        external
        view
        returns (bool result)
    {
        return isWordAvailable(word);
    }

    function _findFinalLetter(bytes32 word) external returns (bytes32) {
        return findFinalLetter(word);
    }

    function _findLetter(bytes32 word, uint8 index) external returns (bytes32) {
        return findLetter(word, index);
    }
}
