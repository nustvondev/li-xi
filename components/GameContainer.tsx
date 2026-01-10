"use client";

import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { useShake } from "@/hooks/useShake";
import { usePermission } from "@/hooks/usePermission";
import { Envelope } from "./Envelope";
import { PermissionScreen } from "./PermissionScreen";
import { ShakeSimulator } from "./ShakeSimulator";
import { GAME_CONFIG, PRIZES, type PrizeType } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export function GameContainer() {
    const { permissionState, requestPermission } = usePermission();
    const [hasPlayed, setHasPlayed] = useState(false);
    const [gameState, setGameState] = useState<"idle" | "playing" | "won">("idle");
    const [prize, setPrize] = useState<PrizeType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load played status
    useEffect(() => {
        const savedStatus = localStorage.getItem(GAME_CONFIG.STORAGE_KEY);
        if (savedStatus) {
            setHasPlayed(true);
        }
        setIsLoading(false);
    }, []);

    const handleWin = useCallback(() => {
        // Select random prize
        const totalWeight = PRIZES.reduce((acc, p) => acc + p.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedPrize = PRIZES[PRIZES.length - 1];

        for (const p of PRIZES) {
            if (random < p.weight) {
                selectedPrize = p;
                break;
            }
            random -= p.weight;
        }

        setPrize(selectedPrize);
        setGameState("won");
        setHasPlayed(true);
        localStorage.setItem(GAME_CONFIG.STORAGE_KEY, "true");

        // Effects
        triggerEffects();
    }, []);

    const onShake = useCallback(() => {
        if (gameState !== "playing") return;

        // Vibration feedback on shake
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Shake logic (count can be increased if needed, current config MAX_SHAKE_COUNT=1)
        handleWin();
    }, [gameState, handleWin]);

    const { simulateShake } = useShake({
        enabled: gameState === "playing",
        onShake,
    });

    const triggerEffects = () => {
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
        setGameState("playing");
    };

    // Permission Flow
    const handleRequestPermission = async () => {
        await requestPermission();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-800">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Render Logic
    if (permissionState !== "granted" && permissionState !== "not_supported") {
        return <PermissionScreen onRequestPermission={handleRequestPermission} isSupported={true} permissionState={permissionState} />;
    }

    if (permissionState === "not_supported") {
        // Allow force playing via simulator in PermissionScreen
        return <PermissionScreen onRequestPermission={requestPermission} isSupported={false} permissionState={permissionState} />;
    }

    // ALREADY PLAYED SCREEN
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/assets/bg-pattern.png')] bg-cover bg-center bg-red-700 overflow-hidden relative">
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
                <div className="h-96 flex items-center justify-center w-full">
                    {gameState === 'idle' && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startGame}
                            className="bg-yellow-400 text-red-900 font-bold text-2xl px-10 py-4 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-bounce"
                        >
                            Mở Lì Xì Ngay
                        </motion.button>
                    )}

                    {gameState === 'playing' && (
                        <div className="flex flex-col items-center">
                            <Envelope state="shaking" />
                            <p className="mt-8 text-white/90 animate-pulse text-xl font-medium">
                                Lắc mạnh tay nào! 👋
                            </p>
                        </div>
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
}
