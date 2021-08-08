// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import './Babel.sol';
import './Words.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';

// babel
// words
// vault

contract Vault is IERC721Receiver {
    // Vault stores words and allows them to be exchanged for babel tokens
    bytes4 constant ERC721ReceiverSelector =
        bytes4(keccak256('onERC721Received(address,address,uint256,bytes)'));

    Babel immutable babel;
    Words immutable words;

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

    // function onTokenTransfer(
    //     address from,
    //     uint256 amount,
    //     bytes calldata
    // ) external override returns (bool success) {
    //     require(msg.sender == address(babel));
    //     // data consists of the word to redeem
    //     uint256 tokenId;
    //     // tokenId is the fifth word in the calldata
    //     assembly {
    //         tokenId := calldataload(0x80)
    //     }
    //     require(
    //         words.ownerOf(tokenId) == address(this),
    //         'Vault: token with tokenId is not in the vault'
    //     );
    //     require(amount == wordsPerBabel * 1 ether);
    //     words.safeTransferFrom(address(this), from, tokenId);
    //     return true;
    // }

    function onERC721Received(
        address,
        address from,
        uint256,
        bytes memory
    ) public override returns (bytes4) {
        require(msg.sender == address(words));

        unclaimedWords[from] += 1;
        return ERC721ReceiverSelector;
    }
}
