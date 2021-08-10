// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

interface IBytesRequester {
    function fulfillRequest(bytes32 _requestId, bytes32 _randomBytes32)
        external;
}
