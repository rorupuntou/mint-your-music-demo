// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MintYourMusicNFT.sol";

contract DeployScript is Script {
    function run() external returns (MintYourMusicNFT) {
        address payable artistWallet = payable(0x595f4A7c1342a821e27A7788B002C7F217895055);
        address payable platformWallet = payable(0x8C21AEa4221975f48b8A05139885C13E1572037c);

        vm.startBroadcast();

        MintYourMusicNFT nftContract = new MintYourMusicNFT(artistWallet, platformWallet, msg.sender);

        // Configura la URI de los metadatos del NFT
        string memory metadataURI = "https://emerald-used-leopard-238.mypinata.cloud/ipfs/bafkreibgfbcgratqorpg245lgfqmnm43f4y553ng3qny6kxrkfg24lybzy"; // <-- REEMPLAZA ESTO
        nftContract.setBaseURI(metadataURI);

        vm.stopBroadcast();
        return nftContract;
    }
}