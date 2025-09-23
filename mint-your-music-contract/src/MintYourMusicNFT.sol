// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintYourMusicNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    address payable public immutable artistWallet;
    address payable public immutable platformWallet;
    string public baseURI;

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
        address _initialOwner
    ) ERC721("Mint Your Music: Genesis", "MYMG") Ownable(_initialOwner) {
        artistWallet = _artistWallet;
        platformWallet = _platformWallet;
    }

    function mint(uint8 _artistPercentage) public payable {
        require(msg.value > 0, "El pago debe ser mayor que cero");
        require(_artistPercentage <= 100, "El porcentaje no puede exceder 100");

        uint256 artistShare = (msg.value * _artistPercentage) / 100;
        uint256 platformShare = msg.value - artistShare;

        (bool successArtist, ) = artistWallet.call{value: artistShare}("");
        require(successArtist, "Fallo al transferir al artista");
        if (platformShare > 0) {
            (bool successPlatform, ) = platformWallet.call{value: platformShare}("");
            require(successPlatform, "Fallo al transferir a la plataforma");
        }

        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(msg.sender, newTokenId);

        emit NFTMinted(
            newTokenId,
            msg.sender,
            msg.value,
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