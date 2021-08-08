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

contract Three is Ownable, ERC721Enumerable {
    Words immutable words;
    Babel immutable babel;
    event PoemMinted(
        uint256 indexed state,
        uint256 indexed tokenId,
        address indexed to,
        uint8 position
    );
    mapping(uint256 => address) public author;

    bytes32 public state;
    uint256 constant babelPerWord = 3;

    // starts at 1!
    mapping(uint256 => uint256) public stateToIndex;

    constructor(address _words, address _babel)
        ERC721('babel three words', 'BABEL_THREE')
        Ownable()
    {
        words = Words(_words);
        babel = Babel(_babel);
    }

    function replaceWord(uint256 _wordTokenId, uint8 _position) external {
        require(_position < 3);
        require(words.ownerOf(_wordTokenId) == msg.sender);

        // _wordTokenId cannot match any of the token ids

        state = ThreeBytes32.writeWord(state, bytes32(_wordTokenId), _position);
        uint256 stateTokenId = uint256(state);
        require(stateToIndex[stateTokenId] == 0, 'Lyric already minted');
        require(
            ThreeBytes32.checkForMatch(state, bytes32(_wordTokenId)) == false,
            'Word already in lyric'
        );
        author[stateTokenId] = msg.sender;
        stateToIndex[stateTokenId] = totalSupply() + 1;

        babel.transferFrom(msg.sender, address(this), 3);
        _safeMint(msg.sender, stateTokenId);
        emit PoemMinted(stateTokenId, _wordTokenId, msg.sender, _position);
    }

    // function onTokenTransfer(
    //     address from,
    //     uint256 amount,
    //     bytes calldata
    // ) external override returns (bool success) {
    //     require(msg.sender == address(babel));
    //     // data consists of the word to redeem
    //     uint256 tokenId;
    //     uint256 position;
    //     // tokenId is the fifth word in the calldata
    //     assembly {
    //         tokenId := calldataload(0x80)
    //     }
    //     // position is the sixth word in the calldata
    //     assembly {
    //         position := calldataload(0xa0)
    //     }
    //     require(
    //         words.ownerOf(tokenId) == address(this),
    //         'Vault: token with tokenId is not in the vault'
    //     );
    //     require(amount == babelPerWord * 1 ether);
    //     words.safeTransferFrom(address(this), from, tokenId);
    //     return true;
}
