// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '../Interfaces/IBytesRequester.sol';
import '../Interfaces/IBytesSource.sol';

contract MockBytes is IBytesSource {
    uint256 private salt;
    mapping(bytes32 => address) public requestIdToCallback;
    event BytesRequested(bytes32 indexed requestId, address indexed callback);

    constructor() {}

    function randomize() internal returns (bytes32) {
        salt++;
        return keccak256(abi.encodePacked(block.timestamp, salt));
    }

    function requestRandomBytes32(address callback)
        external
        override
        returns (bytes32 requestId)
    {
        requestId = keccak256(abi.encodePacked(block.timestamp, salt));
        requestIdToCallback[requestId] = callback;
        emit BytesRequested(requestId, callback);
    }

    function fulfillRandomBytes32(bytes32 _requestId) external {
        IBytesRequester(requestIdToCallback[_requestId]).fulfillRequest(
            _requestId,
            randomize()
        );
    }
}
