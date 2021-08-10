// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IBytesSource {
    function requestRandomBytes32(address) external returns (bytes32 requestId);
}
