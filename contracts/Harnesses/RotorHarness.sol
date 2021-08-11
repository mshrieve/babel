// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../Rotor.sol';

contract RotorHarness is Rotor {
    event Word(bytes32 indexed word);

    constructor() Rotor() {}

    function _generateWord(bytes32 random) external returns (bytes32 word) {
        word = generateWord(random);
        emit Word(word);
    }

    function _isWordAvailable(bytes32 _word)
        external
        view
        returns (bool result)
    {
        return isWordAvailable(_word);
    }

    function _findFinalLetter(bytes32 _word) external returns (bytes32 word) {
        word = findFinalLetter(_word);
        emit Word(word);
    }

    function _findLetter(bytes32 _word, uint8 _index)
        external
        returns (bytes32)
    {
        return findLetter(_word, _index);
    }
}
