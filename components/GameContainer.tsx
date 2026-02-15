"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { useShake } from "@/hooks/useShake";
import { usePermission } from "@/hooks/usePermission";
import { Envelope } from "./Envelope";
import { PermissionScreen } from "./PermissionScreen";
import { ShakeSimulator } from "./ShakeSimulator";
import { GAME_CONFIG, PRIZES, WISHES, type PrizeType } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export function GameContainer() {
    const { permissionState, requestPermission } = usePermission();
    const [hasPlayed, setHasPlayed] = useState(false);
    const [gameState, setGameState] = useState<"idle" | "picking" | "playing" | "won">("idle");
    const [prize, setPrize] = useState<PrizeType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);

    // Load played status
    useEffect(() => {
        if (GAME_CONFIG.UNLIMITED_PLAY) {
            setIsLoading(false);
            return;
        }

        const savedStatus = localStorage.getItem(GAME_CONFIG.STORAGE_KEY);
        if (savedStatus) {
            setHasPlayed(true);
        }
        setIsLoading(false);
    }, []);

    const handleWin = useCallback(() => {
        // Select random prize
        // Determine if grand prize (100k) is available this round
        const isGrandPrizeAvailable = Math.random() < 0.3; // 30% chance for 100k to be in the pool

        let availablePrizes = PRIZES;
        if (!isGrandPrizeAvailable) {
            availablePrizes = PRIZES.filter(p => p.amount !== 100000);
        }

        const totalWeight = availablePrizes.reduce((acc, p) => acc + p.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedPrize = availablePrizes[availablePrizes.length - 1];

        for (const p of availablePrizes) {
            if (random < p.weight) {
                selectedPrize = p;
                break;
            }
            random -= p.weight;
        }

        const randomWish = WISHES[Math.floor(Math.random() * WISHES.length)];

        setPrize({ ...selectedPrize, message: randomWish });
        setGameState("won");
        setHasPlayed(true);

        if (!GAME_CONFIG.UNLIMITED_PLAY) {
            localStorage.setItem(GAME_CONFIG.STORAGE_KEY, "true");
        }

        // Effects
        triggerEffects();
    }, [isMuted]);

    const onShake = useCallback(() => {
        if (gameState !== "playing") return;

        // Vibration feedback on shake
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Shake logic (count can be increased if needed)
        handleWin();
    }, [gameState, handleWin]);

    const { simulateShake } = useShake({
        enabled: gameState === "playing",
        onShake,
    });

    const triggerEffects = () => {
        // Play Win Sound
        if (!isMuted) {
            const winAudio = new Audio('/audios/win.mp3');
            winAudio.volume = 1.0;
            winAudio.play().catch(e => console.error("Win audio failed", e));
        }

        // Vibration logic for Win
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }

        // Confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#FFD700", "#FF0000"]
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#FFD700", "#FF0000"]
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    const startGame = () => {
        setGameState("picking");
        if (audioRef.current) audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    };

    const handleSelectEnvelope = () => {
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(20);
        setGameState("playing");
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Permission Flow
    const handleRequestPermission = async () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
        await requestPermission();
    };

    const renderPickingScreen = () => {
        // Circle layout calculation
        const count = 6;
        const radius = 120; // Radius of the envelope circle

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="relative w-full h-96 flex items-center justify-center"
            >
                <style jsx global>{`
                    @keyframes spin-circle {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes spin-circle-reverse {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .ferris-wheel {
                        animation: spin-circle 10s linear infinite;
                        will-change: transform;
                    }
                    .ferris-wheel-item {
                        animation: spin-circle-reverse 10s linear infinite;
                        will-change: transform;
                    }
                `}</style>

                <div className="relative w-full h-full flex items-center justify-center ferris-wheel">
                    {Array.from({ length: count }).map((_, i) => {
                        const angle = (i * 360) / count;
                        const radian = (angle * Math.PI) / 180;
                        const x = Math.cos(radian) * radius;
                        const y = Math.sin(radian) * radius;

                        return (
                            <motion.button
                                key={i}
                                className="absolute w-24 h-32 cursor-pointer ferris-wheel-item"
                                style={{
                                    left: `calc(50% + ${x}px - 48px)`, // Center centering (96px/2 = 48px)
                                    top: `calc(50% + ${y}px - 64px)`,  // Center centering (128px/2 = 64px)
                                    position: 'absolute'
                                }}
                                whileHover={{ scale: 1.2, zIndex: 10 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSelectEnvelope}
                            >
                                <div className="w-full h-full relative drop-shadow-xl hover:drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] transition-all">
                                    <img src="/assets/envelope.svg" alt="Lì xì" className="w-full h-full object-contain" />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-yellow-300 font-bold text-xl bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm animate-pulse z-0 transform translate-y-2">
                        Chọn 1 bao nhé!
                    </p>
                </div>
            </motion.div>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-red-800">
                    <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                </div>
            );
        }

        if (permissionState !== "granted" && permissionState !== "not_supported") {
            return <PermissionScreen onRequestPermission={handleRequestPermission} isSupported={true} permissionState={permissionState} />;
        }

        if (permissionState === "not_supported") {
            return <PermissionScreen onRequestPermission={requestPermission} isSupported={false} permissionState={permissionState} />;
        }

        if (hasPlayed && gameState !== "won") {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-red-800 text-yellow-400 p-4 text-center">
                    <h1 className="text-3xl font-bold mb-4 font-serif">Bạn đã nhận lì xì rồi!</h1>
                    <p className="text-lg">Mỗi người chỉ được lộc một lần thôi nhé.</p>
                    <p className="mt-4 text-sm text-yellow-200/60">Chúc mừng năm mới!</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/assets/bg-pattern.png')] bg-cover bg-center bg-red-700 overflow-hidden relative w-full h-full">
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-red-900/40 backdrop-blur-[2px]" />

                <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center">
                    {/* Header */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center mb-10"
                    >
                        <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg font-serif tracking-wide">
                            Tết 2025
                        </h1>
                        <p className="text-white/80 text-lg mt-2 font-light tracking-widest uppercase">
                            Xuân Ất Tỵ
                        </p>
                    </motion.div>

                    {/* Game Area */}
                    <div className="h-96 flex items-center justify-center w-full relative">
                        {gameState === 'idle' && (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startGame}
                                className="bg-yellow-400 text-red-900 font-bold text-2xl px-10 py-4 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-bounce"
                            >
                                Khui Lì Xì Ngay
                            </motion.button>
                        )}

                        {gameState === 'picking' && renderPickingScreen()}

                        {gameState === 'playing' && (
                            <motion.div
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="flex flex-col items-center"
                            >
                                <Envelope state="shaking" className="w-64 h-auto drop-shadow-[0_0_50px_rgba(250,204,21,0.4)]" />
                                <p className="mt-8 text-white/90 animate-pulse text-xl font-medium">
                                    Lắc mạnh tay nào! 👋
                                </p>
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {gameState === 'won' && prize && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="absolute inset-0 z-20 flex items-center justify-center"
                                >
                                    <div className="bg-gradient-to-br from-red-600 to-red-900 border-4 border-yellow-400 p-8 rounded-2xl shadow-2xl w-full text-center relative overflow-hidden">
                                        {/* Light ray effect */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-white/10 blur-3xl rounded-full pointer-events-none" />

                                        <h2 className="text-3xl font-bold text-yellow-300 mb-2">Chúc Mừng!</h2>
                                        <div className="my-6">
                                            <span className="text-5xl font-black text-white drop-shadow-md">
                                                {prize.amount.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                        <p className="text-yellow-100 italic text-lg mb-6">
                                            "{prize.message}"
                                        </p>
                                        <div className="text-sm text-white/50">
                                            Chụp màn hình lại nhé!
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <ShakeSimulator onShake={simulateShake} />
            </div>
        );
    };

    return (
        <>
            {/* GLOBAL AUDIO & CONTROLS */}
            <audio ref={audioRef} src="/audios/musicbg.mp3" loop preload="auto" />

            <button
                onClick={toggleMute}
                className="fixed top-4 right-4 z-[60] bg-black/30 backdrop-blur-md p-3 rounded-full text-yellow-400 border border-yellow-400/30 hover:bg-black/50 transition-all active:scale-95"
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <line x1="23" x2="1" y1="1" y2="23" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                )}
            </button>

            {renderContent()}
        </>
    );
}
