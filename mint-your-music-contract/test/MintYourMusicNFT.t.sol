// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MintYourMusicNFT.sol";

contract MintYourMusicNFTTest is Test {
    // --- Variables de Estado para la Prueba ---
    MintYourMusicNFT public nftContract;
    
    // Direcciones de billetera simuladas para la prueba
    address payable public artist = payable(address(0x1)); // Artista simulado
    address payable public platform = payable(address(0x2)); // Plataforma simulada
    address public buyer = address(0x3); // Comprador simulado
    address public owner = address(0x4); // Dueño del contrato

    // --- Función de Configuración (Setup) ---
    // Esta función se ejecuta ANTES de cada prueba.
    function setUp() public {
        // Desplegamos una nueva instancia de nuestro contrato para cada prueba
        nftContract = new MintYourMusicNFT(artist, platform, owner);

        // Le damos al comprador simulado algo de ETH para gastar
        vm.deal(buyer, 1 ether);
    }

    // --- Funciones de Prueba ---

    /**
     * @notice Prueba que la función de mint funciona correctamente.
     */
    function test_MintSuccess() public {
        // Definimos el precio de compra y el porcentaje para la prueba
        uint256 price = 1 ether;
        uint8 artistPercentage = 80; // 80% para el artista

        // Guardamos el balance inicial del artista
        uint256 artistInitialBalance = artist.balance;

        // SIMULAMOS LA ACCIÓN: El 'buyer' llama a la función 'mint'
        vm.startPrank(buyer); // A partir de ahora, 'msg.sender' será 'buyer'
        nftContract.mint{value: price}(artistPercentage);
        vm.stopPrank(); // Dejamos de simular al 'buyer'

        // VERIFICAMOS LOS RESULTADOS (Assertions)

        // 1. ¿Recibió el 'buyer' el NFT?
        assertEq(nftContract.ownerOf(0), buyer, "El comprador deberia ser el dueno del NFT 0");

        // 2. ¿Se incrementó el balance del artista correctamente?
        uint256 expectedArtistShare = (price * artistPercentage) / 100;
        assertEq(artist.balance, artistInitialBalance + expectedArtistShare, "El balance del artista no se incremento correctamente");
    }
}