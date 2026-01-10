"use client";

import { motion } from "framer-motion";

type PermissionScreenProps = {
    onRequestPermission: () => void;
    isSupported: boolean;
    permissionState: "idle" | "granted" | "denied" | "not_supported";
};

export function PermissionScreen({ onRequestPermission, isSupported, permissionState }: PermissionScreenProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-red-600 to-red-800 text-white p-6 text-center space-y-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm"
            >
                <h1 className="text-4xl font-bold font-serif text-yellow-300 mb-4 drop-shadow-md">
                    Lắc Lì Xì 2025
                </h1>
                <p className="text-lg text-white/90 max-w-xs mx-auto mb-8">
                    Lắc điện thoại để nhận ngay lộc đầu năm!
                </p>

                {!isSupported ? (
                    <div className="p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                        <p className="text-yellow-200">
                            Thiết bị của bạn không hỗ trợ cảm biến chuyển động hoặc đang chạy trên máy tính không có giả lập.
                        </p>
                        <button
                            onClick={onRequestPermission} // Allow trying anyway (e.g. for simulator)
                            className="mt-4 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-red-800 font-bold rounded-full shadow-lg transition-transform active:scale-95"
                        >
                            Vào chơi thử (Simulator)
                        </button>
                    </div>
                ) : permissionState === "denied" ? (
                    <div className="p-6 bg-red-900/80 rounded-xl backdrop-blur-md border border-yellow-400/30 shadow-2xl space-y-4">
                        <div className="text-3xl">⚠️</div>
                        <h3 className="text-xl font-bold text-yellow-300">Cần cấp quyền</h3>
                        <p className="text-white/80 text-sm">
                            Bạn đã từ chối quyền cảm biến. Để chơi game, vui lòng tải lại trang và chọn "Cho phép" (Allow) khi được hỏi.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-4 py-3 bg-yellow-400 text-red-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors shadow-lg animate-pulse"
                        >
                            ↻ Tải lại trang
                        </button>
                        <div className="text-xs text-white/40 pt-2 border-t border-white/10">
                            <p>Hoặc kiểm tra cài đặt quyền riêng tư:</p>
                            <p className="mt-1">Settings {'>'} Safari {'>'} Motion & Orientation Access</p>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={onRequestPermission}
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-red-900 transition-all duration-200 bg-yellow-400 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-pulse"
                    >
                        Bắt đầu ngay
                        <div className="absolute -inset-3 rounded-xl bg-yellow-400 opacity-20 group-hover:opacity-40 blur-lg transition duration-200" />
                    </button>
                )}
            </motion.div>

            {permissionState !== "denied" && (
                <p className="text-xs text-white/50 absolute bottom-4">
                    *Yêu cầu cấp quyền truy cập cảm biến chuyển động
                </p>
            )}
        </div>
    );
}
