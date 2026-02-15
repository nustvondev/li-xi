export type PrizeType = {
    id: string;
    amount: number;
    message?: string;
    weight: number; // Tỷ lệ xuất hiện
};

export const GAME_CONFIG = {
    SHAKE_THRESHOLD: 15, // Ngưỡng gia tốc để tính là lắc
    SHAKE_DEBOUNCE: 1000, // Thời gian chờ giữa các lần detect lắc (ms)
    MAX_SHAKE_COUNT: 1, // Số lần lắc cần thiết để trúng (hiện tại set là 1 cho nhanh trúng)
    STORAGE_KEY: "lixi_played_status", // Key lưu trạng thái đã chơi
    UNLIMITED_PLAY: true, // Cho phép chơi nhiều lần (Dev mode)
};

export const WISHES = [
    "Vạn sự như ý - Tỷ sự như mơ",
    "An khang thịnh vượng - Vạn đại thành công",
    "Phát tài phát lộc - Tiền vô xối xả",
    "Tiền vô như nước - Tiền ra nhỏ giọt",
    "Sức khỏe dồi dào - Bệnh tật tiêu tan",
    "Công thành danh toại - Sự nghiệp thăng hoa",
    "Gia đạo bình an - Hạnh phúc viên mãn",
    "Cung hỷ phát tài - Tấn tài tấn lộc",
    "Niên niên hữu dư - Cả năm sung túc",
    "Phúc lộc thọ toàn - Vinh hoa phú quý",
    "Mã đáo thành công - Đánh đâu thắng đó",
    "Khai xuân đại thắng - Cả năm phát tài",
    "Tình duyên phơi phới - Hạnh phúc ngập tràn",
    "Lộc biếc mai vàng - Xuân sang hoan hỉ",
    "Xuân sang đắc lộc - Tết đến an khang",
    "Túi rủng rỉnh tiền - Cả năm may mắn",
    "Buôn may bán đắt - Một vốn bốn lời",
    "Sự nghiệp lên hương - Lương thưởng ngập két",
    "Lộc lá quanh năm - Bình an trọn đời",
    "Xuân này hơn hẳn mấy xuân qua - Phúc lộc đưa nhau đến từng nhà"
];

export const PRIZES: PrizeType[] = [
    { id: "p1", amount: 10000, weight: 50 },
    { id: "p2", amount: 20000, weight: 35 },
    { id: "p3", amount: 50000, weight: 12 },
    { id: "p4", amount: 100000, weight: 3 },
];
