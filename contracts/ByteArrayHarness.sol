// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import './Libraries/ByteArray.sol';

contract ByteArrayHarness {
    using ByteArray for bytes32;

    function getIndex(bytes32 _byteArray, uint8 _index)
        public
        pure
        returns (uint8)
    {
        return _byteArray.getIndex(_index);
    }

    function setIndex(
        bytes32 _byteArray,
        uint8 _index,
        uint8 _value
    ) public view returns (bytes32) {
        return _byteArray.setIndex(_index, _value);
    }

    function slice(bytes32 byteArray, uint256 index)
        public
        pure
        returns (bytes32)
    {
        return byteArray.slice(index);
    }

    function convertRandomToWord(bytes32 random) public view returns (bytes32) {
        return random.convertRandomToWord();
    }
}
