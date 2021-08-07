// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import './Babel.sol';
import './Words.sol';
import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';

contract Vault is IERC721Receiver {
    // Vault stores words and allows them to be exchanged for babel tokens
    Babel immutable babel;
    Words immutable words;
    bytes4 ERC721ReceiverSelector =
        bytes4(keccak256('onERC721Received(address,address,uint256,bytes)'));
    mapping(address => uint256) public unclaimedWords;

    uint256 constant wordsPerBabel = 2;

    event RedeemBabel(address indexed _to, uint256 words, uint256 babel);

    constructor(address _babel, address _words) {
        babel = Babel(_babel);
        words = Words(_words);
    }

    function redeemBabel() public {
        uint256 unclaimed = unclaimedWords[msg.sender];
        require(unclaimed > 0, 'Vault: msg.sender has no unclaimed words');
        uint256 claimable = (unclaimed * 1 ether) / wordsPerBabel;
        unclaimedWords[msg.sender] = 0;

        babel.mint(msg.sender, claimable);
        emit RedeemBabel(msg.sender, unclaimed, claimable);
    }

    function redeemWord(uint256 tokenId) public {
        require(
            words.ownerOf(tokenId) == address(this),
            'Vault: token with tokenId is not in the vault'
        );
        babel.transferFrom(msg.sender, address(this), wordsPerBabel * 10**18);
        words.safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function onERC721Received(
        address,
        address from,
        uint256,
        bytes memory
    ) public override returns (bytes4) {
        require(msg.sender == address(words));

        unclaimedWords[from] += 1;
        console.log(from);
        return ERC721ReceiverSelector;
    }
}
