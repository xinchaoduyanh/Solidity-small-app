CURSOR RULES: Dự án Quản lý Nhiệm vụ Phi tập trung (Decentralized Task Manager)
1. Tổng quan Dự án
Dự án "Quản lý Nhiệm vụ Phi tập trung" là một ứng dụng nhỏ được thiết kế để bạn làm quen và thử nghiệm các công nghệ Web3 (Blockchain) và ảo hóa dữ liệu trong một môi trường phát triển cục bộ, miễn phí.

Mục tiêu chính:

Quản lý nhiệm vụ trên Blockchain: Hiểu cách tạo, lưu trữ và cập nhật các nhiệm vụ trên một hợp đồng thông minh (Smart Contract) bất biến.

Ảo hóa dữ liệu tham chiếu: Áp dụng Denodo Express để ảo hóa dữ liệu danh mục nhiệm vụ từ một nguồn cục bộ (file CSV), sau đó cung cấp dữ liệu này qua một API.

Tích hợp Full-stack: Kết nối frontend (Next.js 15) với backend (NestJS) và blockchain (Solidity/Ganache), cũng như backend với Denodo Express.

Trải nghiệm môi trường miễn phí: Toàn bộ dự án được thiết lập để chạy trên các công cụ miễn phí và môi trường cục bộ, không phát sinh chi phí thực tế.

2. Công nghệ sử dụng
Dự án này sử dụng một stack công nghệ đa dạng để minh họa sự tương tác giữa Web2 và Web3:

Blockchain Backend:

Solidity: Ngôn ngữ lập trình hợp đồng thông minh để định nghĩa logic quản lý nhiệm vụ trên blockchain.    

Ganache: Máy ảo Ethereum cục bộ, cung cấp một blockchain riêng tư để triển khai và kiểm thử hợp đồng thông minh mà không tốn phí gas thực tế.    

MetaMask: Tiện ích mở rộng trình duyệt hoạt động như một ví tiền điện tử, dùng để tương tác và xác nhận các giao dịch với blockchain từ frontend.    

Data Virtualization:

Denodo Express: Phiên bản miễn phí của Denodo Platform, được sử dụng để ảo hóa dữ liệu danh mục nhiệm vụ từ một file CSV cục bộ và xuất bản nó dưới dạng REST API.    

Backend API Gateway:

NestJS: Framework Node.js mạnh mẽ, được xây dựng với TypeScript, đóng vai trò là API gateway. Nó sẽ gọi Denodo REST API để lấy dữ liệu danh mục và cung cấp cho frontend.    

Frontend:

Next.js 15: Framework React cho phép xây dựng giao diện người dùng hiện đại, hỗ trợ Server Components và Client Components, tối ưu hóa việc lấy dữ liệu và tương tác.    

Web3.js / Prisma: Thư viện JavaScript để frontend tương tác trực tiếp với hợp đồng thông minh trên blockchain. Prisma giúp quản lý cơ sở dữ liệu và tương tác với blockchain một cách hiệu quả.    

3. Cấu trúc Dự án
Dự án được tổ chức theo cấu trúc monorepo đơn giản với ba thư mục chính, mỗi thư mục chứa một phần của ứng dụng:
.
├── blockchain-contract/
│   ├── contracts/            # Mã nguồn Solidity của Smart Contract
│   │   └── TaskManager.sol
│   ├── migrations/           # Script triển khai Smart Contract (Truffle)
│   │   └── 2_deploy_task_manager.js
│   ├── test/                 # Unit tests cho Smart Contract
│   ├── build/contracts/      # Artifacts (ABI, bytecode) sau khi compile
│   └── truffle-config.js     # Cấu hình Truffle
├── task-manager-api/
│   ├── src/                  # Mã nguồn NestJS
│   │   ├── main.ts           # Entry point của ứng dụng NestJS
│   │   ├── app.module.ts     # Module gốc
│   │   ├── denodo-api/       # Service để gọi Denodo API
│   │   │   └── denodo-api.service.ts
│   │   └── categories/       # Controller để lộ API danh mục
│   │       └── categories.controller.ts
│   ├──.env                  # Biến môi trường (nếu có)
│   └── package.json          # Dependencies và scripts
├── task-manager-frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router (Server Components)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx      # Trang chính, lấy dữ liệu danh mục
│   │   ├── components/       # React Client Components
│   │   │   ├── AddTaskForm.tsx # Form thêm nhiệm vụ (tương tác blockchain)
│   │   │   └── TaskList.tsx  # Hiển thị danh sách nhiệm vụ (tương tác blockchain)
│   │   ├── contracts/        # Nơi chứa TaskManager.json (ABI của Smart Contract)
│   │   ├── prisma/            # Cấu hình Prisma và schema
│   │   ├── schema.prisma  # Schema cơ sở dữ liệu
│   │   └── migrations/    # Migrations của Prisma
│   │   └── globals.css       # CSS toàn cục
│   ├── public/               # Assets tĩnh
│   └── package.json          # Dependencies và scripts
└── DenodoData/               # Thư mục chứa file dữ liệu cục bộ cho Denodo
└── categories.csv        # File CSV chứa danh mục nhiệm vụ


