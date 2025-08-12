# 🚀 Hướng Dẫn Chạy Dự Án Task Manager

Dự án này bao gồm 3 thành phần chính:

1. **Blockchain Smart Contract** (Solidity + Truffle)
2. **Backend API** (NestJS + TypeScript)
3. **Frontend** (Next.js + React)

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: v18+ (khuyến nghị v20+)
- **npm** hoặc **pnpm**
- **MetaMask** extension cho trình duyệt
- **Git**

## 🏗️ Cài Đặt Dependencies

### 1. Blockchain Contract

```bash
cd blockchain-contract
npm install
```

### 2. Backend API

```bash
cd task-manager-api
npm install
```

### 3. Frontend

```bash
cd task-manager-frontend
npm install
# hoặc
pnpm install
```

## 🚀 Khởi Chạy Dự Án

### Bước 1: Khởi động Ganache (Blockchain Local)

Mở terminal mới và chạy:

```bash
ganache-cli --port 7545
```

**Lưu ý**: Nếu chưa cài ganache-cli, hãy cài đặt:

```bash
npm install -g ganache-cli
```

Ganache sẽ chạy trên `http://127.0.0.1:7545` và cung cấp 10 tài khoản test với 1000 ETH mỗi tài khoản.

### Bước 2: Deploy Smart Contract

Mở terminal mới và chạy:

```bash
cd blockchain-contract
npm run deploy

còn restart thì chạy truffle migrate --reset --compile-all
```

**Kết quả mong đợi**:

- Contract được compile thành công
- Contract được deploy tại địa chỉ: `0x......`
- Network ID: 1337

### Bước 3: Khởi động Backend API

Mở terminal mới và chạy:

```bash
cd task-manager-api
npm run build
npm start
```

**Kết quả mong đợi**:

- API được build thành công
- Server khởi động (thường trên port 3000 hoặc 3001)

### Bước 4: Khởi động Frontend

Mở terminal mới và chạy:

```bash
cd task-manager-frontend
npm run build
npm start
```

**Kết quả mong đợi**:

- Frontend được build thành công
- Server khởi động trên `http://localhost:3000`

## 🔗 Kết Nối MetaMask

1. **Mở MetaMask** trong trình duyệt
2. **Thêm mạng mới**:
   - Network Name: `Local Ganache`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
3. **Import tài khoản test** từ Ganache (sử dụng private key)

## 📱 Sử Dụng Ứng Dụng

1. **Truy cập**: `http://localhost:3000`
2. **Kết nối ví**: Click "Connect Wallet" và chọn MetaMask
3. **Tạo task**: Sử dụng form để tạo task mới
4. **Quản lý task**: Xem, cập nhật, xóa task

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi 1: Không thể kết nối Ganache

```
CONNECTION ERROR: Couldn't connect to node http://127.0.0.1:7545
```

**Giải pháp**: Đảm bảo Ganache đang chạy trên port 7545

### Lỗi 2: Frontend build thất bại

```
Module not found: Can't resolve '@/lib/web3'
```

**Giải pháp**: Đã được sửa trong code, sử dụng relative path

### Lỗi 3: API không tìm thấy file build

```
Error: Cannot find module 'dist/main.js'
```

**Giải pháp**: Chạy `npm run build` trước khi `npm start`

### Lỗi 4: Frontend không có production build

```
Could not find a production build in the '.next' directory
```

**Giải pháp**: Chạy `npm run build` trước khi `npm start`

## 📊 Kiểm Tra Trạng Thái

### Ganache

- Terminal hiển thị 10 tài khoản với 1000 ETH
- RPC server đang lắng nghe trên port 7545

### Smart Contract

- Contract address: `0xD562f17B55EDc0693346f931a713127248F1A753`
- Network ID: 1337

### API

- Server đang chạy (kiểm tra terminal)
- Build thành công trong thư mục `dist/`

### Frontend

- Server đang chạy trên `http://localhost:3000`
- Build thành công trong thư mục `.next/`

## 🔄 Quy Trình Phát Triển

1. **Thay đổi Smart Contract**:

   ```bash
   cd blockchain-contract
   npm run deploy
   ```

2. **Thay đổi API**:

   ```bash
   cd task-manager-api
   npm run build
   npm start
   ```

3. **Thay đổi Frontend**:
   ```bash
   cd task-manager-frontend
   npm run build
   npm start
   ```

## 📁 Cấu Trúc Dự Án

```
small-app/
├── blockchain-contract/     # Smart Contract (Solidity + Truffle)
├── task-manager-api/        # Backend API (NestJS)
├── task-manager-frontend/   # Frontend (Next.js)
└── DenodoData/              # Cấu hình Denodo (tùy chọn)
```

## 🎯 Lưu Ý Quan Trọng

- **Luôn khởi động Ganache trước** khi deploy smart contract
- **Build trước khi start** cho cả API và Frontend
- **Kiểm tra port** để tránh xung đột
- **Sử dụng MetaMask** để tương tác với blockchain

## 🆘 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra tất cả terminal đang chạy
2. Đảm bảo Ganache đang hoạt động
3. Kiểm tra log lỗi trong terminal
4. Restart các service nếu cần thiết

---

**Chúc bạn thành công với dự án Task Manager! 🎉**
