// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '../Libraries/LyricLibrary.sol';

contract LyricLibraryHarness {
    using LyricLibrary for uint256;

    function writeWord(
        uint256 _state,
        uint256 _word,
        uint8 _position
    ) external pure returns (uint256) {
        return _state.writeWord(_word, _position);
    }

    function checkIdForMatch(uint256 _state, uint256 _word)
        external
        pure
        returns (bool)
    {
        return _state.checkIdForMatch(_word);
    }
}
