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
        require(_artistWallet != address(0), "Direccion del artista invalida");
        require(_platformWallet != address(0), "Direccion de la plataforma invalida");
        artistWallet = _artistWallet;
        platformWallet = _platformWallet;
    }

    function mint(uint8 _artistPercentage) public payable {
        require(msg.value > 0, "El pago debe ser mayor que cero");
        require(_artistPercentage <= 100, "El porcentaje no puede exceder 100");

        uint256 artistShare = (msg.value * _artistPercentage) / 100;
        uint256 platformShare = msg.value - artistShare;

        _transferFunds(artistShare, platformShare);

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

    // Esta función es la que las billeteras y mercados leen
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _transferFunds(uint256 _artistShare, uint256 _platformShare) internal {
        (bool artistSuccess, ) = artistWallet.call{value: _artistShare}("");
        require(artistSuccess, "Fallo al transferir al artista");

        if (_platformShare > 0) {
            (bool platformSuccess, ) = platformWallet.call{value: _platformShare}("");
            require(platformSuccess, "Fallo al transferir a la plataforma");
        }
    }
}