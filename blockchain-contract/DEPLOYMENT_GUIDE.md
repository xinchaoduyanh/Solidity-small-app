# 🚀 TaskManager Smart Contract Deployment Guide

## 📋 Prerequisites

1. **Ganache** đang chạy trên port 7545
2. **Node.js** và **npm** đã cài đặt
3. **Truffle** đã cài đặt globally: `npm install -g truffle`

## 🔧 Cài đặt Dependencies

```bash
cd blockchain-contract
npm install
```

## 🚀 Deployment Steps

### Bước 1: Khởi động Ganache

- Mở Ganache
- Đảm bảo port là **7545**
- Network ID là **1337**

### Bước 2: Compile và Deploy (Windows)

```powershell
# Sử dụng script PowerShell
.\scripts\deploy.ps1

# Hoặc chạy thủ công
truffle compile
truffle migrate --network development --reset
```

### Bước 3: Compile và Deploy (Linux/Mac)

```bash
# Sử dụng script bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# Hoặc chạy thủ công
truffle compile
truffle migrate --network development --reset
```

## 📋 Sau khi Deploy

### 1. Lấy Contract Address

```bash
truffle console --network development
TaskManager.deployed().then(instance => console.log(instance.address))
```

### 2. Copy ABI sang Frontend

```bash
# Script sẽ tự động copy, hoặc copy thủ công:
cp build/contracts/TaskManager.json ../task-manager-frontend/src/contracts/
```

### 3. Cập nhật Environment Variables

Tạo file `task-manager-frontend/.env.local`:

```env
REACT_APP_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS_HERE
REACT_APP_NETWORK_ID=1337
REACT_APP_RPC_URL=http://127.0.0.1:7545
```

## 🧪 Test Contract

### 1. Tạo Task

```bash
truffle console --network development
TaskManager.deployed().then(async (instance) => {
  const tx = await instance.createTask("Test Task", 1)
  console.log("Task created:", tx.logs[0].args)
})
```

### 2. Lấy tất cả Tasks

```bash
TaskManager.deployed().then(async (instance) => {
  const tasks = await instance.getTasks()
  console.log("All tasks:", tasks)
})
```

### 3. Toggle Task Completion

```bash
TaskManager.deployed().then(async (instance) => {
  await instance.toggleComplete(1, true)
  console.log("Task 1 marked as completed")
})
```

## 🔍 Troubleshooting

### Lỗi: "Network not found"

- Kiểm tra Ganache có đang chạy không
- Kiểm tra port 7545 có đúng không
- Kiểm tra network_id 1337

### Lỗi: "Compilation failed"

- Kiểm tra Solidity version trong truffle-config.js
- Đảm bảo contract syntax đúng

### Lỗi: "Deployment failed"

- Kiểm tra account có đủ ETH không
- Kiểm tra gas limit

## 📁 File Structure

```
blockchain-contract/
├── contracts/
│   └── TaskManager.sol          # Smart contract
├── migrations/
│   └── 2_deploy_task_manager.js # Deployment script
├── scripts/
│   ├── deploy.sh                # Linux/Mac deployment script
│   └── deploy.ps1               # Windows deployment script
├── truffle-config.js            # Truffle configuration
└── DEPLOYMENT_GUIDE.md          # This file
```

## 🎯 Next Steps

Sau khi deploy thành công:

1. **Frontend** sẽ có ABI và contract address
2. **Web3 integration** có thể bắt đầu
3. **Task management** thông qua blockchain

---

**Chúc bạn deployment thành công! 🚀**
