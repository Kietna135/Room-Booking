# 🎓 Campus Study Room Booking App
### Ứng Dụng Đặt Phòng Học Thông Minh & Hiệu Năng Cao (React Native & Expo)

Ứng dụng đặt phòng học trong khuôn viên trường đại học đạt chuẩn **Mini-Project 2**, được xây dựng với **React Native & Expo**, quản lý trạng thái toàn cầu bằng **Zustand**, tối ưu hóa giao diện danh sách cuộn **60 FPS với FlatList**, tích hợp **thuật toán ngăn ngừa xung đột lịch đặt (Conflict Prevention Engine)** và **hệ thống thông báo cục bộ (Expo Notifications)** nhắc nhở 15 phút trước giờ học.

---

## 🚀 Các Tính Năng Nổi Bật (Core Functional Specifications)

### 1. 🔍 Khám Phá Phòng Học & Bộ Lọc Đa Thông Số
- **Danh sách FlatList hiệu năng cao (60 FPS)**: Hiển thị 16+ phòng học thuộc 4 tòa nhà (**Tòa A - AI & Tech, Tòa B - Thư viện Trung tâm, Tòa C - Creative & Media, Tòa V - Venture Hub**).
- **Bộ lọc đa thông số**:
  - **Tòa nhà**: Tòa A, Tòa B, Tòa C, Tòa V hoặc Toàn campus.
  - **Sức chứa**: Nhóm nhỏ (2–4 SV), Nhóm vừa (5–8 SV), Nhóm lớn (9–15 SV), Hội thảo (16–20 SV).
  - **Thiết bị & Tiện ích**: Máy chiếu 4K/TV, Bảng trắng lớn, Máy tính cấu hình cao RTX, Điều hòa 2 chiều, Cách âm tiêu chuẩn, Hệ thống Họp Online Hybrid.
  - **Trạng thái thời gian thực (Live Real-time Status)**: Lọc tức thì phòng `🟢 Còn trống ngay (Available Now)` và `🔴 Đang có người (Occupied)` theo khung giờ hiện tại.

### 2. ⏱️ Công Cụ Chọn Khung Giờ & Xử Lý Xung Đột (Conflict Prevention)
- **Thanh chọn ngày trực quan trong 7 ngày tới**: Hiển thị thứ, ngày, tháng và đánh dấu ngày hôm nay.
- **Lưới 6 khung giờ riêng biệt 2 tiếng**:
  - `Ca 1`: 07:30 – 09:30 (Sáng sớm)
  - `Ca 2`: 09:30 – 11:30 (Sáng chính)
  - `Ca 3`: 13:00 – 15:00 (Chiều đầu)
  - `Ca 4`: 15:00 – 17:00 (Chiều muộn)
  - `Ca 5`: 17:30 – 19:30 (Tối sớm)
  - `Ca 6`: 19:30 – 21:30 (Tối muộn)
- **Ngăn ngừa xung đột trực quan (Visual Conflict Prevention)**:
  - Khung giờ đã được sinh viên khác đặt sẽ bị **vô hiệu hóa tức thì (Locked/Disabled)** kèm thông tin người giữ chỗ.
  - Khung giờ người dùng hiện tại đã đặt ở phòng khác sẽ có huy hiệu **cảnh báo trùng ca (Conflict Warning)** nhằm tránh tình trạng một sinh viên giữ nhiều phòng cùng lúc.
- **Mã đặt chỗ duy nhất & Thẻ QR điện tử**:
  - Tự động sinh mã `BK-XXXXXX`.
  - Thẻ vào phòng kỹ thuật số tích hợp mã QR chất lượng cao (`react-native-qrcode-svg`) hỗ trợ quét mã nhận phòng (Check-in).

