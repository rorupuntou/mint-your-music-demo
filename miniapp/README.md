# Mini App: Mint your Music

This directory contains the frontend application for the "Mint your Music" project, built with Next.js and designed to run as a [Mini App](https://docs.worldcoin.org/mini-apps) inside the World App.

The application provides a user interface for connecting a wallet, verifying as a unique human with World ID, and interacting with our custom smart contract to purchase a music NFT.

## Core Technologies

- **Framework**: [Next.js](https://nextjs.org/) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a modern, responsive design.
- **Web3 Interaction**: [Ethers.js](https://ethers.org/) for formatting transactions and interacting with the blockchain.
- **Worldcoin Integration**:
  - `@worldcoin/minikit-js`: For native communication with the World App wallet (`walletAuth`, `verify`, `sendTransaction`).
- **Internationalization (i18n)**: A simple, custom translation system for English and Spanish.

---

## Getting Started

### 1. Install Dependencies

Navigate to this directory and install the required packages.

```shell
npm install
```
