// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MintYourMusicNFT.sol";

contract DeployScript is Script {
    function run() external returns (MintYourMusicNFT) {
        address myWallet = 0x536bB672A282df8c89DDA57E79423cC505750E52; // <-- USA TU DIRECCIÓN DE METAMASK/WORLD APP

        // Dirección del token WLD en World Chain Mainnet
        address wldTokenAddress = 0x2cFc85d8E48F8EAB294be644d9E25C3030863003;

        vm.startBroadcast();

        MintYourMusicNFT nftContract = new MintYourMusicNFT(myWallet, myWallet, wldTokenAddress, msg.sender);

        string memory metadataURI = "https://emerald-used-leopard-238.mypinata.cloud/ipfs/bafybeifc3y5t5y22n7wqkzv7upicw4dotqnby3btj2xxfa2ncya7ihdlh4"; // <-- Tu metadata.json
        nftContract.setBaseURI(metadataURI);

        vm.stopBroadcast();
        return nftContract;
    }
}