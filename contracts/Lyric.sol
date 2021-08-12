// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import './Words.sol';
import './Babel.sol';
import './Libraries/LyricLibrary.sol';
import 'hardhat/console.sol';

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
    uint256 public stateId;

    uint256 public roundStart;
    uint256 public highestBid;
    address public highestBidder;
    uint256 public winningLyricId;

    uint256 constant roundLength = 20;

    // contract holds babel on behalf of user
    mapping(address => uint256) public babelBalances;
    // user cannot withdraw if they have bid that block
    mapping(address => uint256) public babelLock;
    mapping(address => uint256) public babelOwed;

    // if lyric has been minted
    mapping(uint256 => bool) public minted;

    event RoundComplete(
        address indexed winner,
        uint256 indexed lyric,
        uint256 indexed bid
    );
    event LyricMinted(address indexed to, uint256 indexed lyric);

    constructor(address _words, address _babel)
        ERC721('babel three words', 'BABEL_THREE')
        Ownable()
    {
        // after the first round, this address will receive the 0 lyric ;)
        highestBidder = msg.sender;
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

    function mintLyric(
        address to,
        uint256 lyricId,
        uint256 wordId
    ) internal {
        // set author
        author[lyricId] = msg.sender;
        weight[wordId]++;
        //
        minted[lyricId] = true;
        // mint sender nft of the lyric
        _safeMint(to, lyricId);
        // emit event
        emit LyricMinted(to, lyricId);
    }

    function redeemBable() external {
        // highest bidder cant redeem until round is complete
        // and their balance is adjusted
        require(highestBidder != msg.sender);
        babel.transfer(msg.sender, babelBalances[msg.sender]);
    }

    function completeRound() public {
        author[winningLyricId] = highestBidder;
        emit RoundComplete(highestBidder, winningLyricId, highestBid);
        _safeMint(highestBidder, winningLyricId);
        // decrease balances of winner
        babelBalances[highestBidder] -= highestBid;
        highestBidder = address(0);
    }

    function bidNewLyric(
        uint256 _wordId,
        uint8 _position,
        uint256 bid
    ) external {
        // require either first bid of the block,
        // or higher bid than the previous bid (in this block)
        require(
            block.number > roundStart + roundLength || bid > highestBid,
            'Lyric: bid is not higher than highest active bid'
        );
        // if the first bid of the round
        if (block.number > roundStart + roundLength) {
            // mint the last winner
            // every active round has an active bid,
            // except for the first round
            completeRound();
            // first bid of the round is the current block
            roundStart = block.number;
            // require first bid is positive
            require(bid > 0);
        }

        // check for valid position
        require(_position < 3, 'Three: invalid position');
        // check sender owns word
        require(
            words.ownerOf(_wordId) == msg.sender,
            "Three: msg.sender doesn't own word"
        );

        // check that word is not in current lyric
        require(
            LyricLibrary.checkIdForMatch(stateId, _wordId) == false,
            'Three: word already in lyric'
        );

        stateId = LyricLibrary.writeWord(stateId, _wordId, _position);
        require(minted[stateId] == false, 'Three: lyric already minted'); // check if lyric has already been minted

        highestBidder = msg.sender;
        highestBid = bid;
        winningLyricId = stateId;

        // transfer babel from sender if needed
        if (bid > babelBalances[msg.sender]) {
            // transfer the amount owed
            uint256 owed = bid - babelBalances[msg.sender];
            babel.transferFrom(msg.sender, address(this), owed);
            babelBalances[msg.sender] += owed;
        }
        // else do nothing, user has enough in balances
    }
}
