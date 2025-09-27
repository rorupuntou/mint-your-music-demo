# Mint your Music - Smart Contract

This directory contains the Solidity smart contract for the "Mint your Music" project, developed with Foundry.

The core contract is `MintYourMusicNFT.sol`, an ERC721 token that allows users to mint an NFT by paying a self-determined price in ETH. The contract automatically splits the payment between an artist's wallet and a platform wallet based on a user-specified percentage.

## Core Logic

- **`mint(uint8 _artistPercentage)`:** A payable function that accepts ETH, calculates the revenue split, transfers the funds to the respective wallets, and mints a new NFT to the caller (`msg.sender`).
- **`setBaseURI(string memory _newBaseURI)`:** An owner-only function to set the metadata URI for the NFTs, pointing to an IPFS JSON file.
- **`tokenURI(uint256 tokenId)`:** A public view function that returns the metadata URI for a given NFT.

---

## Foundry Project Setup

This project uses [Foundry](https://book.getfoundry.sh/) for development, testing, and deployment.

### Dependencies

To install dependencies like OpenZeppelin contracts, run:

```shell
forge install
```
