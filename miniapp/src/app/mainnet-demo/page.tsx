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
      console.error("Fallo al conectar la billetera:", e);
      if (e instanceof Error) setFeedback(`Error: ${e.message}`);
      else setFeedback("Ocurrió un error desconocido al conectar.");
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
          setFeedback("¡Compra exitosa! Ahora puedes verificar tu humanidad.");
          setPurchaseSuccess(true);
          setIsLoading(false);
        }, 8000);
      } else {
        const errorPayload = result.finalPayload as MiniKitError;
        throw new Error(
          errorPayload.message || "La transacción fue rechazada."
        );
      }
    } catch (error) {
      console.error("Error en la compra:", error);
      if (error instanceof Error) {
        setFeedback(`Error: ${error.message}`);
      } else {
        setFeedback("Ocurrió un error desconocido durante la compra.");
      }
      setIsLoading(false);
    }
  };

  const handleVerifySuccess = () => {
    setIsVerified(true);
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
                className="w-full px-4 py-3 mt-8 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Conectar Billetera de World App
              </button>
            </div>
          ) : (
            <>
              <img
                src="https://emerald-used-leopard-238.mypinata.cloud/ipfs/bafybeigsisfzfe2uhf4w66u5x7s4fihksl42qwkdi4nveiyl2jlokvrghe"
                alt="Album Art"
                className="w-full h-auto rounded-md shadow-md"
              />
              {isVerified ? (
                <p className="mt-4 text-lg font-bold text-center text-green-400">
                  Coleccionista Verificado ⭐
                </p>
              ) : (
                <h1 className="mt-4 text-2xl font-bold text-center">
                  Genesis Album
                </h1>
              )}
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
                  {isLoading ? "Procesando..." : "Comprar como NFT"}
                </button>
              ) : (
                !isVerified && (
                  <IDKitWidget
                    app_id="app_14182c5ae3df538b79f98ba0abb8dc8e"
                    action="verify-purchase"
                    onSuccess={handleVerifySuccess}
                  >
                    {({ open }) => (
                      <button
                        onClick={open}
                        className="w-full px-4 py-3 mt-8 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700"
                      >
                        Verificar con World ID
                      </button>
                    )}
                  </IDKitWidget>
                )
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
