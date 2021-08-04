// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import './Libraries/ByteArray.sol';

contract Words is ERC721 {
    constructor() ERC721('words', 'WRD') {}

    mapping(bytes32 => uint8) public lettersUnavailableAfterPrefix;
    mapping(bytes32 => bool) public wordUnavailable;
    mapping(address => bytes32) public words;
    uint256 public wordsAvailable = 26**5;

    event WordAllocated(address indexed _owner, bytes32 indexed _word);
    event CollisionDetected(
        address indexed _owner,
        bytes32 indexed _word,
        uint8 _level
    );

    uint256 public collisions;
    uint256 public allocated;
    uint256 private salt;

    function getRandom() public returns (bytes32) {
        salt++;
        return keccak256(abi.encodePacked(block.timestamp, salt));
    }

    // function getWord(address owner, uint256 index)
    //     public
    //     view
    //     returns (uint8[] memory)
    // {
    //     return words[owner][index];
    // }

    function getWord(bytes32 random) public {
        bytes32 word = ByteArray.convertRandomToWord(random);

        if (isWordAvailable(word, 0)) {
            word = findLetter(word, 4);
        }
        wordUnavailable[word] = true;
        allocated++;
        super._safeMint(msg.sender, uint256(word));
    }

    function isWordAvailable(bytes32 word, uint8 level)
        internal
        returns (bool result)
    {
        result = !wordUnavailable[word];
        if (!result) {
            collisions++;
            emit CollisionDetected(msg.sender, word, level);
        }
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
        } while (!isWordAvailable(word, 5));

        lettersUnavailableAfterPrefix[prefix]++;
        return word;
    }

    function findLetter(bytes32 word, uint8 index) internal returns (bytes32) {
        assert(index >= 0 && index < 5);
        if (isWordAvailable(word, index)) return word;
        // prefix does NOT include the index
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

        // then we start looking for a free next letter.
    }

    function getZero() public pure returns (uint256) {
        return 0;
    }
}
