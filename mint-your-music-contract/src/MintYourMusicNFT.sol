// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Import ERC20 interface

contract MintYourMusicNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    address public immutable artistWallet;
    address public immutable platformWallet;
    IERC20 public immutable wldToken; // WLD token contract
    string public baseURI;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price,
        uint256 artistShare,
        uint256 platformShare
    );

    constructor(
        address _artistWallet,
        address _platformWallet,
        address _wldTokenAddress, // WLD token address on Mainnet
        address _initialOwner
    ) ERC721("Mint Your Music: Genesis", "MYMG") Ownable(_initialOwner) {
        artistWallet = _artistWallet;
        platformWallet = _platformWallet;
        wldToken = IERC20(_wldTokenAddress);
    }

    // Updated mint function to accept WLD
    function mint(uint256 _price, uint8 _artistPercentage) public {
        require(_price > 0, "Price must be greater than zero");
        require(_artistPercentage <= 100, "Percentage cannot exceed 100");

        // 1. Transfer WLD from the user to this contract
        wldToken.transferFrom(msg.sender, address(this), _price);

        // 2. Calculate profit sharing
        uint256 artistShare = (_price * _artistPercentage) / 100;
        uint256 platformShare = _price - artistShare;

        // 3. Distribute the WLD tokens
        wldToken.transfer(artistWallet, artistShare);
        if (platformShare > 0) {
            wldToken.transfer(platformWallet, platformShare);
        }

        // 4. Mint the NFT
        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(msg.sender, newTokenId);

        emit NFTMinted(
            newTokenId,
            msg.sender,
            _price,
            artistShare,
            platformShare
        );
    }
    
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}