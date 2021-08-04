// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';
import './Libraries/ByteArray.sol';
import './Generator.sol';
import 'hardhat/console.sol';
import './Interfaces/IWords.sol';
import './Interfaces/IBytes32Requester.sol';
import './Interfaces/IBytes32Source.sol';

contract Words is IBytes32Requester, IWords, ERC721 {
    Generator immutable generator;
    IBytes32Source immutable random;

    mapping(bytes32 => address) internal requestToSender;
    mapping(bytes32 => bytes32) public wordToRequest;

    constructor(address _generator, address _random)
        ERC721('Babel Words', 'BWRD')
    {
        random = IBytes32Source(_random);
        generator = Generator(_generator);
    }

    function requestNewRandomWord(address _to)
        external
        override
        returns (bytes32 requestId)
    {
        requestId = random.requestRandomBytes32(address(this));
        requestToSender[requestId] = _to;
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
