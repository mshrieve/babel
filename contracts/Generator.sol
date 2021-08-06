// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import './Libraries/ByteArray.sol';

contract Generator {
    constructor() {}

    mapping(bytes32 => uint8) public lettersUnavailableAfterPrefix;
    mapping(bytes32 => bool) public wordUnavailable;
    mapping(address => bytes32) public words;
    uint256 public wordsAvailable = 26**5;

    uint256 public allocated;

    function generateWord(bytes32 random) public returns (bytes32) {
        bytes32 word = ByteArray.convertRandomToWord(random);
        require(wordsAvailable > 0);
        if (isWordAvailable(word)) {
            word = findLetter(word, 4);
        }
        wordUnavailable[word] = true;
        allocated++;
        return word;
    }

    function isWordAvailable(bytes32 word) internal view returns (bool) {
        return !wordUnavailable[word];
    }

    function findFinalLetter(bytes32 word) internal returns (bytes32) {
        bytes32 prefix = ByteArray.slice(word, 4);
        assert(lettersUnavailableAfterPrefix[prefix] < 26);
        uint8 iterations = 0;
        uint8 index = 4;
        do {
            assert(iterations++ <= 26);
            word = ByteArray.setIndex(
                word,
                index,
                97 + ((ByteArray.getIndex(word, index) - 97 + 15) % 26)
            );
        } while (!isWordAvailable(word));

        lettersUnavailableAfterPrefix[prefix]++;
        return word;
    }

    function findLetter(bytes32 word, uint8 index) internal returns (bytes32) {
        assert(index > 0 && index < 5);
        if (isWordAvailable(word)) return word;
        // prefix does not include the index
        bytes32 prefix = ByteArray.slice(word, index);
        if (lettersUnavailableAfterPrefix[prefix] < 26) {
            if (index == 4) {
                return findFinalLetter(word);
            }
            uint8 iterations = 0;
            do {
                assert(iterations++ <= 26);
                word = ByteArray.setIndex(
                    word,
                    index,
                    ByteArray.getIndex(word, index)
                );
            } while (
                // keep doing while there are no letters available
                lettersUnavailableAfterPrefix[ByteArray.slice(word, index)] ==
                    26
            );
            // find the next letter
            return findLetter(word, index + 1);
        }
        // there are no words with this prefix, we need to move back
        return findLetter(word, index - 1);
    }
}