### 3. 🔐 Hệ Thống Xác Thực & Quản Lý Phiên (Authentication & Registration)
- **Màn hình Đăng nhập & Đăng ký chuyên nghiệp** ([`AuthScreen.tsx`](file:///e:/Danentang/BTDanentang/React-Native/src/screens/AuthScreen.tsx)):
  - **Đăng nhập**: Đăng nhập bằng Mã số sinh viên (MSSV) hoặc Email trường cùng mật khẩu bảo mật (hỗ trợ ẩn/hiện mật khẩu).
  - **Đăng ký tài khoản**: Đăng ký sinh viên mới với Họ tên, MSSV, Email, Khoa/Viện đào tạo và Mật khẩu xác nhận.
  - **Đăng nhập 1-chạm (Quick Demo Login)**: Cho phép chuyển đổi nhanh 3 tài khoản sinh viên mẫu (*Nguyễn Văn An*, *Trần Thị Mai*, *Lê Hoàng Đức*) để kiểm tra bài toán xung đột lịch tức thì.
  - **Đăng xuất tài khoản**: Nút đăng xuất tại tab Hồ sơ SV với hộp thoại xác nhận an toàn.

### 4. 🧠 Quản Lý Trạng Thái Toàn Cầu Với Zustand
- Quản lý phiên người dùng (`useBookingStore`), danh sách phòng, các bộ lọc đang hoạt động, và lịch sử đặt chỗ.
- Lưu trữ bền vững (`AsyncStorage`) qua middleware `persist` của Zustand, đảm bảo dữ liệu phòng đã đặt và phiên đăng nhập không bị mất khi đóng ứng dụng.

### 5. 🔔 Thông Báo Cục Bộ (Local Notifications)
- Tích hợp `expo-notifications`:
  - **Thông báo xác nhận tức thì**: Gửi thông báo đẩy khi hoàn tất giữ chỗ phòng học.
  - **Lên lịch nhắc nhở 15 phút**: Tự động kích hoạt thông báo nhắc nhở sinh viên đến nhận phòng 15 phút trước giờ bắt đầu ca học.
  - **Tự động hủy thông báo**: Khi người dùng bấm hủy ca học, lịch nhắc nhở tương ứng trên thiết bị sẽ tự động được thu hồi.

---

## ⚡ Kỹ Thuật Tối Ưu Hóa FlatList 60 FPS

| Kỹ thuật | Cách triển khai trong mã nguồn | Lợi ích hiệu năng |
|---|---|---|
| **`React.memo` & Custom Comparator** | Đóng gói thẻ `RoomCard` với hàm so sánh `(prev, next)` | Ngăn chặn việc re-render lại toàn bộ thẻ khi chỉ có 1 phần tử thay đổi |
| **`getItemLayout`** | Khai báo kích thước thẻ cố định `ROOM_CARD_HEIGHT + MARGIN` | Bỏ qua bước đo đạc layout động (dynamic measurement), tăng tốc cuộn tức thì |
| **`useCallback` Handlers** | Bọc `renderItem`, `keyExtractor`, `onSelectRoom` trong `useCallback` | Tránh tạo các function tham chiếu mới ở mỗi lần re-render của HomeScreen |
| **`windowSize={5}`** | Giới hạn số lượng trang view được render xung quanh viewport | Giảm tiêu hao bộ nhớ RAM khi danh sách phòng dài |
| **`maxToRenderPerBatch={7}`** | Kiểm soát số lượng item render trong một batch chuyển cảnh | Đảm bảo JS Thread không bị nghẽn (Drop Frames) khi người dùng cuộn nhanh |
| **`removeClippedSubviews={true}`** | Giải phóng bộ nhớ native cho các item nằm ngoài vùng nhìn thấy | Tiết kiệm GPU/CPU trên Android và iOS |

---

## 🛠️ Cài Đặt & Khởi Chạy Ứng Dụng

### Yêu Cầu Môi Trường
- **Node.js**: >= v18.0.0
- **Expo Go App** (trên điện thoại iOS hoặc Android) hoặc Trình duyệt Web

### Các Bước Thực Hiện

1. **Cài đặt các gói phụ thuộc (Dependencies)**:
   ```bash
   npm install
   ```

2. **Khởi chạy ứng dụng với Expo**:
   ```bash
   npm start
   ```

3. **Chạy trên thiết bị thật (Expo Go)**:
   - Mở ứng dụng **Expo Go** trên điện thoại (quét mã QR hiển thị trên Terminal).
   
4. **Chạy trên Web Browser**:
   ```bash
   npm run web
   ```

5. **Chạy trên Android Emulator / iOS Simulator**:
   ```bash
   npm run android
   # hoặc
   npm run ios
   ```

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```
React-Native/
 ├── App.tsx                      # Root component với SafeAreaProvider
 ├── app.json                     # Cấu hình Expo, permissions, notifications
 ├── package.json                 # Dependencies (Zustand, Notifications, SVG...)
 ├── src/
 │    ├── components/             # Reusable UI components tối ưu
 │    │    ├── Badge.tsx          # Memoized Badge component
 │    │    ├── RoomCard.tsx       # 60 FPS Memoized Room Card (fixed layout)
 │    │    ├── FilterHeader.tsx   # Search, building tabs, status chips
 │    │    ├── FilterModal.tsx    # Multi-parameter capacity & amenities filter
 │    │    ├── TimeSlotGrid.tsx   # 7-day strip + 6 distinct 2h slots grid
 │    │    ├── BookingConfirmModal.tsx # Form xác nhận & bắt lỗi xung đột
 │    │    ├── QRCodeModal.tsx    # Thẻ vào phòng QR & mô phỏng Check-in
 │    │    └── UserSwitcherModal.tsx # Chuyển đổi tài khoản demo test xung đột
 │    │
 │    ├── data/
 │    │    └── mockRooms.ts       # 16 phòng học chi tiết, người dùng & lịch mẫu
 │    │
 │    ├── navigation/
 │    │    └── MainNavigator.tsx  # Bottom tabs navigation & transition flows
 │    │
 │    ├── screens/
 │    │    ├── HomeScreen.tsx     # Màn hình khám phá phòng (60 FPS FlatList)
 │    │    ├── RoomDetailScreen.tsx # Chi tiết phòng & lưới chọn ca học
 │    │    ├── MyBookingsScreen.tsx # Quản lý lịch đặt, hủy và mở thẻ QR
 │    │    └── ProfileScreen.tsx  # Hồ sơ sinh viên, thống kê & cài đặt
 │    │
 │    ├── services/
 │    │    └── notificationService.ts # Service xử lý Expo Local Notifications
 │    │
 │    ├── store/
 │    │    └── useBookingStore.ts # Zustand Store toàn cầu + Conflict Engine + Persistence
 │    │
 │    ├── theme/
 │    │    └── colors.ts          # Bộ màu chuẩn Smart Campus hiện đại
 │    │
 │    ├── types/
 │    │    └── index.ts           # Type definitions (Room, Booking, Slot, User...)
 │    │
 │    └── utils/
 │         └── dateUtils.ts       # Utility tính toán ngày giờ, 2h slots
 └── TECHNICAL_REPORT.md          # Báo cáo kỹ thuật chi tiết chuẩn 2-4 trang
```

---

## 🧑‍💻 Tài Khoản Demo Để Test Xung Đột

Trong ứng dụng có tích hợp nút **"Đổi TK"** góc trên bên phải màn hình chính hoặc trong tab **Hồ sơ SV**:

1. **Nguyễn Văn An** (MSSV: `20210045` - CNTT & AI)
2. **Trần Thị Mai** (MSSV: `20224512` - Viện Kinh tế)
3. **Lê Hoàng Đức** (MSSV: `20198820` - Viện Điện tử Viễn thông)

*Thử nghiệm xung đột:* Sử dụng tài khoản **Nguyễn Văn An** để đặt `Phòng A-101` lúc `09:30 - 11:30`, sau đó chuyển sang tài khoản **Trần Thị Mai** xem khung giờ đó trên `Phòng A-101` sẽ lập tức bị khóa (`Đã đặt (An)`) và không thể bấm chọn!
