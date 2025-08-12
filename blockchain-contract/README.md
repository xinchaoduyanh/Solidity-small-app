# Blockchain Contract - Smart Contract Quản lý Nhiệm vụ

## 🎯 Mục tiêu

Xây dựng Smart Contract Solidity để quản lý nhiệm vụ trên blockchain Ethereum (Ganache local).

## 📁 Cấu trúc thư mục

```
blockchain-contract/
├── contracts/            # Mã nguồn Solidity
│   └── TaskManager.sol  # Smart Contract chính
├── migrations/           # Script triển khai
│   └── 2_deploy_task_manager.js
├── test/                 # Unit tests
├── build/contracts/      # Artifacts sau khi compile
└── truffle-config.js     # Cấu hình Truffle
```

## 🚀 Kế hoạch thực hiện

### Phase 1: Thiết lập môi trường

- [ ] Cài đặt Truffle framework
- [ ] Cài đặt Ganache (Ethereum local blockchain)
- [ ] Cấu hình truffle-config.js

### Phase 2: Phát triển Smart Contract

- [ ] Tạo TaskManager.sol với các chức năng cơ bản:
  - [ ] Thêm nhiệm vụ mới
  - [ ] Cập nhật trạng thái nhiệm vụ
  - [ ] Lấy danh sách nhiệm vụ
  - [ ] Xóa nhiệm vụ (nếu cần)
- [ ] Implement các events để frontend có thể lắng nghe
- [ ] Thêm access control và security checks

### Phase 3: Testing & Deployment

- [ ] Viết unit tests cho tất cả functions
- [ ] Test trên Ganache local
- [ ] Deploy contract và lưu ABI/bytecode
- [ ] Tạo file TaskManager.json cho frontend

## 🔧 Công nghệ sử dụng

- **Solidity**: Ngôn ngữ lập trình Smart Contract
- **Truffle**: Framework phát triển và testing
- **Ganache**: Ethereum local blockchain
- **Web3.js**: Thư viện tương tác với blockchain

## 📝 Lưu ý quan trọng

- Smart Contract sau khi deploy sẽ không thể thay đổi (immutable)
- Cần test kỹ trước khi deploy
- Gas fees sẽ được tính bằng ETH ảo trên Ganache
- MetaMask sẽ được sử dụng để tương tác từ frontend
