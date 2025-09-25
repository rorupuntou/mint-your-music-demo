// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MintYourMusicNFT.sol";

contract DeployScript is Script {
    function run() external returns (MintYourMusicNFT) {
        address payable yourWallet = payable(0x536bB672A282df8c89DDA57E79423cC505750E52); // Tu billetera

        vm.startBroadcast();
        MintYourMusicNFT nftContract = new MintYourMusicNFT(yourWallet, yourWallet, msg.sender);
        string memory metadataURI = "https://emerald-used-leopard-238.mypinata.cloud/ipfs/bafybeifc3y5t5y22n7wqkzv7upicw4dotqnby3btj2xxfa2ncya7ihdlh4";
        nftContract.setBaseURI(metadataURI);
        vm.stopBroadcast();
        return nftContract;
    }
}