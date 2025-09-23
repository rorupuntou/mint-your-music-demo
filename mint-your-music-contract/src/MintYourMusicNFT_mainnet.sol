// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MintYourMusicNFT_mainnet is ERC721, Ownable {
    uint256 private _nextTokenId;
    address payable public immutable artistWallet;
    address payable public immutable platformWallet;
    string public baseURI;
    IERC20 public immutable wldToken;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price,
        uint256 artistShare,
        uint256 platformShare
    );

    constructor(
        address payable _artistWallet,
        address payable _platformWallet,
        address _initialOwner,
        address _wldTokenAddress
    ) ERC721("Mint Your Music", "MYM") Ownable(_initialOwner) {
        artistWallet = _artistWallet;
        platformWallet = _platformWallet;
        wldToken = IERC20(_wldTokenAddress);
    }

    function mint(uint256 price, uint8 artistPercentage) public {
        require(price > 0, "El precio debe ser mayor que cero");
        require(artistPercentage <= 100, "El porcentaje no puede exceder 100");

        wldToken.transferFrom(msg.sender, address(this), price);

        uint256 artistShare = (price * artistPercentage) / 100;
        uint256 platformShare = price - artistShare;
        _transferFunds(artistShare, platformShare);

        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(msg.sender, newTokenId);

        emit NFTMinted(
            newTokenId,
            msg.sender,
            price,
            artistShare,
            platformShare
        );
    }
    
    // --- FUNCIÓN 'setBaseURI' AÑADIDA ---
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

    function _transferFunds(uint256 _artistShare, uint256 _platformShare) internal {
        wldToken.transfer(artistWallet, _artistShare);
        if (_platformShare > 0) {
            wldToken.transfer(platformWallet, _platformShare);
        }
    }
}