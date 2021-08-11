// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import './Words.sol';
import './Babel.sol';
import './Libraries/ThreeBytes32.sol';

// babel
// three
// words

// lyric
// verse
// idiom
// lingo

contract Lyric is Ownable, ERC721Enumerable {
    Words immutable words;
    Babel immutable babel;

    // author of poem
    mapping(uint256 => address) public author;
    // how many times a word has been used
    mapping(uint256 => uint256) public weight;
    // last minted lyric
    bytes32 public state;
    uint256 constant babelPerWord = 3;

    // if lyric has been minted
    mapping(uint256 => bool) public minted;

    event LyricMinted(
        uint256 indexed state,
        uint256 indexed tokenId,
        address indexed to,
        uint8 position
    );

    constructor(address _words, address _babel)
        ERC721('babel three words', 'BABEL_THREE')
        Ownable()
    {
        words = Words(_words);
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

    function replaceWord(uint256 _wordTokenId, uint8 _position) external {
        // check for valid position
        require(_position < 3, 'Three: invalid position');
        // check sender owns word
        require(
            words.ownerOf(_wordTokenId) == msg.sender,
            "Three: msg.sender doesn't own word"
        );

        bytes32 wordBytes = bytes32(_wordTokenId);
        state = ThreeBytes32.writeWord(state, wordBytes, _position);
        uint256 stateTokenId = uint256(state);
        // check if lyric has already been minted
        require(minted[stateTokenId] == false, 'Three: lyric already minted');
        // check that word is not in current lyric
        require(
            ThreeBytes32.checkForMatch(state, wordBytes) == false,
            'Three: word already in lyric'
        );
        // set author
        author[stateTokenId] = msg.sender;
        //
        minted[stateTokenId] = true;

        // cost = 3 + (# of times word has been used in a lyric)
        uint256 cost = 3 + weight[_wordTokenId];
        // increment weight of word
        weight[_wordTokenId]++;
        // transfer babel from sender
        babel.transferFrom(msg.sender, address(this), cost);
        // mint sender nft of the lyric
        _safeMint(msg.sender, stateTokenId);
        // emit event
        emit LyricMinted(stateTokenId, _wordTokenId, msg.sender, _position);
    }
}
