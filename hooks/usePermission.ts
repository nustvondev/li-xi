import { useState, useCallback } from "react";

type PermissionState = "idle" | "granted" | "denied" | "not_supported";

export function usePermission() {
    const [permissionState, setPermissionState] = useState<PermissionState>("idle");

    const requestPermission = useCallback(async () => {
        if (typeof window === "undefined") return;

        // Feature detection
        if (!("DeviceMotionEvent" in window)) {
            setPermissionState("not_supported");
            return;
        }

        // iOS 13+ requires explicit permission request
        // @ts-ignore - requestPermission is non-standard but exists on iOS
        if (typeof DeviceMotionEvent.requestPermission === "function") {
            try {
                // @ts-ignore
                const permission = await DeviceMotionEvent.requestPermission();
                if (permission === "granted") {
                    setPermissionState("granted");
                } else {
                    setPermissionState("denied");
                    alert("Quyền truy cập bị từ chối (Denied).");
                }
            } catch (error) {
                console.error("Error asking permission:", error);
                // Detect specifically if it's due to HTTP
                if (window.location.protocol !== "https:") {
                    alert("LỖI: Bạn đang chạy trên HTTP. iOS/Android yêu cầu HTTPS để dùng cảm biến lắc. Vui lòng deploy lên Vercel hoặc dùng ngrok.");
                } else {
                    alert("Lỗi khi xin quyền: " + error);
                }
                setPermissionState("denied");
            }
        } else {
            // Non-iOS 13+ detection fallback
            // Check protocol for Android
            if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
                alert("CẢNH BÁO: Bạn đang chạy trên HTTP thông qua IP LAN. Android/Chrome có thể chặn cảm biến lắc. Hãy thử Chrome Flags hoặc dùng HTTPS.");
            }
            setPermissionState("granted");
        }
    }, []);

    return {
        permissionState,
        requestPermission,
    };
}
