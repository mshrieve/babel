// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';
import './MockWords.sol';
import './Interfaces/IRandom.sol';

contract Random is IRandom, VRFConsumerBase {
    // Note, the below values have to be configured correctly for VRF requests to work. You can find the respective values for your network in the VRF Contracts page.

    // LINK Token - LINK token address on the corresponding network (Ethereum, Polygon, BSC, etc)
    // VRF Coordinator - address of the Chainlink VRF Coordinator
    // Key Hash - public key against which randomness is generated
    // Fee - fee required to fulfill a VRF request

    bytes32 internal keyHash;
    uint256 internal fee;

    uint256 public randomResult;
    MockWords public words;

    constructor(address _words)
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088 // LINK Token
        )
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10**18; // 0.1 LINK (Varies by network)
        words = MockWords(_words);
    }

    function requestRandomBytes32()
        public
        override
        returns (bytes32 requestId)
    {
        require(
            LINK.balanceOf(address(this)) >= fee,
            'Not enough LINK - fill contract with faucet'
        );
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32, uint256 randomness) internal override {
        randomResult = randomness;
    }
}
