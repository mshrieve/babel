// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MockRandom {
    // Note, the below values have to be configured correctly for VRF requests to work. You can find the respective values for your network in the VRF Contracts page.

    // LINK Token - LINK token address on the corresponding network (Ethereum, Polygon, BSC, etc)
    // VRF Coordinator - address of the Chainlink VRF Coordinator
    // Key Hash - public key against which randomness is generated
    // Fee - fee required to fulfill a VRF request

    bytes32 internal keyHash;
    uint256 internal fee;

    uint256 public randomResult;
    uint256 private salt;

    constructor() {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10**18; // 0.1 LINK (Varies by network)
    }

    function randomize() internal returns (bytes32) {
        salt++;
        return keccak256(abi.encodePacked(block.timestamp, salt));
    }

    function getRandom() public returns (bytes32 requestId) {
        fulfillRandomness(requestId, randomize());
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        randomResult = randomness;
    }
}
