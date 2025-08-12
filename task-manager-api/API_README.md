# 🚀 Task Manager API

## 📋 Mô tả

NestJS API backend cho ứng dụng Task Manager với blockchain integration.

## 🏗️ Cấu trúc dự án

```
src/
├── categories/           # Categories module
│   ├── dto/             # Data Transfer Objects
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── tasks/               # Tasks module
│   ├── dto/             # Data Transfer Objects
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.module.ts
├── common/              # Shared utilities
├── app.module.ts        # Root module
└── main.ts             # Application entry point
```

## 🚀 Khởi chạy

### Cài đặt dependencies

```bash
npm install
```

### Chạy development mode

```bash
npm run start:dev
```

### Build production

```bash
npm run build
npm start
```

## 🌐 API Endpoints

### Categories

- `GET /categories` - Lấy tất cả categories
- `GET /categories/:id` - Lấy category theo ID
- `POST /categories` - Tạo category mới
- `PUT /categories/:id` - Cập nhật category
- `DELETE /categories/:id` - Xóa category

### Tasks

- `GET /tasks` - Lấy tất cả tasks
- `GET /tasks?categoryId=1` - Lấy tasks theo category
- `GET /tasks/:id` - Lấy task theo ID
- `POST /tasks` - Tạo task mới
- `PUT /tasks/:id` - Cập nhật task
- `PUT /tasks/:id/toggle` - Toggle trạng thái task
- `DELETE /tasks/:id` - Xóa task

## 📊 Mock Data

### Categories

```json
[
  {
    "id": 1,
    "name": "General",
    "description": "General tasks",
    "color": "#FF6B6B"
  },
  {
    "id": 2,
    "name": "Work",
    "description": "Work related tasks",
    "color": "#4ECDC4"
  },
  {
    "id": 3,
    "name": "Personal",
    "description": "Personal tasks",
    "color": "#45B7D1"
  },
  {
    "id": 4,
    "name": "Study",
    "description": "Study and learning tasks",
    "color": "#96CEB4"
  },
  {
    "id": 5,
    "name": "Health",
    "description": "Health and fitness tasks",
    "color": "#FFEAA7"
  }
]
```

### Tasks

```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the task manager project",
    "categoryId": 2,
    "status": "in_progress",
    "priority": "high",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🔧 Cấu hình

### Port

API chạy trên port **3001**

### CORS

CORS được enable cho `http://localhost:3000` (frontend)

### Environment Variables

Tạo file `.env` nếu cần:

```env
PORT=3001
NODE_ENV=development
```

## 🧪 Test API

### Test với curl

```bash
# Lấy tất cả categories
curl http://localhost:3001/categories

# Lấy tất cả tasks
curl http://localhost:3001/tasks

# Tạo task mới
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","categoryId":1}'
```

### Test với Postman

Import các endpoints vào Postman collection để test dễ dàng hơn.

## 🔗 Blockchain Integration

API này được thiết kế để tích hợp với:

- **Denodo** - Data virtualization layer
- **Ethereum Smart Contracts** - Task management trên blockchain

## 📝 Next Steps

1. **Tích hợp với Denodo** - Thay thế mock data
2. **Blockchain integration** - Kết nối với smart contracts
3. **Authentication** - JWT hoặc Web3 authentication
4. **Database** - PostgreSQL/MongoDB integration

---

**Chúc bạn phát triển thành công! 🚀**
