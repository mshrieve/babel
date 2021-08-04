// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IWords {
    function requestNewRandomWord(address) external returns (bytes32 requestId);
}
