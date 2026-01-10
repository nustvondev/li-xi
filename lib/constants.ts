export type PrizeType = {
    id: string;
    amount: number;
    message: string;
    weight: number; // Tỷ lệ xuất hiện
};

export const GAME_CONFIG = {
    SHAKE_THRESHOLD: 15, // Ngưỡng gia tốc để tính là lắc
    SHAKE_DEBOUNCE: 1000, // Thời gian chờ giữa các lần detect lắc (ms)
    MAX_SHAKE_COUNT: 1, // Số lần lắc cần thiết để trúng (hiện tại set là 1 cho nhanh trúng)
    STORAGE_KEY: "lixi_played_status", // Key lưu trạng thái đã chơi
    UNLIMITED_PLAY: true, // Cho phép chơi nhiều lần (Dev mode)
};

export const PRIZES: PrizeType[] = [
    { id: "p1", amount: 10000, message: "Lộc đầu năm! Vạn sự như ý!", weight: 30 },
    { id: "p2", amount: 20000, message: "Tiền vô như nước, tiền ra nhỏ giọt!", weight: 20 },
    { id: "p3", amount: 50000, message: "Năm mới phát tài, phát lộc!", weight: 10 },
    { id: "p4", amount: 100000, message: "Đại gia đây rồi! Chúc mừng!", weight: 5 },
    { id: "p5", amount: 1000, message: "Lì xì lấy hên! Chúc vui vẻ!", weight: 35 },
];
