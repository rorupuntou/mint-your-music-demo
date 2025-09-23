"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../../lib/contract_mainnet";
import Head from "next/head";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js"; // Usamos MiniKit para la verificación

type MiniKitError = { message?: string };

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isHuman, setIsHuman] = useState(false); // <-- NUEVO ESTADO
  const [price, setPrice] = useState("0.001");
  const [artistPercentage, setArtistPercentage] = useState(80);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    MiniKit.install();
  }, []);

  const handleConnect = async () => {
    /* ... se mantiene igual ... */
  };

  // --- NUEVA FUNCIÓN DE VERIFICACIÓN ---
  const handleVerify = async () => {
    setIsLoading(true);
    setFeedback("Por favor, verifica tu humanidad en World App...");
    try {
      if (!MiniKit.isInstalled())
        throw new Error("MiniKit no está disponible.");

      // Llama al comando de verificación de MiniKit
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: "purchase-nft", // <-- USA TU ACTION ID DEL PORTAL
        verification_level: VerificationLevel.Orb,
      });

      if (finalPayload.status === "success") {
        setFeedback("Verificando prueba en el backend...");
        // Envía la prueba a nuestro backend para una verificación segura
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payload: finalPayload,
            action: "purchase-nft",
          }),
        });

        if (res.ok) {
          setIsHuman(true);
          setFeedback("¡Verificación exitosa! Ya puedes comprar.");
        } else {
          const errorData = await res.json();
          throw new Error(
            errorData.detail || "La verificación falló en el backend."
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
    /* ... se mantiene igual ... */
  };

  return (
    <>
      <Head>
        <title>Mint your Music (Mainnet)</title>
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-lg">
          {/* --- LÓGICA DE LA UI ACTUALIZADA --- */}
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
                1. Conectar Billetera
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
            // Contenido de la compra (lo que ya tenías)
            <>
              {/* ... (toda la UI de la portada, audio, inputs y botón de compra) ... */}
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
