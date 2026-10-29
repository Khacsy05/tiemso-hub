# Tiệm Số Hub (All-in-One Business Toolkit)
> **Trợ lý số cho Người kinh doanh cá nhân & Shop online**  
> Giải pháp công cụ thực chiến dành riêng cho chủ shop online, hộ kinh doanh nhỏ lẻ, freelancer và người bán hàng tự do.

---

## 🎯 Đối tượng phục vụ
- **Chủ shop online** (Shopee, TikTok Shop, Lazada, Facebook, Instagram...)
- **Hộ kinh doanh cá thể / tiệm nhỏ** (quán ăn, cafe, tiệm nail/spa, cửa hàng bán lẻ...)
- **Freelancer & Người bán hàng tự do**

---

## 📦 Danh Sách Tính Năng Theo Module

### Module 1: Thanh toán & Bán hàng tại quầy (Payment & POS Tools)
1. **Tạo mã VietQR động chuyên nghiệp:**
   - Chọn ngân hàng (kèm logo chính thức), nhập STK, số tiền và nội dung chuyển khoản.
   - **Tùy chỉnh khung in ấn:** Chọn template khung đứng (Standee để bàn quầy thu ngân), chèn tên shop, logo hoặc số hotline vào giữa mã QR.
   - Xuất file ảnh nét (PNG/PDF) theo kích thước chuẩn A6/A5 để mang đi in ngay.
2. **Tạo QR Menu / Bảng giá / Wifi:**
   - Nhập danh sách 5–10 món/dịch vụ chính kèm giá tiền để khách quét xem nhanh trên điện thoại.
   - **Tích hợp mã QR kết nối nhanh Wifi của cửa hàng** (quét là vào mạng, không cần hỏi mật khẩu).

---

### Module 2: Tài chính, Giá vốn & Lợi nhuận (Pricing & Profit Calculator)
1. **Tính giá bán mục tiêu (Markup & Margin Calculator):**
   - Nhập: Giá nhập hàng + Chi phí đóng gói + Phí vận chuyển + Chi phí quảng cáo dự tính.
   - Nhập % tỷ suất lợi nhuận mong muốn $\rightarrow$ Tự động tính ra **Giá bán niêm yết tối thiểu** để không bị lỗ.
2. **Tính phí sàn Thương mại điện tử (Shopee, TikTok Shop, Lazada):**
   - Người bán nhập giá bán dự kiến $\rightarrow$ Web tự động trừ các loại phí sàn hiện hành (phí thanh toán 4-5%, phí cố định, phí freeship extra, thuế sàn giữ lại).
   - **Con số thực tế:** Số tiền thực nhận về ví sau khi trừ hết chi phí.
3. **Tính điểm hòa vốn (Break-even Analysis):**
   - Nhập chi phí cố định mỗi tháng (tiền mặt bằng, tiền điện thoại, internet, công cụ...) và biên lợi nhuận trên từng sản phẩm.
   - Web tính ra: Mỗi tháng phải bán được tối thiểu bao nhiêu đơn hàng/sản phẩm thì bắt đầu có lãi.

---

### Module 3: Thuế & Pháp lý cho Hộ kinh doanh (Tax & Invoice Tools)
1. **Tính thuế khoán / Thuế kinh doanh Online:**
   - Chọn ngành nghề kinh doanh (Phân phối hàng hóa, dịch vụ ăn uống, vận tải, gia công phần mềm...).
   - Nhập doanh thu tháng/năm $\rightarrow$ Tự động tính thuế Giá trị gia tăng (GTGT) và thuế Thu nhập cá nhân (TNCN) theo tỷ lệ phần trăm quy định hiện hành.
   - Đưa ra cảnh báo rõ ràng: **Dưới ngưỡng 100 triệu/năm được miễn thuế**.
2. **Tạo hóa đơn bán lẻ / Phiếu thu nhanh (Receipt/Invoice Generator):**
   - Điền tên khách, danh sách món, số lượng, đơn giá, chiết khấu.
   - Bấm nút **"Xuất hóa đơn"** $\rightarrow$ Xuất ra file PDF hoặc ảnh phiếu thanh toán gọn gàng để gửi cho khách qua Zalo/Facebook Messenger.

---

### Module 4: Tiện ích Vận hành & Chăm sóc khách hàng (Customer Ops)
1. **Tạo link Zalo / WhatsApp / Hotline 1-chạm:**
   - Nhập số điện thoại và nội dung soạn sẵn (ví dụ: *"Chào shop, mình muốn tư vấn sản phẩm X"*).
   - Web tạo ra đường link rút gọn dạng `zalo.me/...` để chủ shop gắn vào bio TikTok/Facebook, khách bấm vào là tự mở khung chat với tin nhắn mồi sẵn.
2. **Bộ mẫu kịch bản nhắn tin (Script Template):**
   - Tổng hợp các mẫu tin nhắn chuẩn: Chào khách, xin lỗi khi đơn chậm, nhắc khách đánh giá 5 sao, thông báo lịch nghỉ Tết/lễ.
   - Người dùng chỉ cần bấm 1 nút **"Copy"** là dán thẳng vào tin nhắn khách hàng.

---

## 🏛️ Cấu Trúc Thiết Kế Trang Web (Site Architecture)

Hệ thống được thiết kế theo giao diện SaaS dashboard gọn nhẹ:

```plaintext
Trang Chủ (Dashboard)
├── Menu Sidebar bên trái:
│   ├── [1] Tạo mã VietQR Standee
│   ├── [2] Tính phí sàn & Giá bán
│   ├── [3] Bảng tính Thuế kinh doanh
│   ├── [4] Tạo hóa đơn bán lẻ PDF
│   └── [5] Tạo link Zalo / Script chat
└── Khung hiển thị công cụ ở giữa:
    (Bấm vào menu bên trái thì load giao diện công cụ tương ứng sang bên phải)
```

---

## ⚡ Ưu Điểm Công Nghệ & Chi Phí Vận Hành

- **Toàn bộ xử lý tại Frontend (Client-side):**
  - Tính toán thuế, tính phí sàn chỉ là các hàm toán học JavaScript cơ bản.
  - Tạo VietQR dùng API mở ([https://api.vietqr.io/v2/generate](https://api.vietqr.io/v2/generate)) hoặc thư viện QR code client-side.
  - Xuất hóa đơn/mã QR thành ảnh/PDF dùng Canvas và lệnh `window.print()`.
- **Lưu trữ miễn phí:** Toàn bộ thông tin cá nhân của chủ shop (tên shop, STK ngân hàng, màu sắc) lưu thẳng vào `localStorage` của trình duyệt. Mở web ra là thông tin còn nguyên mà không cần database.
- **Chi phí vận hành: 0 VNĐ:** Deploy trên Vercel, Cloudflare Pages hoặc GitHub Pages vĩnh viễn, chịu tải hàng chục nghìn lượt truy cập mỗi ngày.
