# 🚀 Hướng Dẫn Chạy Dự Án Task Manager trên Sepolia Testnet

Dự án này bao gồm 3 thành phần chính:

1. **Blockchain Smart Contract** (Solidity + Truffle) - Deploy trên Sepolia
2. **Backend API** (NestJS + TypeScript)
3. **Frontend** (Next.js + React) - Kết nối với Sepolia

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: v18+ (khuyến nghị v20+)
- **npm** hoặc **pnpm**
- **MetaMask** extension cho trình duyệt
- **Git**
- **Ví MetaMask** với Sepolia ETH (có thể lấy từ faucet)

## 🎯 Chuẩn Bị Sepolia Testnet

### 1. Lấy Sepolia ETH (Testnet)

- **Faucet Alchemy**: https://sepoliafaucet.com/
- **Faucet Chainlink**: https://faucet.sepolia.dev/
- **Cần khoảng**: 0.01-0.1 ETH để test

### 2. Lấy Infura Project ID

- Đăng ký tại: https://infura.io
- Tạo project mới → "Create New Project"
- Chọn "Web3 API" → "Create"
- Vào project → "Settings" → "Keys"
- Copy "PROJECT ID"

### 3. Lấy MetaMask Mnemonic

- Mở MetaMask → 3 dấu gạch → "Settings"
- "Security & Privacy" → "Reveal Seed Words"
- Nhập password → Copy 12 từ khóa
- **QUAN TRỌNG**: Giữ bí mật, không chia sẻ!

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

### Bước 1: Setup Blockchain Contract cho Sepolia

Mở terminal và chạy:

```bash
cd blockchain-contract
.\scripts\setup-sepolia.ps1
```

**Kết quả mong đợi**:

- Dependencies được cài đặt
- File .env được tạo
- Contracts được compile thành công

### Bước 2: Cấu hình file .env

Sau khi chạy setup script, cập nhật file `blockchain-contract/.env`:

```bash
# Thay thế các giá trị dưới đây
MNEMONIC=your_twelve_word_mnemonic_phrase_here
PROJECT_ID=f329147ecd0349008e4d62d89f25186b
```

### Bước 3: Deploy Smart Contract lên Sepolia

```bash
cd blockchain-contract
npm run deploy:sepolia
```

**Kết quả mong đợi**:

- Contract được deploy thành công
- Contract address mới: `0x......`
- Network: Sepolia Testnet (Chain ID: 11155111)

### Bước 4: Cập nhật Frontend Environment

Cập nhật file `task-manager-frontend/.env.local`:

```bash
# Cập nhật địa chỉ contract mới
NEXT_PUBLIC_TASK_MANAGER_ADDRESS=0x... # Địa chỉ contract thực tế
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Địa chỉ contract thực tế

# Các cấu hình khác đã có sẵn
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
NEXT_PUBLIC_NETWORK_RPC=https://sepolia.infura.io/v3/f329147ecd0349008e4d62d89f25186b
NEXT_PUBLIC_BLOCK_EXPLORER=https://sepolia.etherscan.io
```

### Bước 5: Khởi động Backend API

Mở terminal mới và chạy:

```bash
cd task-manager-api
npm run build
npm start
```

**Kết quả mong đợi**:

- API được build thành công
- Server khởi động (thường trên port 3000 hoặc 3001)

### Bước 6: Khởi động Frontend

Mở terminal mới và chạy:

```bash
cd task-manager-frontend
npm run build
npm start
```

**Kết quả mong đợi**:

- Frontend được build thành công
- Server khởi động trên `http://localhost:3000`

## 🔗 Kết Nối MetaMask với Sepolia

1. **Mở MetaMask** trong trình duyệt
2. **Chuyển sang Sepolia Testnet**:
   - Click vào network dropdown
   - Chọn "Sepolia test network"
   - Chain ID: 11155111
3. **Đảm bảo có Sepolia ETH** trong ví

## 📱 Sử Dụng Ứng Dụng

1. **Truy cập**: `http://localhost:3000`
2. **Kết nối ví**: Click "Connect Wallet" và chọn MetaMask
3. **Tạo task**: Sử dụng form để tạo task mới
4. **Quản lý task**: Xem, cập nhật, xóa task
5. **Kiểm tra transaction**: Xem trên https://sepolia.etherscan.io

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi 1: Không thể deploy lên Sepolia

```
Error: insufficient funds for gas * price + value
```

**Giải pháp**:

- Kiểm tra số dư Sepolia ETH
- Sử dụng faucet để lấy thêm ETH
- Giảm gas limit/price nếu cần

### Lỗi 2: Wrong network

```
Error: MetaMask is not connected to Sepolia
```

**Giải pháp**:

- Chuyển MetaMask sang Sepolia testnet
- Chain ID phải là 11155111

### Lỗi 3: Contract not found

```
Error: Contract not found at address
```

**Giải pháp**:

- Kiểm tra địa chỉ contract trong .env.local
- Đảm bảo contract đã được deploy thành công

### Lỗi 4: Gas estimation failed

```
Error: gas estimation failed
```

**Giải pháp**:

- Tăng gas limit
- Kiểm tra logic contract
- Đảm bảo có đủ Sepolia ETH

## 📊 Kiểm Tra Trạng Thái

### Smart Contract trên Sepolia

- Contract address: `0x......` (sau khi deploy)
- Network: Sepolia Testnet
- Chain ID: 11155111
- Block Explorer: https://sepolia.etherscan.io

### API

- Server đang chạy (kiểm tra terminal)
- Build thành công trong thư mục `dist/`

### Frontend

- Server đang chạy trên `http://localhost:3000`
- Build thành công trong thư mục `.next/`
- Kết nối với Sepolia testnet

## 🔄 Quy Trình Phát Triển

1. **Thay đổi Smart Contract**:

   ```bash
   cd blockchain-contract
   npm run deploy:sepolia
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
│   ├── scripts/            # Scripts setup và deploy
│   └── .env               # Cấu hình blockchain
├── task-manager-api/        # Backend API (NestJS)
├── task-manager-frontend/   # Frontend (Next.js)
│   └── .env.local         # Cấu hình frontend
└── DenodoData/              # Cấu hình Denodo (tùy chọn)
```

## 🎯 Lưu Ý Quan Trọng

- **Luôn deploy contract trước** khi khởi động frontend
- **Cập nhật địa chỉ contract** trong frontend sau khi deploy
- **Sử dụng Sepolia testnet** thay vì Ganache
- **Kiểm tra gas fees** trước khi thực hiện transaction
- **Backup mnemonic** an toàn

## 🆘 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra tất cả terminal đang chạy
2. Đảm bảo MetaMask đang ở Sepolia testnet
3. Kiểm tra số dư Sepolia ETH
4. Xem transaction logs trên Sepolia Etherscan
5. Kiểm tra log lỗi trong terminal

---

**Chúc bạn thành công với dự án Task Manager trên Sepolia Testnet! 🎉**
