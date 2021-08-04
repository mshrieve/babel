// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

interface IBytes32Requester {
    function fulfillRandomBytes32(bytes32 _requestId, bytes32 _randomBytes32)
        external;
}
