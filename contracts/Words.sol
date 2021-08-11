// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';
import './Libraries/ByteArray.sol';
import './Rotor.sol';
import './Babel.sol';
import './Interfaces/IBytesRequester.sol';
import './Interfaces/IBytesSource.sol';

contract Words is IBytesRequester, ERC721Enumerable, Ownable {
    Rotor immutable rotor;
    IBytesSource immutable bytesSource;
    Babel immutable babel;

    mapping(bytes32 => address) internal requestToSender;
    mapping(bytes32 => bytes32) public wordToRequest;
    mapping(uint256 => uint256) public indexToTokenId;
    mapping(address => bool) internal pendingRequest;

    event WordRequest(address indexed to, bytes32 indexed requestId);

    constructor(address _bytes, address _babel)
        ERC721('Babel Words', 'BWRD')
        Ownable()
    {
        bytesSource = IBytesSource(_bytes);
        rotor = new Rotor();
        babel = Babel(_babel);
    }

    function tokenURI(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        return new string(tokenId);
    }

    function requestWord() external returns (bool) {
        bytes32 requestId = bytesSource.requestRandomBytes32(address(this));
        requestToSender[requestId] = msg.sender;
        // transfer 1 babel coin
        babel.transferFrom(msg.sender, address(this), 1 ether);
        emit WordRequest(msg.sender, requestId);
        return true;
    }

    function fulfillRequest(bytes32 _requestId, bytes32 _randomBytes32)
        external
        override
    {
        require(msg.sender == address(bytesSource));

        bytes32 word = rotor.generateWord(_randomBytes32);
        address to = requestToSender[_requestId];
        uint256 tokenId = uint256(word);

        wordToRequest[word] = _requestId;
        pendingRequest[to] = false;
        indexToTokenId[totalSupply()] = tokenId;

        _safeMint(to, tokenId);
    }

    function mintWord(address _to, uint256 _tokenId) external onlyOwner {
        _safeMint(_to, _tokenId);
    }
}
