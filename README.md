# Mint your Music 🎵

Una mini app descentralizada para el ecosistema Worldcoin que reinventa la forma en que los fans apoyan a los artistas. Inspirada en Bandcamp, permite comprar música como NFTs bajo el modelo "Name Your Price", con un reparto de ganancias transparente decidido por el usuario.

## 🚀 Demo para la Hackathon

Este repositorio contiene el código de la demo funcional presentada en la hackathon de Worldcoin.

## ✨ Tecnologías Utilizadas

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Blockchain:** Solidity
- **Herramientas Web3:** Ethers.js, Foundry (Forge, Cast)
- **Ecosistema Worldcoin:** MiniKit SDK, World ID (IDKit)
- **Almacenamiento Descentralizado:** IPFS (a través de Pinata)
- **Túnel Local:** ngrok

## 🏁 Cómo Empezar

Sigue estos pasos para levantar un entorno de desarrollo local.

### Prerrequisitos

- Node.js
- Foundry
- Git

### Instalación

1.  **Clona el repositorio:**
    ```sh
    git clone [https://github.com/rorupuntou/mint-your-music-demo.git](https://github.com/rorupuntou/mint-your-music-demo.git)
    cd mint-your-music-demo
    ```
2.  **Instala las dependencias del contrato:**
    ```sh
    cd mint-your-music-contract
    forge install
    ```
3.  **Instala las dependencias de la mini app:**
    ```sh
    cd ../miniapp
    npm install
    ```

## 🏃‍♂️ Cómo Ejecutar la Demo (Flujo de Trabajo)

Esta es la rutina completa para iniciar el entorno de desarrollo desde cero.

#### Fase 1: Preparación (Solo si es la primera vez o necesitas fondos)

1.  **Configurar MetaMask:**

    - Abre MetaMask y añade la red **World Chain Sepolia** con los siguientes datos:
      - **Network Name:** `World Chain Sepolia`
      - **RPC URL:** `https://worldchain-sepolia.g.alchemy.com/public`
      - **Chain ID:** `4801`
      - **Currency Symbol:** `ETH`

2.  **Obtener Fondos de Prueba:**
    - Copia la dirección de tu billetera de MetaMask.
    - Ve al faucet de Worldcoin **https://www.alchemy.com/faucets/world-chain-sepolia** para recibir ETH de prueba.

#### Fase 2: Inicio del Entorno (Cada vez que reinicias)

1.  **Desplegar el Smart Contract:**

    - En una terminal, navega a `mint-your-music-contract` y ejecuta:
      ```sh
      forge script script/Deploy.s.sol:DeployScript --rpc-url [https://worldchain-sepolia.g.alchemy.com/public](https://worldchain-sepolia.g.alchemy.com/public) --private-key TU_CLAVE_PRIVADA_DE_METAMASK --broadcast
      ```

2.  **Actualizar la Mini App:**

    - Copia la **NUEVA dirección del contrato** de la salida del comando anterior.
    - Abre el archivo `miniapp/lib/contract.js` y pega la nueva dirección en la variable `contractAddress`.
    - Guarda el archivo.

3.  **Iniciar Servidores Locales:**

    - En una **nueva terminal**, inicia el servidor de la mini app:
      ```sh
      cd miniapp
      npm run dev
      ```
    - En una **tercera terminal**, inicia el túnel de ngrok:
      ```sh
      ngrok http 3000
      ```

4.  **Actualizar el Portal de Worldcoin:**
    - Copia la **nueva URL `https`** de ngrok.
    - Ve al [Portal de Desarrolladores de Worldcoin](https://developer.worldcoin.org/), entra en tu proyecto, pega la URL en el campo **"App URL"** y guarda.
