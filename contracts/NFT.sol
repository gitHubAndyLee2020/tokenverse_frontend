// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Metaverse", "METT") {
        contractAddress = marketplaceAddress;
    }

    mapping(uint256 => bool) internal burnedMarketItem;
    mapping(uint256 => address) internal allowance;
    mapping(uint256 => bool) internal metadataFrozenMarketItem;

    event ItemChangeTokenURI (
        uint256 indexed _tokenId,
        string _tokenURI
    );

    event ItemBurned (
        uint256 indexed _tokenId
    );

    event PermanentURI(
        string _value,
        uint256 indexed _id
    );

    /* Returns if the item is burned */
    function getIsBurned(
        uint256 itemId
    ) public view returns (bool) {
        bool isBurned = burnedMarketItem[itemId];
        return isBurned;
    }

    /* Creates a single token (stored in Ethereum back-end) */
    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        allowance[newItemId] = msg.sender;
        return newItemId;
    }

    /* Creates multiple tokens (stored in Ethereum back-end) */
    function createTokens(string[] memory tokenURIs) public returns (uint256[] memory) {
        uint256 tokenURILength = tokenURIs.length;
        uint256[] memory newItemIds = new uint256[](tokenURILength);
        for (uint256 i = 0; i < tokenURILength; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            string memory tokenURI = tokenURIs[i];
            _mint(msg.sender, newItemId);
            _setTokenURI(newItemId, tokenURI);
            setApprovalForAll(contractAddress, true);
            allowance[newItemId] = msg.sender;
            newItemIds[i] = newItemId;
        }
        return newItemIds;
    }

    /* Changes the TokenURI of the token */
    function changeTokenURI(uint256 tokenId, string memory newTokenURI) public {
        // This function will be modified to support frozen tokens through decentralized metadata storage
        // The function currently validates using a map
        address owner = ownerOf(tokenId);
        bool isCurrentlyMetadataFrozen = metadataFrozenMarketItem[tokenId];
        require(owner == msg.sender || allowance[tokenId] == msg.sender, 'The owner must be the message sender or the message sender must be approved');
        require(isCurrentlyMetadataFrozen == false, 'The metadata of the token is frozen');
        _setTokenURI(tokenId, newTokenURI);
        emit ItemChangeTokenURI(
            tokenId,
            newTokenURI
        );
    }

    function freezeTokenURI(uint256 tokenId, string memory tokenURI) public {
        metadataFrozenMarketItem[tokenId] = true;
        emit PermanentURI(
            tokenURI,
            tokenId
        );
    }


    /* Set allowance at tokenId to null address */
    function changeAllowanceToNullAddress(uint256 tokenId) public {
        allowance[tokenId] = address(0);
    }

    /* Burns (destories) the token */
    function burnToken(
        uint256 tokenId
    ) public {
        address owner = ownerOf(tokenId);
        require(owner == msg.sender || allowance[tokenId] == msg.sender, 'The owner must be the message sender or the message sender must be approved');
        _burn(tokenId);
        burnedMarketItem[tokenId] = true;

        emit ItemBurned(
          tokenId
        );
    }
}