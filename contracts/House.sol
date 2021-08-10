// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import './Words.sol';
import './Babel.sol';

// auction house

contract House is IERC721Receiver {
    bytes4 constant ERC721ReceiverSelector =
        bytes4(keccak256('onERC721Received(address,address,uint256,bytes)'));

    Words immutable words;
    Babel immutable babel;

    uint256 public auctionsActive;
    // starts at 1
    mapping(uint256 => uint256) public indexToTokenId;
    mapping(uint256 => uint256) public tokenIdToIndex;

    mapping(uint256 => uint256) public reserves;
    mapping(uint256 => address) public owners;
    mapping(uint256 => uint256) public bid;
    mapping(uint256 => address) public bidder;
    mapping(uint256 => uint256) public lastBid;
    mapping(address => uint256) public claimable;

    // how many blocks to wait after last bid for auction to end
    uint256 constant wait = 10;

    constructor(address _words, address _babel) {
        words = Words(_words);
        babel = Babel(_babel);
    }

    function listWord(uint256 _wordTokenId, uint256 _reserve) external {
        words.safeTransferFrom(
            msg.sender,
            address(this),
            _wordTokenId,
            abi.encode(_reserve)
        );
    }

    function placeBid(uint256 _wordTokenId, uint256 _bid) external {
        require(words.ownerOf(_wordTokenId) == address(this));
        uint256 index = tokenIdToIndex[_wordTokenId];

        if (index == 0) {
            require(
                _bid > reserves[_wordTokenId],
                'House: bid must be higher than the reserve price.'
            );
            // there is no active auction for this word
            index = auctionsActive++ + 1;
            tokenIdToIndex[_wordTokenId] = index;
            indexToTokenId[index] = _wordTokenId;
        } else {
            // there is an active auction
            require(
                _bid > bid[_wordTokenId],
                'House: bid must be higher than current bid.'
            );
            require(
                block.number < lastBid[_wordTokenId] + wait,
                'House: auction has ended'
            );
            // release previous bid to bidder
            claimable[bidder[_wordTokenId]] += bid[_wordTokenId];

            bid[_wordTokenId] = _bid;
            bidder[_wordTokenId] = msg.sender;
            lastBid[_wordTokenId] = block.number;
        }
        babel.transferFrom(msg.sender, address(this), _bid);
    }

    function endAuction(uint256 _wordTokenId) external {
        require(words.ownerOf(_wordTokenId) == address(this));
        uint256 index = tokenIdToIndex[_wordTokenId];
        require(index > 0, 'House: word is not in active auction');
        require(
            block.number > lastBid[_wordTokenId] + wait,
            'House: auction is still accepting bids'
        );
        removeActiveAuction(index);
        words.safeTransferFrom(
            address(this),
            bidder[_wordTokenId],
            _wordTokenId
        );
        claimable[owners[_wordTokenId]] += bid[_wordTokenId];
    }

    function claimBabel() external {
        uint256 claim = claimable[msg.sender];
        require(claim > 0, 'House: msg.sender has no babel to claim');
        babel.transfer(msg.sender, claim);
    }

    function removeActiveAuction(uint256 index) internal {
        uint256 tokenIdAtIndex = indexToTokenId[index];
        if (index < auctionsActive + 1) {
            indexToTokenId[index] = indexToTokenId[auctionsActive + 1];
            indexToTokenId[auctionsActive + 1] = tokenIdAtIndex;
        }
        tokenIdToIndex[tokenIdAtIndex] = 0;
        auctionsActive--;
    }

    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes memory _data
    ) external override returns (bytes4) {
        require(msg.sender == address(words), 'House: can only accept Words');
        require(
            _operator == address(this) || _operator == _from,
            'House: operator is invalid'
        );
        uint256 reserve;
        assembly {
            reserve := mload(add(_data, 0x20))
        }
        require(reserve > 2 ether, 'House: reserve too low');
        owners[_tokenId] = _from;
        reserves[_tokenId] = reserve;

        return ERC721ReceiverSelector;
    }
}
