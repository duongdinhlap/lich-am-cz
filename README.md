# Lịch Âm CZ – Lịch Vạn Niên Việt Nam

Static website / PWA (HTML + CSS + JS, no build step needed).

## Cấu trúc
- `index.html` – trang chính (4 tab: Hôm nay · Lịch năm · Đổi ngày · Ngày lễ)
- `assets/js/lunar.js` – thuật toán Hồ Ngọc Đức (UTC+7), Can Chi, giờ hoàng đạo, tiết khí, thập nhị trực
- `assets/js/app.js` – giao diện, ngày lễ, bộ đổi ngày, PWA
- `assets/css/style.css` – giao diện (mobile-first)
- `manifest.webmanifest`, `sw.js` – cấu hình PWA, chạy ngoại tuyến
- `icons/` – biểu tượng app; tạo lại bằng `node tools/make-icons.js` (cần Playwright)

## Chạy thử
    python3 -m http.server 8080   # mở http://localhost:8080

## Đưa lên mạng
Tải toàn bộ thư mục lên hosting tĩnh có **HTTPS** (Netlify, Vercel, GitHub Pages, Cloudflare Pages…).
PWA chỉ cài được qua HTTPS.

- **iPhone:** mở bằng Safari → Chia sẻ → “Thêm vào MH chính” → app tên “Lịch Âm CZ”, chạy toàn màn hình.
- **Android:** Chrome sẽ hiện nút “Cài app” / “Thêm vào màn hình chính”.

Khi cập nhật mã, đổi `VERSION` trong `sw.js` để người dùng nhận bản mới.
