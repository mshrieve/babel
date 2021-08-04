// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';
import './Libraries/ByteArray.sol';
import './Generator.sol';
import './Interfaces/IRandom.sol';
import './Interfaces/IWords.sol';

contract MockWords is IWords, ERC721 {
    Generator immutable generator;
    IRandom immutable random;

    mapping(bytes32 => address) internal requestToSender;
    mapping(bytes32 => bytes32) public wordToRequest;

    constructor(address _generator, address _random)
        ERC721('Babel Words', 'BWRD')
    {
        random = IRandom(_random);
        generator = Generator(_generator);
    }

    function requestNewRandomWord()
        external
        override
        returns (bytes32 requestId)
    {
        return random.requestRandomBytes32();
    }

    function fulfillRandomBytes32(bytes32 _requestId, bytes32 _randomBytes32)
        external
        override
    {
        (, bytes32 word) = generator.generateWord(_randomBytes32);
        wordToRequest[word] = _requestId;
        _safeMint(requestToSender[_requestId], uint256(word));
    }
}
