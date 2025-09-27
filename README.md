# Mint your Music 🎵

**Own Your Sound.** A decentralized mini-app for the Worldcoin ecosystem that reinvents how fans support artists. Inspired by Bandcamp, it allows purchasing music as NFTs under the "Name Your Price" model, with a transparent, user-decided revenue split.

This repository contains the full source code for the functional demo developed for the Worldcoin Hackathon.

➡️ **Live Demo:** [mint-your-music-demo.vercel.app/mainnet-demo](https://mint-your-music-demo.vercel.app/mainnet-demo)

---

## ✨ Key Features

- **Direct Artist Support:** Fans choose the price and decide the percentage of their payment that goes directly to the artist.
- **Verified Human Fans:** Integrated with World ID to ensure a bot-free community of genuine supporters.
- **True Music Ownership:** Each purchase mints a unique NFT of the album art, giving fans a real, collectible digital asset.
- **Seamless Experience:** Natively integrated into the World App using the MiniKit SDK for gas-less transactions on World Chain.
- **Multi-language Support:** Fully localized user interface for both English and Spanish-speaking users.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Blockchain:** Solidity
- **Web3 Tools:** Ethers.js, Foundry (Forge)
- **Worldcoin Ecosystem:** MiniKit SDK, World ID, World Chain
- **Decentralized Storage:** IPFS (via Pinata) for music and art.
- **Deployment:** Vercel for the frontend.

---

## 📁 Project Structure

This repository is a monorepo containing two main packages:

- `miniapp/`: The frontend application built with Next.js that runs inside the World App.
- `mint-your-music-contract/`: The Solidity smart contract, managed with Foundry.

---

## 🏁 Getting Started (Local Setup)

Follow these steps to get the project up and running in your local environment.

### Prerequisites

- Git
- Node.js (managed with `nvm`)
- Foundry

### Installation

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/rorupuntou/mint-your-music-demo.git](https://github.com/rorupuntou/mint-your-music-demo.git)
   cd mint-your-music-demo
   ```

2. **Install Smart Contract dependencies:**

   ```bash
   cd mint-your-music-contract
   forge install
   ```

3. **Install Mini App dependencies:**

   ```bash
   cd ../miniapp
   npm install
   ```

---

## 🚀 Running the Demo (Full Workflow)

This is the complete routine to start the application, which is configured for World Chain Mainnet.

### 1. Deploy the Smart Contract

For each new development session, or if you modify the contract, you need to deploy it.

1. Navigate to the contract folder:

   ```bash
   cd mint-your-music-contract
   ```

2. Run the deployment script. You will need a private key from a wallet with ETH on World Chain to pay for gas.

   ```bash
   forge script script/Deploy.s.sol:DeployScript --rpc-url [https://worldchain-mainnet.g.alchemy.com/public](https://worldchain-mainnet.g.alchemy.com/public) --private-key YOUR_PRIVATE_KEY --broadcast
   ```

3. Copy the new contract address from the terminal output.

### 2. Update the Mini App Configuration

1. Open the file `miniapp/lib/contract_mainnet.js`.
2. Paste the new contract address into the `contractAddress` variable and save the file.

### 3. Run the Frontend

1. Navigate to the mini app folder:

   ```bash
   cd ../miniapp
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. You can now access the app at `http://localhost:3000/mainnet-demo`.

### 4. Test on a Mobile Device with World App

For the full experience, the app must run inside the World App.

1. In a new terminal, run `ngrok http 3000` to create a public URL for your local server.
2. Copy the `https` ngrok URL and paste it into the "App URL" field of your project in the Worldcoin Developer Portal.
3. Use the QR code from the Portal to open the app on your phone via the "Dev Apps" menu in the World App.

---

## ✅ Verifying the Contract on Worldscan

To make your contract transparent and trustworthy, verify it on the block explorer.

1. **Set your Etherscan API Key** (Worldscan uses the Etherscan engine):

   ```shell
   export ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
   ```

2. **Run the verification command:**
   Replace `<YOUR_CONTRACT_ADDRESS>` and `<YOUR_WALLET_ADDRESS>` with the corresponding addresses from your deployment.

   ```shell
   forge verify-contract \
     --chain-id 480 \
     <YOUR_CONTRACT_ADDRESS> \
     src/MintYourMusicNFT.sol:MintYourMusicNFT \
     --constructor-args <YOUR_WALLET_ADDRESS> <YOUR_WALLET_ADDRESS> <YOUR_WALLET_ADDRESS>
   ```

---

## 🌐 Deployment

This project is configured for continuous deployment with Vercel.

- Every `git push` to the `main` branch automatically triggers a new production build.
- The Vercel project is configured with the **Root Directory** set to `miniapp`.
- **Environment Variables** (like `NEXT_PUBLIC_WLD_APP_ID`) must be configured in the project settings on Vercel.
