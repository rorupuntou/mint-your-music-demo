"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../../lib/contract_mainnet";
import Head from "next/head";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";

type MiniKitError = { message?: string };

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [price, setPrice] = useState("0.001");
  const [artistPercentage, setArtistPercentage] = useState(80);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    MiniKit.install();
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    setFeedback("Conectando billetera...");
    try {
      if (!MiniKit.isInstalled())
        throw new Error("Asegúrate de estar en World App.");
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: "a1b2c3d4",
      });
      if (finalPayload.status === "success") {
        setIsConnected(true);
        setFeedback(
          "¡Billetera conectada! Ahora, por favor verifica tu humanidad."
        );
      } else {
        throw new Error("El usuario rechazó la conexión.");
      }
    } catch (e) {
      console.error("Fallo al conectar la billetera:", e);
      if (e instanceof Error) setFeedback(`Error: ${e.message}`);
      else setFeedback("Ocurrió un error desconocido al conectar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setFeedback("Por favor, verifica tu humanidad en World App...");
    try {
      if (!MiniKit.isInstalled())
        throw new Error("MiniKit no está disponible.");
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: "purchase-nft", // <-- USA TU ACTION ID DEL PORTAL
        verification_level: VerificationLevel.Orb,
      });

      if (finalPayload.status === "success") {
        setFeedback("Verificando prueba en el backend...");
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payload: finalPayload,
            action: "purchase-nft",
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setIsHuman(true);
          setFeedback("¡Verificación exitosa! Ya puedes comprar.");
        } else {
          throw new Error(
            data.detail || "La verificación falló en el backend."
          );
        }
      } else {
        throw new Error("La verificación fue cancelada.");
      }
    } catch (error) {
      console.error("Error de verificación:", error);
      if (error instanceof Error) setFeedback(`Error: ${error.message}`);
      else setFeedback("Ocurrió un error desconocido.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    setFeedback("Preparando la transacción...");
    try {
      if (!MiniKit.isInstalled())
        throw new Error("MiniKit no está disponible.");
      const priceInWei = ethers.parseEther(price);
      const transaction = {
        address: contractAddress,
        abi: contractABI,
        functionName: "mint",
        args: [artistPercentage],
        value: ethers.toQuantity(priceInWei),
      };
      const result = await MiniKit.commandsAsync.sendTransaction({
        transaction: [transaction],
      });
      if (result.finalPayload.status === "success") {
        setFeedback("¡Transacción enviada! Tu NFT se está acuñando...");
        setTimeout(() => {
          setFeedback("¡Compra exitosa! Gracias por tu apoyo.");
          setPurchaseSuccess(true);
        }, 8000);
      } else {
        const errorPayload = result.finalPayload as MiniKitError;
        throw new Error(
          errorPayload.message || "La transacción fue rechazada."
        );
      }
    } catch (error) {
      console.error("Error en la compra:", error);
      if (error instanceof Error) setFeedback(`Error: ${error.message}`);
      else setFeedback("Ocurrió un error desconocido durante la compra.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Mint your Music (Mainnet)</title>
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-lg">
          {!isConnected ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                Bienvenido a Mint your Music
              </h1>
              <p className="mt-2 text-gray-400">
                Conecta tu billetera para empezar.
              </p>
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full px-4 py-3 mt-8 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500"
              >
                {isLoading ? "Conectando..." : "1. Conectar Billetera"}
              </button>
            </div>
          ) : !isHuman ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Verifica tu Humanidad</h1>
              <p className="mt-2 text-gray-400">
                Para prevenir bots, por favor verifica que eres un humano único.
              </p>
              <button
                onClick={handleVerify}
                disabled={isLoading}
                className="w-full px-4 py-3 mt-8 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-500"
              >
                {isLoading ? "Verificando..." : "2. Verificar con World ID"}
              </button>
            </div>
          ) : (
            <>
              <img
                src="https://emerald-used-leopard-238.mypinata.cloud/ipfs/bafybeigsisfzfe2uhf4w66u5x7s4fihksl42qwkdi4nveiyl2jlokvrghe"
                alt="Album Art"
                className="w-full h-auto rounded-md shadow-md"
              />
              <h1 className="mt-4 text-2xl font-bold text-center">
                Genesis Album
              </h1>
              <p className="text-center text-gray-400">by Rodrigo</p>
              <audio controls className="w-full mt-4">
                <source
                  src="https://emerald-used-leopard-238.mypinata.cloud/ipfs/bafybeigtm3cwlhwccorzwy6o4kmh6bilhbmutkjtrybqiak3l3yrx5fspu"
                  type="audio/mpeg"
                />
              </audio>
              <div className="mt-6">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-300"
                >
                  Tu Precio (en ETH)
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md"
                  step="0.001"
                  min="0.001"
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="percentage"
                  className="block text-sm font-medium text-gray-300"
                >
                  Reparto: {artistPercentage}% Artista /{" "}
                  {100 - artistPercentage}% Plataforma
                </label>
                <input
                  type="range"
                  id="percentage"
                  min="1"
                  max="100"
                  value={artistPercentage}
                  onChange={(e) => setArtistPercentage(Number(e.target.value))}
                  className="w-full h-2 mt-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              {!purchaseSuccess ? (
                <button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="w-full px-4 py-3 mt-8 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500"
                >
                  {isLoading ? "Procesando..." : "3. Comprar como NFT"}
                </button>
              ) : (
                <p className="mt-8 text-lg font-bold text-center text-green-400">
                  ¡Gracias por tu apoyo!
                </p>
              )}
            </>
          )}
          {feedback && (
            <p className="mt-4 text-sm text-center text-gray-400">{feedback}</p>
          )}
        </div>
      </main>
    </>
  );
}
