// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import 'hardhat/console.sol';

library ListsLibrary {
    function writeWord(
        bytes32 _list,
        bytes32 _word,
        uint8 _position
    ) internal pure returns (bytes32 result) {
        // store up to 6 words in a single bytes32
        // the word is in the least significant 5 bytes
        require(_position < 6, 'Lists: invalid position');
        // use a mask
        bytes5 mask = 0xffffffffff;
        uint8 offset = 8 * (27 - _position * 5);
        result = (_list & ~(mask << offset)) | (_word << offset);
    }

    function hasWord(
}
