"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../../lib/contract_mainnet";
import Head from "next/head";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import { translations } from "../../../lib/translations";

type MiniKitError = { message?: string };

export default function Home() {
    const [lang, setLang] = useState<'en' | 'es'>('en');
    const t = translations[lang];
    const [isConnected, setIsConnected] = useState(false);
    const [isHuman, setIsHuman] = useState(false);
    const [price, setPrice] = useState("0.001");
    const [artistPercentage, setArtistPercentage] = useState(80);
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    useEffect(() => { MiniKit.install(); }, []);

    const handleConnect = async () => {
        setIsLoading(true);
        setFeedback(t.connecting);
        try {
            if (!MiniKit.isInstalled()) throw new Error("Asegúrate de estar en World App.");
            const { finalPayload } = await MiniKit.commandsAsync.walletAuth({ nonce: "a1b2c3d4" });
            if (finalPayload.status === "success") {
                setIsConnected(true);
                setFeedback(t.wallet_connected);
            } else { throw new Error("El usuario rechazó la conexión."); }
        } catch (e) {
            console.error("Fallo al conectar la billetera:", e);
            if (e instanceof Error) setFeedback(`Error: ${e.message}`);
            else setFeedback(t.error_connect);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        setIsLoading(true);
        setFeedback(t.verifying);
        try {
            if (!MiniKit.isInstalled()) throw new Error("MiniKit no está disponible.");
            const { finalPayload } = await MiniKit.commandsAsync.verify({
                action: 'purchase-nft',
                verification_level: VerificationLevel.Orb,
            });
            if (finalPayload.status === 'success') {
                setFeedback("Verificando prueba en el backend...");
                const res = await fetch('/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ payload: finalPayload, action: 'purchase-nft' }),
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    setIsHuman(true);
                    setFeedback(t.verification_success);
                } else { throw new Error(data.detail || "La verificación falló en el backend."); }
            } else { throw new Error("La verificación fue cancelada."); }
        } catch (error) {
            console.error("Error de verificación:", error);
            if (error instanceof Error) setFeedback(`Error: ${error.message}`);
            else setFeedback(t.error_verify);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePurchase = async () => {
        setIsLoading(true);
        setFeedback(t.purchasing);
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
                setFeedback(t.purchase_feedback);
                setTimeout(() => {
                    setFeedback(t.purchase_complete);
                    setPurchaseSuccess(true);
                }, 8000);
            } else {
                const errorPayload = result.finalPayload as MiniKitError;
                throw new Error(errorPayload.message || "La transacción fue rechazada.");
            }
        } catch (error) {
            console.error("Error en la compra:", error);
            if (error instanceof Error) setFeedback(`Error: ${error.message}`);
            else setFeedback(t.error_purchase);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head><title>Mint your Music</title></Head>
            <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-black text-white font-sans">
                <div className="absolute top-4 right-4 z-10">
                    <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="px-3 py-1 text-sm text-gray-400 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                        {t.lang_switcher}
                    </button>
                </div>
                <div className="w-full max-w-sm p-6 bg-gray-900 rounded-2xl shadow-lg border border-gray-700 space-y-6">
                    {!isConnected ? (
                        <div className="text-center space-y-4">
                            <h1 className="text-2xl font-bold">{t.welcome}</h1>
                            <p className="text-gray-400">{t.connect_wallet_prompt}</p>
                            <button onClick={handleConnect} disabled={isLoading} className="w-full py-3 mt-4 font-bold text-white uppercase tracking-wider bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed">
                                {isLoading ? t.connecting : t.connect_wallet_button}
                            </button>
                        </div>
                    ) : !isHuman ? (
                        <div className="text-center space-y-4">
                             <h1 className="text-2xl font-bold">{t.verify_humanity}</h1>
                             <p className="text-gray-400">{t.verify_prompt}</p>
                             <button onClick={handleVerify} disabled={isLoading} className="w-full py-3 mt-4 font-bold text-white uppercase tracking-wider bg-purple-600 rounded-lg hover:bg-purple-700 transition-transform transform active:scale-95 disabled:bg-gray-600">
                                {isLoading ? t.verifying : t.verify_button}
                             </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <img src="https://emerald-used-leopard-238.mypinata.cloud/ipfs/bafybeigsisfzfe2uhf4w66u5x7s4fihksl42qwkdi4nveiyl2jlokvrghe" alt="Album Art" className="w-full h-auto rounded-lg shadow-md"/>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold">{purchaseSuccess ? t.thank_you : t.album_title}</h1>
                                <p className="text-gray-400">{t.artist_name}</p>
                            </div>
                            <audio controls className="w-full rounded-lg">
                                <source src="https://emerald-used-leopard-238.mypinata.cloud/ipfs/bafybeigtm3cwlhwccorzwy6o4kmh6bilhbmutkjtrybqiak3l3yrx5fspu" type="audio/mpeg" />
                            </audio>
                            {!purchaseSuccess ? (
                                <>
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">{t.price_label}</label>
                                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg" step="0.001" min="0.001" />
                                    </div>
                                    <div>
                                        <label htmlFor="percentage" className="block text-sm font-medium text-gray-300 mb-1">{t.split_label} {artistPercentage}% {t.artist} / {100 - artistPercentage}% {t.platform}</label>
                                        <input type="range" id="percentage" min="1" max="100" value={artistPercentage} onChange={(e) => setArtistPercentage(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                    </div>
                                    <button onClick={handlePurchase} disabled={isLoading} className="w-full py-3 mt-4 font-bold text-white uppercase tracking-wider bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform active:scale-95 disabled:bg-gray-600">
                                        {isLoading ? t.purchasing : t.purchase_button}
                                    </button>
                                </>
                            ) : (
                                <p className="mt-8 text-lg font-bold text-center text-green-400">{t.thank_you}</p>
                            )}
                        </>
                    )}
                    {feedback && (<p className="mt-4 text-sm text-center text-gray-400">{feedback}</p>)}
                </div>
            </main>
        </>
    );
}