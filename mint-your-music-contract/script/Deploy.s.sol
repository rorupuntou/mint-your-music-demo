// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MintYourMusicNFT.sol";

contract DeployScript is Script {
    function run() external returns (MintYourMusicNFT) {
        // --- USA TU DIRECCIÓN DE METAMASK AQUÍ ---
        // Esta es la billetera que recibirá los fondos de las ventas.
        address payable myWallet = payable(0x536bB672A282df8c89DDA57E79423cC505750E52); 

        vm.startBroadcast();

        // Usamos tu dirección para el artista y la plataforma
        MintYourMusicNFT nftContract = new MintYourMusicNFT(myWallet, myWallet, msg.sender);

        // Reemplaza esta URL con la que obtuviste de Pinata para tu archivo metadata.json
        string memory metadataURI = "https://emerald-used-leopard-238.mypinata.cloud/ipfs/bafkreibgfbcgratqorpg245lgfqmnm43f4y553ng3qny6kxrkfg24lybzy"; 
        nftContract.setBaseURI(metadataURI);

        vm.stopBroadcast();
        return nftContract;
    }
}