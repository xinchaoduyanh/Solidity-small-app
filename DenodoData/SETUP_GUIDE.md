# 🚀 Hướng dẫn thiết lập Denodo Express

## 📋 Yêu cầu hệ thống

- Windows 10/11 hoặc Linux
- RAM: Tối thiểu 4GB (khuyến nghị 8GB)
- Disk space: Tối thiểu 2GB
- Java 8 hoặc cao hơn

## 🔧 Bước 1: Tải và cài đặt Denodo Express

### 1.1 Tải Denodo Express

- Truy cập: https://community.denodo.com/downloads
- Tải phiên bản Denodo Express (miễn phí)
- Chọn phiên bản phù hợp với hệ điều hành

### 1.2 Cài đặt

```bash
# Windows
1. Chạy file .exe với quyền Administrator
2. Chọn "Express Installation"
3. Chọn thư mục cài đặt (mặc định: C:\Denodo)
4. Chọn port mặc định (9090)
5. Hoàn tất cài đặt

# Linux
1. Giải nén file .tar.gz
2. Chạy script install.sh
3. Làm theo hướng dẫn
```

## 🚀 Bước 2: Khởi động Denodo Express

### 2.1 Khởi động Server

```bash
# Windows
1. Mở "Denodo Express Server" từ Start Menu
2. Đợi server khởi động (có thể mất 2-3 phút)
3. Kiểm tra log: "Server started successfully"

# Linux
1. Chạy: ./start_server.sh
2. Kiểm tra log: "Server started successfully"
```

### 2.2 Truy cập Administration Tool

- Mở browser và truy cập: `http://localhost:9090/admin`
- Đăng nhập với tài khoản mặc định:
  - Username: `admin`
  - Password: `admin`

## 📊 Bước 3: Thiết lập cơ sở dữ liệu

### 3.1 Tạo Database

1. Trong Denodo Administration Tool, click "New" → "Database"
2. Đặt tên: `task_manager_db`
3. Click "OK" để tạo

### 3.2 Import file CSV

1. Copy file `categories.csv` và `tasks.csv` vào thư mục Denodo
2. Thường là: `C:\Denodo\data\` (Windows) hoặc `/opt/denodo/data/` (Linux)

### 3.3 Chạy Script SQL

1. Trong Denodo, mở "SQL Editor"
2. Copy và paste nội dung từ file `scripts/setup_denodo.sql`
3. Chạy từng câu lệnh một cách tuần tự
4. Kiểm tra kết quả sau mỗi câu lệnh

## 🌐 Bước 4: Tạo Web Service

### 4.1 Import Web Service

1. Trong Denodo, mở "Web Services" → "Import"
2. Chọn file `denodo-config/web_services/task_manager_ws.xml`
3. Click "Import" để tạo web service

### 4.2 Cấu hình CORS

1. Mở web service vừa tạo
2. Trong phần "CORS", đảm bảo:
   - CORS enabled: `true`
   - Origins: `*`
   - Methods: `GET,POST,PUT,DELETE`

### 4.3 Publish Web Service

1. Click "Publish" để kích hoạt web service
2. Ghi nhớ URL: `http://localhost:9090/task_manager_ws`

## 🧪 Bước 5: Kiểm tra API

### 5.1 Test với Postman/curl

```bash
# Health check
curl http://localhost:9090/task_manager_ws/api/health

# Lấy tất cả danh mục
curl http://localhost:9090/task_manager_ws/api/categories

# Lấy tất cả nhiệm vụ
curl http://localhost:9090/task_manager_ws/api/tasks

# Lấy nhiệm vụ theo danh mục
curl http://localhost:9090/task_manager_ws/api/categories/1/tasks

# Thống kê theo danh mục
curl http://localhost:9090/task_manager_ws/api/statistics/categories
```

### 5.2 Kiểm tra response

- Status code: 200 OK
- Content-Type: application/json
- Dữ liệu trả về đúng format

## 🔍 Bước 6: Troubleshooting

### 6.1 Lỗi thường gặp

```
# Lỗi: "File not found"
- Kiểm tra đường dẫn file CSV
- Đảm bảo file có quyền đọc

# Lỗi: "Port already in use"
- Thay đổi port trong cấu hình
- Hoặc dừng service đang sử dụng port

# Lỗi: "Memory insufficient"
- Tăng RAM cho Denodo
- Đóng các ứng dụng không cần thiết
```

### 6.2 Kiểm tra log

- Log file: `C:\Denodo\logs\` (Windows) hoặc `/opt/denodo/logs/` (Linux)
- Kiểm tra error log để debug

## 📝 Bước 7: Cấu hình cho Backend

### 7.1 Ghi nhớ thông tin

- **Base URL**: `http://localhost:9090/task_manager_ws`
- **API Endpoints**: Xem file `web_services/task_manager_ws.xml`
- **CORS**: Đã được cấu hình sẵn

### 7.2 Test kết nối từ NestJS

```typescript
// Trong NestJS service
const denodoBaseUrl = "http://localhost:9090/task_manager_ws";
const response = await axios.get(`${denodoBaseUrl}/api/categories`);
```

## ✅ Kiểm tra cuối cùng

### Checklist hoàn thành

- [ ] Denodo Express Server đang chạy
- [ ] Database `task_manager_db` đã được tạo
- [ ] Views đã được tạo thành công
- [ ] Web Service đã được publish
- [ ] API endpoints trả về dữ liệu đúng
- [ ] CORS đã được cấu hình

### Thông tin quan trọng

- **Server URL**: `http://localhost:9090`
- **Admin Tool**: `http://localhost:9090/admin`
- **API Base**: `http://localhost:9090/task_manager_ws`
- **Database**: `task_manager_db`

---

## 🎯 Bước tiếp theo

Sau khi hoàn thành thiết lập Denodo, bạn có thể:

1. **Tiếp tục với Smart Contract** - Xây dựng blockchain layer
2. **Hoặc bắt đầu với NestJS Backend** - Tích hợp với Denodo API

**Chúc bạn thiết lập thành công! 🚀**
