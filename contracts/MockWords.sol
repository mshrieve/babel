// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';
import './Libraries/ByteArray.sol';
import './Generator.sol';

contract Words is ERC721 {
    Generator immutable generator;
    uint256 private salt;

    mapping(bytes32 => address) internal requestToSender;

    constructor(address _generator) ERC721('Babel Words', 'BWRD') {
        generator = Generator(_generator);
    }

    function randomize() internal returns (bytes32) {
        salt++;
        return keccak256(abi.encodePacked(block.timestamp, salt));
    }

    function requestNewRandomWord() public returns (bytes32) {
        salt++;
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, salt));
        requestToSender[requestId] = msg.sender;
        fulfillRandomness(requestId, randomize());
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        uint256 generator.generateWord(randomNumber);
        _safeMint(requestToSender[requestId], newId);
    }
}
