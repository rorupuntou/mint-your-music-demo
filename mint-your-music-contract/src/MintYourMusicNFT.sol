// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // 1. Importar la interfaz de ERC20

contract MintYourMusicNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    address public immutable artistWallet;
    address public immutable platformWallet;
    IERC20 public immutable wldToken; // 2. Dirección del token WLD
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
        address _wldTokenAddress, // 3. Recibir la dirección de WLD
        address _initialOwner
    ) ERC721("Mint Your Music: Genesis", "MYMG") Ownable(_initialOwner) {
        artistWallet = _artistWallet;
        platformWallet = _platformWallet;
        wldToken = IERC20(_wldTokenAddress);
    }

    // 4. FUNCIÓN MINT ACTUALIZADA - ya no es 'payable'
    function mint(uint256 _price, uint8 _artistPercentage) public {
        require(_price > 0, "El precio debe ser mayor que cero");
        require(_artistPercentage <= 100, "El porcentaje no puede exceder 100");

        // A. Tomar los WLD del usuario (el usuario debe haber aprobado primero)
        wldToken.transferFrom(msg.sender, address(this), _price);

        // B. Calcular el reparto
        uint256 artistShare = (_price * _artistPercentage) / 100;
        uint256 platformShare = _price - artistShare;

        // C. Transferir los WLD al artista y la plataforma
        wldToken.transfer(artistWallet, artistShare);
        if (platformShare > 0) {
            wldToken.transfer(platformWallet, platformShare);
        }

        // D. Acuñar el NFT
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
    
    // --- El resto de funciones (setBaseURI, tokenURI, etc.) se mantienen igual ---
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