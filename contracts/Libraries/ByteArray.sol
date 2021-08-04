// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import 'hardhat/console.sol';

library ByteArray {
    uint8 constant asciia = 97;
    uint8 constant wordLength = 5;
    uint8 constant offset = 27;
    uint8 constant alphabetLength = 26;

    // reads a 1 byte letter
    // from a five letter word
    // stored at the least significant digits
    function getIndex(bytes32 _byteArray, uint8 _index)
        internal
        pure
        returns (uint8)
    {
        return uint8(_byteArray[offset + _index]);
        // assembly {
        //     let result_ := mload(0x40)
        //     mstore(0x40, add(result_, 0x20))

        //     mstore(result_, byte(add(_offset, index), byteArray))
        //     result := mload(result_)
        // }
    }

    // sets a 1 byte letter
    // in a five letter word
    // stored at the least significant digits
    function setIndex(
        bytes32 _byteArray,
        uint8 _index,
        uint8 _value
    ) internal view returns (bytes32 result) {
        // assembly {
        //     let result_ := mload(0x40)
        //     mstore(0x40, add(result_, 0x20))
        //     mstore(result_, _byteArray)
        //     mstore8(add(result_, add(offset, _index)), _value)
        //     result := mload(result_)
        // }
        // bytes32 shift = bytes32(bytes1(_value)) >> 4;
        bytes32 newValue = bytes32(bytes1(_value)) >> (216 + 8 * _index);
        bytes32 oldValue = bytes32(_byteArray[offset + _index]) >>
            (216 + 8 * _index);

        console.logBytes32(newValue);
        console.logBytes32(oldValue);
        console.logBytes32(_byteArray);
        console.logBytes32(~oldValue);
        console.logBytes32(_byteArray & ~oldValue);
        result =
            // [a, b, c] =>
            //     [0, _v, 0] | ([a, b, c] & ~[0, b, 0])
            //   = [0, _v, 0] | ([a, b, c] & [1, ~b, 1])
            //   = [0, _v, 0] | [a, 0, c]
            //   = [a, _v, c]
            newValue |
            (_byteArray & ~oldValue);
    }

    // get [0, ..., index-1] from [0, ..., length - 1]
    function slice(bytes32 _byteArray, uint256 _index)
        internal
        pure
        returns (bytes32 result)
    {
        // shift by number of bits
        result = _byteArray >> (8 * (wordLength - _index));
    }

    function convertRandomToWord(bytes32 _random)
        internal
        pure
        returns (bytes32 result)
    {
        for (uint8 i; i < 5; i++) {
            uint8 letter = (uint8(_random[offset + i]) % alphabetLength) +
                asciia;
            result = result | (bytes32(bytes1(letter)) >> (8 * i));
        }
        result = result >> 216;
        // assembly {
        //     let result_ := mload(0x40)
        //     mstore(0x40, add(result_, 0x20))
        //     for {
        //         let i := offset
        //     } lt(i, 0x20) {
        //         i := add(i, 1)
        //     } {
        //         mstore8(
        //             add(result_, i),
        //             add(mod(byte(i, _random), alphabetLength), asciia)
        //         )
        //     }

        //     result := mload(result_)
        // }
    }
}
