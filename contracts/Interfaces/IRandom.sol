// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IRandom {
    function requestRandomBytes32() external returns (bytes32 requestId);
}
