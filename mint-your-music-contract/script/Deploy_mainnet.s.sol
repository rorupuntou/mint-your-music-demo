// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MintYourMusicNFT_mainnet.sol";

contract DeployMainnetScript is Script {
    function run() external returns (MintYourMusicNFT_mainnet) {
        address payable myWallet = payable(0x536bB672A282df8c89DDA57E79423cC505750E52); 
        
        // DIRECCIÓN CORREGIDA con checksum
        address wldTokenAddress = 0x2cFc85d8E48F8EAB294be644d9E25C3030863003;

        vm.startBroadcast();

        MintYourMusicNFT_mainnet nftContract = new MintYourMusicNFT_mainnet(myWallet, myWallet, msg.sender, wldTokenAddress);

        string memory metadataURI = "https://emerald-used-leopard-238.mypinata.cloud/ipfs/bafkreibgfbcgratqorpg245lgfqmnm43f4y553ng3qny6kxrkfg24lybzy"; 
        nftContract.setBaseURI(metadataURI);

        vm.stopBroadcast();
        return nftContract;
    }
}