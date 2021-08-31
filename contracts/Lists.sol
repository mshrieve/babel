// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import './Libraries/ListsLibrary.sol';
import './Words.sol';
import 'hardhat/console.sol';

contract Lists is ERC721Enumerable, IERC721Receiver, Ownable {
    Words immutable words;

    mapping(uint256 => bytes32) internal listContents;

    constructor(address _words) ERC721('Babel Lists', 'BLST') Ownable() {
        words = Words(_words);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return string(abi.encode(listContents[tokenId]));
    }

    // function mintList() external returns (bool) {
    //     _safeMint(msg.sender, totalSupply());
    //     return true;
    // }

    function mintList(bytes32 _word, uint8 _position) external returns (bool) {
        uint256 tokenId = totalSupply();
        listContents[tokenId] = ListsLibrary.writeWord(0, _word, _position);
        _safeMint(msg.sender, totalSupply());
        return true;
    }

    function modifyList(
        uint256 _tokenId,
        bytes32 _word,
        uint8 _position
    ) external returns (bool) {
        // sender must own the list
        require(ownerOf(_tokenId) == msg.sender);
        // sender must own the word, transfer to Lists
        words.safeTransferFrom(msg.sender, address(this), uint256(_word));
        // update the list contents
        listContents[_tokenId] = ListsLibrary.writeWord(
            listContents[_tokenId],
            _word,
            _position
        );
        console.logBytes32(listContents[_tokenId]);
        return true;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
