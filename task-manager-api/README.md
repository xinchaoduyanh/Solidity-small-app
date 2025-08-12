# Task Manager API - NestJS Backend

## 🎯 Mục tiêu

Xây dựng API Gateway sử dụng NestJS để kết nối frontend với Denodo Express và cung cấp các endpoint quản lý nhiệm vụ.

## 📁 Cấu trúc thư mục

```
task-manager-api/
├── src/                    # Mã nguồn NestJS
│   ├── main.ts            # Entry point của ứng dụng
│   ├── app.module.ts      # Module gốc
│   ├── denodo-api/        # Service gọi Denodo API
│   │   └── denodo-api.service.ts
│   ├── categories/        # Controller API danh mục
│   │   └── categories.controller.ts
│   ├── tasks/             # Controller API nhiệm vụ
│   │   └── tasks.controller.ts
│   └── prisma/            # Prisma service và models
│       ├── prisma.service.ts
│       └── prisma.module.ts
├── prisma/                 # Cấu hình Prisma
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── .env                    # Biến môi trường
└── package.json            # Dependencies và scripts
```

## 🚀 Kế hoạch thực hiện

### Phase 1: Thiết lập môi trường

- [ ] Khởi tạo dự án NestJS với TypeScript
- [ ] Cài đặt Prisma và cấu hình database
- [ ] Cài đặt các dependencies cần thiết
- [ ] Cấu hình CORS để cho phép frontend truy cập

### Phase 2: Kết nối với Denodo Express

- [ ] Tạo DenodoApiService để gọi REST API từ Denodo
- [ ] Implement các methods để lấy dữ liệu danh mục
- [ ] Xử lý lỗi và retry logic
- [ ] Cache dữ liệu để tối ưu performance

### Phase 3: API Endpoints

- [ ] Categories Controller:
  - [ ] GET /categories - Lấy tất cả danh mục
  - [ ] GET /categories/:id - Lấy danh mục theo ID
- [ ] Tasks Controller:
  - [ ] GET /tasks - Lấy danh sách nhiệm vụ
  - [ ] POST /tasks - Tạo nhiệm vụ mới
  - [ ] PUT /tasks/:id - Cập nhật nhiệm vụ
  - [ ] DELETE /tasks/:id - Xóa nhiệm vụ

### Phase 4: Database Integration

- [ ] Thiết kế Prisma schema cho tasks và categories
- [ ] Tạo Prisma service để tương tác với database
- [ ] Implement data validation và error handling
- [ ] Tạo database migrations

### Phase 5: Testing & Documentation

- [ ] Viết unit tests cho services
- [ ] Viết integration tests cho controllers
- [ ] Tạo API documentation với Swagger
- [ ] Performance testing và optimization

## 🔧 Công nghệ sử dụng

- **NestJS**: Framework Node.js với TypeScript
- **Prisma**: ORM cho database management
- **Axios**: HTTP client để gọi Denodo API
- **Class-validator**: Data validation
- **Swagger**: API documentation

## 📝 Lưu ý quan trọng

- API sẽ chạy trên port 3001 (khác với frontend Next.js port 3000)
- Cần cấu hình CORS đúng để frontend có thể truy cập
- Denodo Express phải chạy trước khi khởi động NestJS
- Database sẽ lưu trữ dữ liệu nhiệm vụ local, blockchain chỉ lưu trữ hash/ID
