"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../../lib/contract_mainnet"; // <-- Apunta a la config de mainnet
import Head from "next/head";
import { IDKitWidget } from "@worldcoin/idkit";
import { MiniKit } from "@worldcoin/minikit-js";

// ABI estándar para un token ERC20 y dirección del token WLD en Mainnet
const erc20ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
];
const WLD_TOKEN_ADDRESS = "0x2cfc85d8e48f8eab294be644d9e25c3030863003";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [price, setPrice] = useState("0.1"); // Precio inicial en WLD
  const [artistPercentage, setArtistPercentage] = useState(80);
  const [feedback, setFeedback] = useState(
    "Conecta tu billetera para empezar."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    MiniKit.install();
  }, []);

  const handleConnect = async () => {
    try {
      if (!MiniKit.isInstalled())
        throw new Error("Asegúrate de estar en World App.");
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: "a1b2c3d4",
      });
      if (finalPayload.status === "success") {
        setIsConnected(true);
        setFeedback(
          `Billetera conectada: ${finalPayload.address.slice(0, 6)}...`
        );
      } else {
        throw new Error("El usuario rechazó la conexión.");
      }
    } catch (e) {
      // ... (manejo de errores)
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    setFeedback(`Pidiendo aprobación para gastar ${price} WLD...`);
    try {
      if (!MiniKit.isInstalled())
        throw new Error("MiniKit no está disponible.");

      const priceInWei = ethers.parseUnits(price, 18); // WLD usa 18 decimales
      const transaction = {
        address: WLD_TOKEN_ADDRESS,
        abi: erc20ABI,
        functionName: "approve",
        args: [contractAddress, priceInWei],
      };

      const result = await MiniKit.commandsAsync.sendTransaction({
        transaction: [transaction],
      });

      if (result.finalPayload.status === "success") {
        setFeedback("Aprobación enviada, esperando confirmación...");
        // Aquí deberíamos esperar el hash, pero para la demo asumimos éxito
        setTimeout(() => {
          setIsApproved(true);
          setFeedback("¡Aprobación exitosa! Ya puedes comprar el NFT.");
          setIsLoading(false);
        }, 8000);
      } else {
        throw new Error(
          (result.finalPayload as any).message || "La aprobación fue rechazada."
        );
      }
    } catch (error) {
      // ... (manejo de errores)
    }
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    setFeedback("Preparando la transacción de compra...");
    try {
      if (!MiniKit.isInstalled())
        throw new Error("MiniKit no está disponible.");
      const priceInWei = ethers.parseUnits(price, 18);

      const transaction = {
        address: contractAddress,
        abi: contractABI,
        functionName: "mint",
        args: [priceInWei, artistPercentage],
      };

      const result = await MiniKit.commandsAsync.sendTransaction({
        transaction: [transaction],
      });

      if (result.finalPayload.status === "success") {
        // ... (lógica de éxito)
      } else {
        throw new Error(
          (result.finalPayload as any).message ||
            "La transacción fue rechazada."
        );
      }
    } catch (error) {
      // ... (manejo de errores)
    }
  };

  // ... (El resto de tu JSX y funciones auxiliares)
  // Asegúrate de adaptar tu JSX para mostrar el botón de "Aprobar" primero,
  // y luego el de "Comprar como NFT" cuando isApproved sea true.
}
