/*  
* Arguments Descriptions:
* nftContract - ex: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
* tokenId - numeric value containing information about the token (name, description, etc.) 
*           created from the following code
  //   let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
  //   let transaction = await contract.createToken(url)
  //   // url is the URL of the image 
  //   let tx = await transaction.wait()
  //   let event = tx.events[0]
  //   let value = event.args[2]
  //   let tokenId = value.toNumber()
* price - numeric value create from the following code
  //   const price = ethers.utils.parseUnits(formTextField.price, 'ether')
* msg.value - numeric value fetched using the getListingPrice() function
*/

/*
* Variables Description:
* itemId - index number of a token in idToItem
 */

// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
 
import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsMarket;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsSoldMarket;

    address payable owner;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    mapping(uint256 => Item) private idToItem;

    struct Item {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool onMarket;
        bool sold;
    }

    event MintItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool onMarket,
        bool sold
    );

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint 256) {
        return listingPrice;
    }

    /* Mints the token */
    function createMintItem(
        address nftContract,
        uint256 tokenId
    ) public payable nonReentrant {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            0,
            false,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MintItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            0,
            false,
            false
        );
    }

    /* Lists the token for sale in the market */
    function createMarketItem(
        uint256 itemId,
        uint256 tokenId,
        uint256 price
    ) public nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _itemsMarket.increment();
        if (idToItem[itemId].sold == true) {
            _itemsSoldMarket.increment();
        }

        idToItem[itemId].tokenId = tokenId;
        idToItem[itemId].price = price;
        idToItem[itemId].onMarket = true;
    }

    function createUnmarketItem(
        uint256 itemId
    ) public nonReentrant {

        _itemsMarket.decrement();
        if (idToItem[itemId].sold == true) {
            _itemsSoldMarket.decrement();
        }

        idToItem[itemId].price = 0;
        idToItem[itemId].onMarket = false;
    }

    function createModifyMintedItem(
        uint256 itemId,
        uint256 tokenId
    ) {
        idToItem[itemId].tokenId = tokenId;
    }

    function createModifyMarketItem(
        uint256 itemId,
        uint256 tokenId,
        uint256 price
    ) {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        idToItem[itemId].tokenId = tokenId;
        idToItem[itemId].price = price;
    }

    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint price = idToItem[itemId].price;
        uint tokenId = idToItem[itemId].tokenId;
        bool onMarket = idToItem[itemId].onMarket;
        require(msg.value == price, "Please submit the asking value in order to complete the purchase")
        require(onMarket == true, "The item is not on the market")
        
        _itemsMarket.decrement();
        _itemsSold.increment();
        if (idToItem[itemId].sold == true) {
            _itemsSoldMarket.decrement();
        }

        idToItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToItem[itemId].owner = payable(msg.sender);
        idToItem[itemId].sold = true;
        idToItem[itemId].onMarket = false;
        payable(owner).transfer(listingPrice);
    }

    /* Returns all unsold (items that have never been sold before) market items (items listed in the market) */
    function fetchUnsoldMarketItems() public view returns (MarketItem[] memory) {
        uint itemMarketCount = _itemsMarket.current();
        uint itemSoldMarketCount = _itemsSoldMarket.current();
        uint itemUnsoldMarketCount = itemMarketCount - itemSoldMarketCount;
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](itemUnsoldMarketCount);
        for (uint i = 0; i < itemUnsoldMarketCount; i++) {
            if (idToItem[i + 1].onMarket == true && idToItem[i + 1].owner == address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns all market items (items listed in the market) */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemMarketCount = _itemsMarket.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](itemMarketCount);
        for (uint i = 0; i < itemMarketCount; i++) {
            if (idToItem[i + 1].onMarket == true) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns the item for the given itemId */
    function fetchSpecificItem(
        uint256 itemId
    ) public view returns (MarketItem memory) {
        MarketItem storage item = idToItem[itemId];
        return item;
    }

    /* Returns the items for the given array of itemIds */
    function fetchSpecificItems(
        uint256[] itemIds
    ) public view returns (MarketItem[] memory){
        uint itemsLength = itemIds.length;
        MarketItem[] memory items = new MarketItem[](itemsLength);
        for (int i = 0; i < itemsLength; i++) {
            uint itemId = itemIds[i];
            items[i] = idToItem[itemId];
        }
        return items;
    }

    // function fetchMyNFTS() {}

    // function fetchItemsCreate() {}
}