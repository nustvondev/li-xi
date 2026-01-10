Bạn là một Senior Frontend Engineer và UX Engineer.
Hãy xây dựng mini game “Lắc Lì Xì” chạy trên Mobile Web với các yêu cầu sau:

========================
1. Công nghệ & nền tảng
========================
- Framework: Next.js v16 (App Router)
- Không sử dụng Backend (logic client-side)
- Hỗ trợ Mobile Web (trình duyệt trên điện thoại)
- Trong môi trường development:
  - Nếu truy cập bằng trình duyệt desktop, hiển thị button giả lập hành động lắc (config-driven, không hardcode)
- Animation mượt, đẹp, ưu tiên Framer Motion
- Không dùng canvas hoặc Three.js

========================
2. Permission & thiết bị
========================
- Sử dụng:
  - DeviceMotionEvent
  - DeviceOrientationEvent
- Khi người dùng truy cập:
  1. Trình duyệt yêu cầu cấp quyền truy cập cảm biến
  2. Nếu người dùng từ chối:
     - Hiển thị màn hình chờ
     - Không cho phép chơi game
     - Không cho phép lắc
  3. Nếu người dùng đồng ý:
     - Cho phép chuyển sang màn hình game
- Lưu ý đặc biệt:
  - Với iOS, DeviceMotionEvent.requestPermission() bắt buộc phải được gọi trong user interaction (onClick)
  - Nếu không có quyền, hệ thống phải tự động disable shake detection

========================
3. Luồng nghiệp vụ chính
========================
1. Người dùng truy cập Mobile Web
2. Hệ thống yêu cầu cấp quyền cảm biến
3. Nếu được cấp quyền:
   - Hiển thị giao diện lì xì
   - Hiển thị nút “Bắt đầu”
4. Người dùng nhấn “Bắt đầu”
5. Màn hình xuất hiện nhiều bao lì xì:
   - Ban đầu đứng yên
   - Có hiệu ứng chờ nhẹ (idle animation)
6. Người dùng bắt đầu lắc điện thoại:
   - Bao lì xì rung theo mức độ lắc
   - Có cộng hưởng theo gia tốc
7. Khi đạt ngưỡng lắc:
   - Chọn ngẫu nhiên 1 bao lì xì trúng
   - Bao lì xì trúng:
     - Nhảy bật lên
     - Mở ra
     - Hiển thị mệnh giá + lời chúc
8. Kết thúc game:
   - Người dùng chỉ được chơi 1 lần mỗi browser (lưu bằng localStorage hoặc sessionStorage)

========================
4. Hiệu ứng & trải nghiệm (UX Enhancement)
========================
- 🔊 Sound effect:
  - Có hiệu ứng âm thanh khi lắc và khi trúng
  - Mặc định MUTE
  - Cho phép bật/tắt
- 📳 Vibration API:
  - Sử dụng rung khi trúng (ưu tiên Android)
  - Nếu thiết bị không hỗ trợ → bỏ qua, không crash
- 🧧 Bao lì xì:
  - Idle → rung → nhảy → mở
  - Animation mượt, không quá nhanh
- 🎉 Confetti:
  - Nhẹ, tinh tế
  - Chỉ xuất hiện khi trúng lì xì
  - Tự động biến mất

========================
5. Random lì xì
========================
- Random client-side
- Dữ liệu cấu hình dạng:
  - Mệnh giá
  - Lời chúc
  - Trọng số (weight)
- Không hardcode trong component
- Random chỉ được gọi 1 lần khi trúng

========================
6. Kỹ thuật detect shake
========================
- Dựa trên gia tốc (accelerationIncludingGravity)
- Có:
  - Threshold
  - Debounce
  - Cooldown
- Tránh false-positive (rung nhẹ không được tính)
- Chỉ detect shake khi:
  - Đã được cấp quyền
  - Người dùng đã nhấn “Bắt đầu”
  - Chưa trúng lì xì

========================
7. Clean architecture
========================
- Tách rõ:
  - Hook xử lý permission
  - Hook detect shake
  - Component hiển thị UI
  - Config cho game & random
- Code clean, dễ mở rộng
- Không nhét logic vào UI component

========================
8. Output mong muốn
========================
- Đề xuất kiến trúc thư mục
- Giải thích flow hoạt động
- Code mẫu cho:
  - Xin permission
  - Detect shake
  - Animation bao lì xì
  - Confetti + sound + vibration
- Ưu tiên trải nghiệm người dùng, tránh lag, tránh crash


------------
Hình ảnh phong bì lì xì: ./public/assets/envelope.svg
Tạm thòi chưa có âm thanh, nên bỏ qua phần sound effect