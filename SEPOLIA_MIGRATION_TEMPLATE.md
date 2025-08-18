# 🚀 HƯỚNG DẪN CHUYỂN ĐỔI TỪ GANACHE SANG SEPOLIA TESTNET

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn chuyển đổi dự án từ môi trường phát triển local (Ganache) sang Sepolia testnet để test trên mạng thật.

## 🎯 Mục tiêu

- Deploy smart contract lên Sepolia testnet
- Cập nhật frontend để kết nối với Sepolia
- Đảm bảo ứng dụng hoạt động ổn định trên testnet

## ⚠️ Yêu cầu trước khi bắt đầu

### 1. Ví MetaMask

- Cài đặt MetaMask extension
- Tạo ví mới hoặc sử dụng ví hiện có
- **QUAN TRỌNG**: Lưu trữ 12 từ khóa mnemonic an toàn

### 2. Sepolia ETH

- Cần có Sepolia ETH để trả phí gas
- Faucet: https://sepoliafaucet.com/ (Alchemy)
- Faucet: https://faucet.sepolia.dev/ (Chainlink)

### 3. Infura Account

- Đăng ký tại: https://infura.io
- Tạo project mới
- Lấy Project ID

## 🔧 Các bước thực hiện

### Bước 1: Chuẩn bị môi trường

```bash
# Cài đặt dependencies cho blockchain contract
cd blockchain-contract
npm install

# Cài đặt dependencies cho frontend
cd ../task-manager-frontend
npm install
```

### Bước 2: Cấu hình môi trường

#### 2.1. Tạo file .env trong blockchain-contract/

```bash
# blockchain-contract/.env
MNEMONIC=your_twelve_word_mnemonic_phrase_here
PROJECT_ID=your_infura_project_id_here
```

#### 2.2. Tạo file .env.local trong task-manager-frontend/

```bash
# task-manager-frontend/.env.local
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
NEXT_PUBLIC_TASK_MANAGER_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_NETWORK_RPC=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_BLOCK_EXPLORER=https://sepolia.etherscan.io
NEXT_PUBLIC_INFURA_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_INFURA_SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_DEFAULT_GAS_LIMIT=300000
NEXT_PUBLIC_DEFAULT_GAS_PRICE=20000000000
NEXT_PUBLIC_AUTO_CONNECT=false
NEXT_PUBLIC_SHOW_TRANSACTION_NOTIFICATIONS=true
```

**⚠️ QUAN TRỌNG**: Thay `YOUR_PROJECT_ID` bằng Project ID thật từ Infura của bạn!

### Bước 3: Deploy Smart Contract

```bash
# Trong thư mục blockchain-contract
npm run deploy:sepolia
```

**Lưu ý**: Sau khi deploy thành công, ghi lại địa chỉ contract và cập nhật vào file `.env.local` của frontend.

### Bước 4: Cập nhật địa chỉ contract

Sau khi deploy thành công, cập nhật các biến sau trong `task-manager-frontend/.env.local`:

```bash
NEXT_PUBLIC_TASK_MANAGER_ADDRESS=0x... # Địa chỉ contract thực tế
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Địa chỉ contract thực tế
```

### Bước 5: Test ứng dụng

```bash
# Khởi động frontend
cd task-manager-frontend
npm run dev
```

## 🔍 Kiểm tra và xác nhận

### 1. Kiểm tra kết nối MetaMask

- Mở MetaMask
- Chuyển sang Sepolia testnet
- Kết nối với ứng dụng

### 2. Kiểm tra contract trên Sepolia

- Truy cập: https://sepolia.etherscan.io
- Tìm kiếm địa chỉ contract
- Xác nhận transaction deploy

### 3. Test các chức năng

- Tạo task mới
- Cập nhật task
- Xóa task
- Kiểm tra gas fees

## 🚨 Xử lý lỗi thường gặp

### 1. Lỗi "Insufficient funds"

- Kiểm tra số dư Sepolia ETH
- Sử dụng faucet để lấy thêm ETH

### 2. Lỗi "Wrong network"

- Đảm bảo MetaMask đang ở Sepolia testnet
- Chain ID: 11155111

### 3. Lỗi "Contract not found"

- Kiểm tra địa chỉ contract trong .env.local
- Đảm bảo contract đã được deploy thành công

### 4. Lỗi "Gas estimation failed"

- Tăng gas limit
- Kiểm tra logic contract

## 📊 So sánh Ganache vs Sepolia

| Tính năng  | Ganache     | Sepolia           |
| ---------- | ----------- | ----------------- |
| Môi trường | Local       | Testnet           |
| Gas fees   | Miễn phí    | Có phí (test ETH) |
| Tốc độ     | Nhanh       | Chậm hơn          |
| Độ tin cậy | Thấp        | Cao               |
| Phù hợp    | Development | Testing           |

## 🎉 Hoàn thành

Sau khi hoàn thành tất cả các bước, ứng dụng của bạn sẽ:

- Chạy trên Sepolia testnet
- Sử dụng smart contract thật
- Có thể test với MetaMask thật
- Sẵn sàng cho production

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:

1. Console logs của browser
2. MetaMask logs
3. Truffle deployment logs
4. Sepolia Etherscan

---

**⚠️ LƯU Ý BẢO MẬT**: 
- KHÔNG BAO GIỜ commit file .env lên git
- KHÔNG chia sẻ Project ID Infura công khai
- Luôn test kỹ trên testnet trước khi deploy lên mainnet!
- Sử dụng .gitignore để bảo vệ thông tin nhạy cảm
