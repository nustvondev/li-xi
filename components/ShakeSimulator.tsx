"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ShakeSimulatorProps = {
    onShake: () => void;
};

export function ShakeSimulator({ onShake }: ShakeSimulatorProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Detect if we are on a desktop (simple check: no touch points or large screen)
    // Or just always show it in specific "dev" env, but since we are client-side only, 
    // let's show it if window.width > 768 or if user wants to play on desktop.
    // The BRD requirement 1 says: "Trong môi trường development: Nếu truy cập bằng trình duyệt desktop, hiển thị button giả lập"
    // Since we are running "next dev", process.env.NODE_ENV is "development".

    useEffect(() => {
        if (process.env.NODE_ENV === "development" && window.innerWidth > 768) {
            setIsVisible(true);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={onShake}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 active:scale-95 transition-all text-sm font-mono border border-gray-600"
            >
                [DEV] Simulate Shake
            </button>
        </div>
    );
}
