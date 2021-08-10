// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '../Interfaces/IBytes32Requester.sol';
import '../Interfaces/IBytes32Source.sol';

contract MockBytes is IBytes32Source {
    uint256 private salt;
    mapping(bytes32 => address) public requestIdToCallback;
    event Bytes32Requested(bytes32 indexed requestId, address indexed callback);

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
        emit Bytes32Requested(requestId, callback);
    }

    function fulfillRandomBytes32(bytes32 _requestId) external {
        IBytes32Requester(requestIdToCallback[_requestId]).fulfillRequest(
            _requestId,
            randomize()
        );
    }
}
