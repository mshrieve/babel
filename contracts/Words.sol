// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';
import './Libraries/ByteArray.sol';
import './Generator.sol';
import './Token.sol';
import './Interfaces/IWords.sol';
import './Interfaces/IBytes32Requester.sol';
import './Interfaces/IBytes32Source.sol';

contract Words is IBytes32Requester, IWords, ERC721Enumerable, Ownable {
    Generator immutable generator;
    IBytes32Source immutable bytes32Source;
    Token immutable babel;

    mapping(bytes32 => address) internal requestToSender;
    mapping(bytes32 => bytes32) public wordToRequest;
    mapping(uint256 => uint256) public indexToTokenId;
    mapping(address => bool) internal pendingRequest;

    event WordRequest(address indexed to, bytes32 indexed requestId);

    uint256 index;

    constructor(
        address _generator,
        address _random,
        address _babel
    ) ERC721('Babel Words', 'BWRD') Ownable() {
        bytes32Source = IBytes32Source(_random);
        generator = Generator(_generator);
        babel = Token(_babel);
    }

    function requestWord(address _to)
        external
        override
        onlyOwner
        returns (bytes32 requestId)
    {
        // must not have a pending request
        require(pendingRequest[msg.sender] = false);
        // transfer 1 babel coin
        babel.transferFrom(msg.sender, address(this), 1);
        requestId = bytes32Source.requestRandomBytes32(address(this));
        requestToSender[requestId] = _to;
        pendingRequest[_to] = true;
        emit WordRequest(_to, requestId);
    }

    // function getPrice(uint256 quantity) returns uint256 {
    //     if (blockSupplyLastReset != block.number) {
    //         blockSupply = 0;
    //         blockSupplyLast reset = block.number;
    //     }
    // }
    function tokenURI(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        return new string(tokenId);
    }

    function fulfillRequest(bytes32 _requestId, bytes32 _randomBytes32)
        external
        override
    {
        require(msg.sender == address(bytes32Source));
        bytes32 word = generator.generateWord(_randomBytes32);
        wordToRequest[word] = _requestId;
        address to = requestToSender[_requestId];
        pendingRequest[to] = false;
        _safeMint(to, uint256(word));
    }
}
