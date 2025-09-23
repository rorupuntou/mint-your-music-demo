"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../../lib/contract_mainnet";
import Head from "next/head";
import { IDKitWidget } from "@worldcoin/idkit";
import { MiniKit } from "@worldcoin/minikit-js";

type MiniKitError = { message?: string };

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [price, setPrice] = useState("0.001"); // Precio en ETH
    const [artistPercentage, setArtistPercentage] = useState(80);
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => { MiniKit.install(); }, []);

    const handleConnect = async () => { /* ... se mantiene igual ... */ };

    const handlePurchase = async () => {
        setIsLoading(true);
        setFeedback("Preparando la transacción...");
        try {
            if (!MiniKit.isInstalled()) throw new Error("MiniKit no está disponible.");
            const priceInWei = ethers.parseEther(price);
            
            const transaction = {
                address: contractAddress,
                abi: contractABI,
                functionName: "mint",
                args: [artistPercentage],
                value: ethers.toQuantity(priceInWei),
            };

            const result = await MiniKit.commandsAsync.sendTransaction({ transaction: [transaction] });

            if (result.finalPayload.status === "success") {
                setFeedback("¡Transacción enviada! Tu NFT se está acuñando...");
                setTimeout(() => {
                    setFeedback("¡Compra exitosa! Ahora puedes verificar tu humanidad.");
                    setPurchaseSuccess(true);
                    setIsLoading(false);
                }, 8000);
            } else {
                const errorPayload = result.finalPayload as MiniKitError;
                throw new Error(errorPayload.message || "La transacción fue rechazada.");
            }
        } catch (error) {
            // ... (el manejo de errores se mantiene igual)
        }
    };

    const handleVerifySuccess = () => { setIsVerified(true); };

    return (
        // ... (El JSX se mantiene, solo cambia el texto de "WLD" a "ETH")
    );
}