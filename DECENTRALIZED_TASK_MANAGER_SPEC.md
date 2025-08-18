# Decentralized Task Manager - Spec & Build Plan

## 1. Phân tích & Thiết kế tính năng

### 1.1. Phạm vi dự án

Hệ thống quản lý nhiệm vụ phi tập trung (Decentralized Task Manager) cho phép:

- **Tạo, quản lý và hoàn thành task minh bạch trên blockchain**
- **Multi-user collaboration**: nhiều người cùng tham gia một workspace
- **Category tuỳ chỉnh**: người dùng tự định nghĩa các nhóm công việc
- **Priority & Deadline**: sắp xếp và quản lý công việc theo mức độ ưu tiên và thời hạn
- **Comment on-chain**: mọi bình luận đều minh bạch, không thể chỉnh sửa
- **Public vs Private Task**: kiểm soát quyền truy cập task
- **Task History**: thống kê theo ngày/tuần
- **Giao tiếp qua Wallet (SIWE)**: không dùng password

### 1.2. Xác thực & User

**Auth Method**: Chỉ dùng SIWE (Sign-in with Ethereum)

**User Info**:

- Một địa chỉ ví tương ứng một tài khoản
- Có thể liên kết nhiều ví nếu cần (multi-wallet per user)
- Mỗi lần đăng nhập sẽ chọn ví chính

**Bảo mật**:

- Không lưu private key
- Chỉ lưu public wallet address

### 1.3. Dữ liệu on-chain và off-chain

#### On-chain:

**Task core data:**

- `task_id`
- `workspace_id`
- `creator_wallet`
- `title`
- `description`
- `priority`
- `deadline`
- `status` (Pending / In Progress / Completed)
- `category_id`
- `created_at`

**Comment:**

- `comment_id`
- `task_id`
- `commenter_wallet`
- `content`
- `created_at`

**Event log**: CreateTask, UpdateStatus, AddComment

#### Off-chain (DB - lưu meta & optimize query):

- User profile (name, avatar…)
- Workspace member list, roles
- Category definitions
- Cached task list for dashboard
- Analytics (task history, count by category)

### 1.4. ERD

#### Bảng & Quan hệ:

**users**

- `id` (PK, UUID)
- `wallet_address` (string, unique)
- `display_name` (string)
- `avatar_url` (string, optional)
- `created_at` (timestamp)

**workspaces**

- `id` (PK, UUID)
- `name` (string)
- `owner_id` (FK → users.id)
- `created_at` (timestamp)

**workspace_members**

- `workspace_id` (FK → workspaces.id)
- `user_id` (FK → users.id)
- `role` (enum: owner, admin, member)
- PK: (workspace_id, user_id)

**categories**

- `id` (PK, UUID)
- `workspace_id` (FK → workspaces.id)
- `name` (string)
- `color` (string, optional)
- `created_at` (timestamp)

**tasks**

- `id` (PK, UUID)
- `workspace_id` (FK → workspaces.id)
- `creator_id` (FK → users.id)
- `title` (string)
- `description` (text)
- `priority` (enum: low, medium, high)
- `deadline` (timestamp, optional)
- `status` (enum: pending, in_progress, completed)
- `category_id` (FK → categories.id)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**task_assignees**

- `task_id` (FK → tasks.id)
- `user_id` (FK → users.id)
- PK: (task_id, user_id)

**comments** (on-chain nhưng mirror off-chain để dễ query)

- `id` (PK, UUID)
- `task_id` (FK → tasks.id)
- `commenter_id` (FK → users.id)
- `content` (text)
- `created_at` (timestamp)

### 1.5. Quy tắc public/private

- **Private task**: chỉ visible với thành viên trong workspace
- **Public task**: ai cũng có thể xem (nhưng chỉ member được thao tác)

### 1.6. Lịch sử & Analytics

- Lưu event log (on-chain)
- **Off-chain tổng hợp**:
  - Task tạo theo ngày/tuần
  - Task hoàn thành theo ngày/tuần
  - Biểu đồ phân loại theo category

