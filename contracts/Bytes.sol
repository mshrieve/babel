// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';
import './Interfaces/IBytesSource.sol';
import './Interfaces/IBytesRequester.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Bytes is IBytesSource, VRFConsumerBase, Ownable {
    // Note, the below values have to be configured correctly for VRF requests to work. You can find the respective values for your network in the VRF Contracts page.

    // LINK Token - LINK token address on the corresponding network (Ethereum, Polygon, BSC, etc)
    // VRF Coordinator - address of the Chainlink VRF Coordinator
    // Key Hash - public key against which randomness is generated
    // Fee - fee required to fulfill a VRF request

    // 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
    // 0xa36085F69e2889c224210F603D836748e7dC0088 // LINK Token

    bytes32 internal keyHash;
    uint256 internal fee;

    uint256 public randomResult;
    mapping(bytes32 => address) public requestIdToCallback;
    mapping(address => bool) public whitelist;

    constructor(address _VRFCoordinator, address _LinkToken)
        VRFConsumerBase(_VRFCoordinator, _LinkToken)
        Ownable()
    {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10**18; // 0.1 LINK (Varies by network)
    }

    function whitelistRequester(address _requester) external onlyOwner {
        whitelist[_requester] = true;
    }

    function requestRandomBytes32(address callback)
        external
        override
        returns (bytes32 requestId)
    {
        require(
            LINK.balanceOf(address(this)) >= fee,
            'Not enough LINK - fill contract with faucet'
        );
        requestId = requestRandomness(keyHash, fee);
        requestIdToCallback[requestId] = callback;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        IBytesRequester(requestIdToCallback[requestId]).fulfillRequest(
            requestId,
            bytes32(randomness)
        );
    }
}
