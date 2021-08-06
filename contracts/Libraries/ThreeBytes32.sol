// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

library ThreeBytes32 {
    function writeWord(
        bytes32 _state,
        bytes32 _word,
        uint8 _position
    ) internal pure returns (bytes32 result) {
        uint8 stateOffset = 14 + _position * 6 + 1;
        uint8 wordOffset = 27;
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
}
