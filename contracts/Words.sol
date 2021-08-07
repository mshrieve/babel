// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';
import './Libraries/ByteArray.sol';
import './Generator.sol';
import './Babel.sol';
import './Interfaces/IWords.sol';
import './Interfaces/IBytes32Requester.sol';
import './Interfaces/IBytes32Source.sol';

contract Words is IBytes32Requester, IWords, ERC721Enumerable, Ownable {
    Generator immutable generator;
    IBytes32Source immutable bytes32Source;
    Babel immutable babel;

    mapping(bytes32 => address) internal requestToSender;
    mapping(bytes32 => bytes32) public wordToRequest;
    mapping(uint256 => uint256) public indexToTokenId;
    mapping(address => bool) internal pendingRequest;

    event WordRequest(address indexed to, bytes32 indexed requestId);

    constructor(
        address _generator,
        address _random,
        address _babel
    ) ERC721('Babel Words', 'BWRD') Ownable() {
        bytes32Source = IBytes32Source(_random);
        generator = Generator(_generator);
        babel = Babel(_babel);
    }

    function requestWord(address _to)
        external
        override
        onlyOwner
        returns (bytes32 requestId)
    {
        // must not have a pending request
        require(
            !pendingRequest[msg.sender],
            'Words: msg.sender has a pending request'
        );
        // transfer 1 babel coin
        babel.transferFrom(msg.sender, address(this), 1 ether);
        requestId = bytes32Source.requestRandomBytes32(address(this));
        requestToSender[requestId] = _to;
        pendingRequest[_to] = true;
        emit WordRequest(_to, requestId);
    }

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
        address to = requestToSender[_requestId];
        uint256 tokenId = uint256(word);

        wordToRequest[word] = _requestId;
        pendingRequest[to] = false;
        indexToTokenId[totalSupply()] = tokenId;

        _safeMint(to, tokenId);
    }
}
