// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '../Libraries/ThreeBytes32.sol';

contract ThreeLibHarness {
    using ThreeBytes32 for bytes32;

    function writeWord(
        bytes32 _state,
        bytes32 _word,
        uint8 _position
    ) external pure returns (bytes32) {
        return _state.writeWord(_word, _position);
    }
}