## 4. Quy tắc và Hướng dẫn Phát triển

### 4.1. Nguyên tắc chung

*   **Giữ quy mô nhỏ:** Tập trung vào việc triển khai các chức năng cốt lõi để thử nghiệm sự tương tác giữa các công nghệ. Tránh thêm các tính năng phức tạp không cần thiết.
*   **Học hỏi qua thực hành:** Mục tiêu chính là hiểu cách mỗi công nghệ hoạt động và tương tác với nhau. Đừng ngại thử nghiệm và gỡ lỗi.
*   **Môi trường cục bộ:** Luôn đảm bảo Ganache và Denodo Express Server đang chạy trước khi khởi động NestJS và Next.js.

### 4.2. Coding Standards

*   **TypeScript:** Sử dụng TypeScript cho tất cả các phần NestJS và Next.js để tận dụng kiểm tra kiểu dữ liệu và cải thiện khả năng bảo trì code.
*   **ESLint & Prettier:** Tuân thủ các quy tắc linting và định dạng code được cấu hình sẵn (Next.js CLI tự động cài đặt ESLint). Điều này giúp code nhất quán và dễ đọc.
*   **Solidity Best Practices:** Mặc dù là dự án nhỏ, hãy cố gắng áp dụng các thực hành tốt nhất về bảo mật cho Smart Contract (ví dụ: kiểm tra quyền truy cập, xử lý lỗi).

### 4.3. Quy trình làm việc

*   **Phát triển lặp lại:** Bắt đầu với việc thiết lập từng thành phần (Denodo, Solidity, NestJS, Next.js) một cách độc lập, sau đó tích hợp chúng từng bước.
*   **Kiểm thử:**
    *   **Smart Contract:** Viết unit test cho các hàm quan trọng trong `TaskManager.sol` bằng Truffle. Điều này rất quan trọng vì hợp đồng trên blockchain là bất biến sau khi triển khai. [5, 6]
    *   **NestJS API:** Kiểm thử các endpoint của NestJS (ví dụ: `/categories`) để đảm bảo chúng kết nối đúng với Denodo và trả về dữ liệu mong muốn.
    *   **Next.js Frontend:** Kiểm thử tương tác người dùng, đảm bảo dữ liệu hiển thị chính xác và các hành động (thêm/sửa nhiệm vụ) được phản ánh đúng trên blockchain.
*   **Commit Messages:** Sử dụng các commit message rõ ràng, ngắn gọn và có ý nghĩa (ví dụ: "feat: Implement task creation on blockchain", "fix: Resolve CORS issue in NestJS", "chore: Update Denodo category data").

### 4.4. Tương tác giữa các thành phần

*   **Frontend (Next.js) -> Backend (NestJS):**
    *   Next.js sẽ gọi các API endpoint của NestJS để lấy dữ liệu danh mục nhiệm vụ được ảo hóa bởi Denodo.
    *   Sử dụng `fetch()` API của Next.js (đặc biệt là trong Server Components) để lấy dữ liệu. [20, 26, 31, 32]
*   **Backend (NestJS) -> Denodo Express:**
    *   NestJS sẽ sử dụng thư viện HTTP client (như `@nestjs/axios` dựa trên Axios) để thực hiện các yêu cầu GET đến REST API được xuất bản bởi Denodo Express. [15, 18]
*   **Frontend (Next.js) -> Blockchain (Solidity/Ganache):**
    *   Frontend sẽ tương tác trực tiếp với Smart Contract `TaskManager.sol` thông qua thư viện `web3.js` hoặc `Drizzle`.
    *   MetaMask sẽ đóng vai trò là cầu nối để người dùng xác nhận các giao dịch (thêm nhiệm vụ, đánh dấu hoàn thành) và hiển thị phí gas (ảo) liên quan. [27, 6, 28, 8, 29, 30]

### 4.5. Lưu ý đặc biệt

*   **CORS:** Đảm bảo cấu hình CORS chính xác trong ứng dụng NestJS để cho phép frontend Next.js (thường chạy trên `http://localhost:3000`) truy cập API của NestJS (thường chạy trên `http://localhost:3001`). [33, 34]
*   **Phí Gas:** Mỗi thao tác ghi dữ liệu lên blockchain (thêm nhiệm vụ, đánh dấu hoàn thành) sẽ tiêu tốn một lượng "gas" (phí giao dịch). MetaMask sẽ hiển thị các khoản phí này (bằng ETH ảo trên Ganache). [35, 6]
*   **Tính bất biến của Blockchain:** Dữ liệu một khi đã được ghi vào blockchain thông qua Smart Contract thì không thể bị sửa đổi hoặc xóa bỏ. Điều này cần được ghi nhớ khi thiết kế logic ứng dụng. [27, 36, 37, 38, 39, 40, 41]
*   **Denodo Express:** Đảm bảo Denodo Express Server và dịch vụ REST API của bạn đang chạy và có thể truy cập được từ NestJS backend trước khi khởi động các phần còn lại của ứng dụng.

Chúc bạn có một trải nghiệm lập trình thú vị và hiệu quả với dự án này trên Cursor\!