### 1.7. Khả năng mở rộng

**Tích hợp Denodo sau này**:

- Truy vấn đồng thời dữ liệu on-chain và off-chain
- Hợp nhất dữ liệu từ nhiều chain hoặc nhiều hệ thống
- Giúp tạo báo cáo real-time mà không cần ETL phức tạp

## 2. Plan Build (Roadmap)

### Phase 1: Auth + User

- [ ] Tích hợp SIWE
- [ ] Tạo bảng users
- [ ] Test đăng nhập bằng MetaMask

### Phase 2: Workspace + Member

- [ ] CRUD workspace
- [ ] Thêm/xoá thành viên workspace
- [ ] Role-based permission

### Phase 3: Category

- [ ] CRUD category theo workspace
- [ ] Mỗi task thuộc một category

### Phase 4: Task Core

- [ ] Tạo task on-chain
- [ ] Lưu meta off-chain
- [ ] Multi-assignee

### Phase 5: Comment

- [ ] On-chain comment
- [ ] Hiển thị & fetch kết hợp on-chain + off-chain

### Phase 6: Public/Private

- [ ] Kiểm soát quyền truy cập task
- [ ] Filter task list

### Phase 7: Analytics

- [ ] Thống kê task theo ngày/tuần
- [ ] Dashboard

### Phase 8: Optional Integration

- [ ] Denodo cho báo cáo hợp nhất dữ liệu
- [ ] Hỗ trợ multi-chain

## 3. Kiến trúc hệ thống

### 3.1. Frontend (Next.js + TypeScript)

- **Framework**: Next.js 14 với App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Custom Hooks
- **Wallet Integration**: MetaMask + WalletConnect
- **Real-time Updates**: WebSocket hoặc polling

### 3.2. Backend (NestJS + TypeScript)

- **Framework**: NestJS với TypeScript
- **Database**: PostgreSQL (off-chain data)
- **ORM**: TypeORM hoặc Prisma
- **Authentication**: SIWE middleware
- **API**: RESTful + GraphQL (optional)

### 3.3. Blockchain (Solidity + Hardhat)

- **Smart Contract**: TaskManager.sol
- **Network**: Sepolia testnet (development), Ethereum mainnet (production)
- **Development**: Hardhat + OpenZeppelin
- **Gas Optimization**: Batch operations, efficient data structures

### 3.4. Infrastructure

- **Hosting**: Vercel (frontend), Railway/Render (backend)
- **Database**: Supabase/Neon (PostgreSQL)
- **Blockchain Node**: Infura/Alchemy
- **Monitoring**: Sentry, LogRocket

## 4. Smart Contract Design

### 4.1. TaskManager Contract

```solidity
// Core structures
struct Task {
    uint256 taskId;
    address creator;
    uint256 workspaceId;
    string title;
    string description;
    uint8 priority; // 0: low, 1: medium, 2: high
    uint256 deadline;
    TaskStatus status;
    uint256 categoryId;
    uint256 createdAt;
    bool isPublic;
}

struct Comment {
    uint256 commentId;
    uint256 taskId;
    address commenter;
    string content;
    uint256 createdAt;
}

// Events
event TaskCreated(uint256 indexed taskId, address indexed creator, uint256 workspaceId);
event TaskStatusUpdated(uint256 indexed taskId, TaskStatus newStatus);
event CommentAdded(uint256 indexed taskId, uint256 indexed commentId, address commenter);
```

### 4.2. Key Functions

- `createTask()`: Tạo task mới
- `updateTaskStatus()`: Cập nhật trạng thái task
- `addComment()`: Thêm comment
- `assignTask()`: Gán task cho user
- `getTaskDetails()`: Lấy thông tin task
- `getWorkspaceTasks()`: Lấy danh sách task theo workspace

## 5. Database Schema (PostgreSQL)

