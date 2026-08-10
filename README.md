# 🎒 EdTech Pre-Primary Platform (Dành cho Học Sinh Tiền Tiểu Học 5-6 Tuổi)

Hệ thống quản lý học tập, học liệu, bài tập tương tác và trò chơi phát triển tư duy dành cho trẻ mẫu giáo lớn & tiền tiểu học (5-6 tuổi). Được xây dựng với **React (Vite)**, **TailwindCSS**, kết nối cơ sở dữ liệu **Supabase**, và sẵn sàng deploy lên **Vercel**.

---

## ✨ Tính Năng Nổi Bật

### 1. Phân Quyền Người Dùng (3 Roles)
- **Quản trị viên (Admin)**:
  - Quản lý toàn bộ người dùng, chuyển đổi vai trò (Roles) linh hoạt (Admin / Teacher / Student).
  - Quản lý kho học liệu, các lớp học và theo dõi nhật ký hoạt động hệ thống (**System Audit Logs**).
- **Giáo viên (Teacher)**:
  - Tạo và quản lý lớp học, cấp mã tham gia lớp (Join Code).
  - Tải lên học liệu (PDF, PPTX, DOCX, MP4) phân loại theo môn học và độ tuổi.
  - Giao bài tập Toán & Tiếng Việt, khởi tạo trò chơi tương tác cho học sinh.
  - Thêm / Import danh sách học sinh vào lớp.
- **Học sinh (Student - 5-6 tuổi)**:
  - Giao diện rực rỡ, trực quan, sử dụng biểu tượng, nút bấm lớn và **giọng đọc cô giáo (Voice Speech Synthesis)** hỗ trợ trẻ chưa biết đọc chữ.
  - Tích lũy điểm sao vàng (Star Rewards) và xem danh hiệu học tập.

### 2. Các Dạng Bài Tập Toán & Tiếng Việt (5-6 Tuổi)
- **🧮 Bài Tập Toán Học**:
  - **Tách gộp số**: Tách số 5 thành (2 và 3), gộp quả dâu/quả táo trực quan.
  - **Điền số còn thiếu**: Chuỗi số 1, 2, ?, 4, 5.
  - **Tìm số & Đếm số**: Đếm số chú gấu, thỏ, bóng bay.
  - **Tìm quy luật**: Nhận biết chuỗi hình lặp lại 🔴 🔵 🔴 🔵 ?.
- **📖 Tiếng Việt Luyện Đọc**:
  - **Bảng chữ cái tương tác**: Nhấp vào từng chữ cái để nghe phát âm chuẩn và xem hình minh họa (A - Quả Táo 🍎, B - Búp Bê 🧸,...).
  - **Tập ghép vần & đánh vần**: Ghép âm đầu + vần (b + a = ba, c + a = ca, m + ẹ = mẹ).
  - **Luyện đọc từ & câu ngắn**: Đọc từ có hình ảnh kèm giọng đọc audio sinh động.

### 3. Trò Chơi Giáo Dục & Trò Chơi Tư Duy
- **🧠 Trò chơi phát triển tư duy (Logic Mind Game)**:
  - Tìm hình khác nhóm (Odd One Out).
  - Nhận biết kích thước To / Nhỏ (Size Sorting).
  - Phân biệt phương tiện giao thông (Road / Sky / Sea).
- **🎮 Trò chơi củng cố kiến thức**:
  - Lật hình tìm cặp (Memory Matching Game).
  - Thử thách đếm & phản xạ tính nhanh (Math Speed Challenge).
  - Trắc nghiệm trực quan (Interactive Visual Quiz).

---

## 🗄️ Hướng Dẫn Kết Nối Supabase (Cơ Sở Dữ Liệu Thực)

### Bước 1: Tạo dự án Supabase
1. Truy cập [https://supabase.com](https://supabase.com) và tạo một dự án mới (New Project).
2. Lấy thông tin **Project URL** và **Anon Key** tại mục **Project Settings -> API**.

### Bước 2: Chạy file SQL tạo Schema & Row Level Security (RLS)
1. Mở mục **SQL Editor** trong bảng điều khiển Supabase Dashboard.
2. Tạo một Query mới và dán toàn bộ nội dung từ file [`supabase/schema.sql`](file:///f:/battapthuchanh/supabase/schema.sql).
3. Nhấn **RUN** để khởi tạo tự động các bảng:
   - `profiles` (Người dùng)
   - `classes` & `class_members` (Lớp học & Học sinh)
   - `materials` & `material_assignments` (Kho học liệu)
   - `exercises` & `exercise_submissions` (Bài tập & Lời giải)
   - `games` & `game_results` (Game & Kết quả chơi)
   - `system_logs` (Nhật ký audit hệ thống)
   - Tự động kích hoạt Trigger `on_auth_user_created` tự động lưu thông tin user khi Đăng ký Auth.

### Bước 3: Cấu hình Storage Bucket
1. Vào **Storage -> Create New Bucket**: đặt tên bucket là `materials`.
2. Bật chế độ **Public Bucket = ON** để người dùng có thể mở/tải tài liệu học tập.

### Bước 4: Thêm Biến Môi Trường (Env Variables)
Tạo file `.env.local` ở thư mục gốc dự án:
```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## 🚀 Hướng Dẫn Deploy Lên Vercel

1. Đưa mã nguồn lên GitHub/GitLab.
2. Truy cập [https://vercel.com](https://vercel.com) -> chọn **Add New Project**.
3. Import repository từ GitHub.
4. Tại phần **Environment Variables**, thêm 2 biến:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Nhấn **Deploy**. Vercel sẽ tự động build và cung cấp đường dẫn web live thành công!
