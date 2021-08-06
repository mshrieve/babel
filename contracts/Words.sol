// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';
import './Libraries/ByteArray.sol';
import './Generator.sol';
import 'hardhat/console.sol';
import './Interfaces/IWords.sol';
import './Interfaces/IBytes32Requester.sol';
import './Interfaces/IBytes32Source.sol';

contract Words is IBytes32Requester, IWords, ERC721, Ownable {
    Generator immutable generator;
    IBytes32Source immutable bytes32Source;

    mapping(bytes32 => address) internal requestToSender;
    mapping(bytes32 => bytes32) public wordToRequest;

    event WordRequest(address to);

    constructor(address _generator, address _random)
        ERC721('Babel Words', 'BWRD')
        Ownable()
    {
        bytes32Source = IBytes32Source(_random);
        generator = Generator(_generator);
    }

    function requestWord(address _to)
        external
        override
        onlyOwner
        returns (bytes32 requestId)
    {
        requestId = bytes32Source.requestRandomBytes32(address(this));
        requestToSender[requestId] = _to;
        emit WordRequest(_to);
    }

    function fulfillRequest(bytes32 _requestId, bytes32 _randomBytes32)
        external
        override
    {
        require(msg.sender == address(bytes32Source));
        bytes32 word = generator.generateWord(_randomBytes32);
        wordToRequest[word] = _requestId;
        _safeMint(requestToSender[_requestId], uint256(word));
    }
}