### 5.1. Core Tables

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspaces table
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table (off-chain mirror)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blockchain_task_id BIGINT UNIQUE NOT NULL,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority SMALLINT CHECK (priority IN (0, 1, 2)),
    deadline TIMESTAMP,
    status SMALLINT CHECK (status IN (0, 1, 2)),
    category_id UUID REFERENCES categories(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 6. API Endpoints

### 6.1. Authentication

- `POST /auth/siwe`: Sign-in with Ethereum
- `POST /auth/verify`: Verify SIWE signature
- `POST /auth/logout`: Logout user

### 6.2. Users

- `GET /users/profile`: Get user profile
- `PUT /users/profile`: Update user profile
- `GET /users/wallets`: Get user's linked wallets

### 6.3. Workspaces

- `GET /workspaces`: List user's workspaces
- `POST /workspaces`: Create new workspace
- `GET /workspaces/:id`: Get workspace details
- `PUT /workspaces/:id`: Update workspace
- `DELETE /workspaces/:id`: Delete workspace

### 6.4. Tasks

- `GET /workspaces/:id/tasks`: List workspace tasks
- `POST /workspaces/:id/tasks`: Create new task
- `GET /tasks/:id`: Get task details
- `PUT /tasks/:id`: Update task
- `DELETE /tasks/:id`: Delete task
- `POST /tasks/:id/assign`: Assign task to users

### 6.5. Categories

- `GET /workspaces/:id/categories`: List workspace categories
- `POST /workspaces/:id/categories`: Create new category
- `PUT /categories/:id`: Update category
- `DELETE /categories/:id`: Delete category

## 7. Security Considerations

### 7.1. Smart Contract Security

- Access control modifiers
- Reentrancy protection
- Input validation
- Gas limit considerations
- Emergency pause functionality

### 7.2. Application Security

- SIWE signature verification
- Rate limiting
- Input sanitization
- SQL injection prevention
- CORS configuration

### 7.3. Data Privacy

- Wallet address encryption (optional)
- Private task access control
- Audit logging
- GDPR compliance considerations

## 8. Testing Strategy

### 8.1. Smart Contract Testing

- Unit tests with Hardhat
- Integration tests
- Security audits
- Gas optimization tests

### 8.2. Frontend Testing

- Component testing (Jest + React Testing Library)
- E2E testing (Playwright)
- Wallet integration testing
- Responsive design testing

### 8.3. Backend Testing

- Unit tests (Jest)
- Integration tests
- API endpoint testing
- Database migration testing

## 9. Deployment & CI/CD

### 9.1. Smart Contract Deployment

- Sepolia testnet deployment
- Mainnet deployment checklist
- Contract verification on Etherscan
- Gas cost optimization

### 9.2. Application Deployment

- Frontend: Vercel automatic deployment
- Backend: Railway/Render with auto-scaling
- Database: Managed PostgreSQL service
- Environment variable management

### 9.3. CI/CD Pipeline

- GitHub Actions workflow
- Automated testing
- Security scanning
- Deployment automation

## 10. Monitoring & Analytics

### 10.1. Application Monitoring

- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Blockchain transaction monitoring

### 10.2. Smart Contract Monitoring

- Event logging
- Gas usage tracking
- Contract interaction analytics
- Security incident detection

## 11. Future Enhancements

### 11.1. Multi-chain Support

- Polygon, Arbitrum, Optimism
- Cross-chain task synchronization
- Chain-specific optimizations

### 11.2. Advanced Features

- Task templates
- Automated workflows
- Integration with other DeFi protocols
- Mobile app development

### 11.3. Denodo Integration

- Real-time data virtualization
- Multi-source data aggregation
- Advanced analytics dashboard
- Business intelligence reports

---

**Next Steps:**

1. Review and approve this specification
2. Set up development environment
3. Begin Phase 1 implementation
4. Create detailed technical specifications for each phase
5. Set up project management and tracking tools

**Estimated Timeline:** 12-16 weeks for full implementation
**Team Size:** 2-3 developers (1 frontend, 1 backend, 1 smart contract)
**Budget:** Development + Testing + Deployment + Security audit
