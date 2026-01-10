import { useState, useEffect, useCallback, useRef } from "react";
import { GAME_CONFIG } from "@/lib/constants";

type UseShakeProps = {
    enabled: boolean;
    onShake: () => void;
};

export function useShake({ enabled, onShake }: UseShakeProps) {
    const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
    const lastShakeTime = useRef<number>(0);
    const onShakeRef = useRef(onShake);

    // Keep ref updated to avoid stale closures in event listener
    useEffect(() => {
        onShakeRef.current = onShake;
    }, [onShake]);

    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        if (!enabled) return;

        const { accelerationIncludingGravity } = event;
        if (!accelerationIncludingGravity) return;

        const x = accelerationIncludingGravity.x || 0;
        const y = accelerationIncludingGravity.y || 0;
        const z = accelerationIncludingGravity.z || 0;

        setAcceleration({ x, y, z });

        // Calculate total acceleration magnitude (subtracting gravity roughly if needed, 
        // but accelerationIncludingGravity usually roughly 9.8 when still. 
        // Quick shake has high delta.)
        // A simple robust shake detection often looks at the magnitude of the vector.
        // Ideally we remove gravity (9.8), but raw changes are enough for a "shake".

        // Simple algorithm: check if total acceleration is significantly different from 1g (~9.8m/s^2)
        // or just check against a high threshold like 15-20 (since 1g is ~10)
        // GAME_CONFIG.SHAKE_THRESHOLD is set to 15.

        // Magnitude = sqrt(x^2 + y^2 + z^2)
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        // If phone is standard, magnitude is ~9.8.
        // If shaken, it spikes.
        if (magnitude > GAME_CONFIG.SHAKE_THRESHOLD) {
            const now = Date.now();
            if (now - lastShakeTime.current > GAME_CONFIG.SHAKE_DEBOUNCE) {
                lastShakeTime.current = now;
                onShakeRef.current();
            }
        }
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener("devicemotion", handleMotion);
        return () => {
            window.removeEventListener("devicemotion", handleMotion);
        };
    }, [enabled, handleMotion]);

    // Public method to simulate shake (for desktop)
    const simulateShake = useCallback(() => {
        onShakeRef.current();
    }, []);

    return {
        acceleration,
        simulateShake
    };
}
