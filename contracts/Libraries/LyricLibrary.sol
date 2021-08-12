// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import 'hardhat/console.sol';

library LyricLibrary {
    function writeWord(
        uint256 _state,
        uint256 _word,
        uint8 _position
    ) internal pure returns (uint256 result) {
        uint8 stateOffset = 14 + _position * 6 + 1;
        uint8 wordOffset = 27;
        require(_position < 3, 'Lyric: invalid position');
        assembly {
            // load free pointer
            let result_ := mload(0x40)
            // increment free pointer
            mstore(0x40, add(result_, 0x20))
            //
            mstore(result_, _state)

            for {
                let i := 0
            } lt(i, 0x5) {
                i := add(i, 1)
            } {
                mstore8(
                    add(result_, add(stateOffset, i)),
                    byte(add(wordOffset, i), _word)
                )
            }

            result := mload(result_)
        }
    }

    function checkBytesForMatch(bytes32 _state, bytes32 _word)
        internal
        pure
        returns (bool result)
    {
        // bytes5 takes the _first_ 5 bytes of the bytes32
        // 27 * 8 = 216
        bytes5 word = bytes5(_word << 216);
        // 32 - 17 = 15
        // 15 * 8 = 120
        if (bytes5(_state << 120) == word) return true;
        // 21 * 8 = 168
        if (bytes5(_state << 168) == word) return true;
        // 27 * 8 = 216
        if (bytes5(_state << 216) == word) return true;
        return false;
    }

    function checkIdForMatch(uint256 _state, uint256 _word)
        internal
        pure
        returns (bool result)
    {
        // uint40 takes the _last_ 5 bytes of the bytes32
        // 27 * 8 = 216
        uint40 word = uint40(_word);
        if (uint40(_state) == word) return true;
        // 6 * 8 = 48
        if (uint40(_state >> 48) == word) return true;
        // 12 * 8 = 96
        if (uint40(_state >> 96) == word) return true;
        return false;
    }
}
