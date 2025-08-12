# Denodo Data - Data Virtualization Layer

## 🎯 Mục tiêu

Thiết lập Denodo Express để ảo hóa dữ liệu danh mục nhiệm vụ từ file CSV và xuất bản dưới dạng REST API.

## 📁 Cấu trúc thư mục

```
DenodoData/
├── data/                   # Dữ liệu nguồn
│   ├── categories.csv      # File CSV chứa danh mục nhiệm vụ
│   └── tasks.csv          # File CSV chứa dữ liệu nhiệm vụ mẫu
├── denodo-config/          # Cấu hình Denodo Express
│   ├── views/              # Định nghĩa views
│   │   ├── categories_view.vql
│   │   └── tasks_view.vql
│   └── web_services/       # Cấu hình REST API
│       └── task_manager_ws.xml
├── scripts/                # Scripts setup và maintenance
│   ├── setup_denodo.sql
│   └── sample_data.sql
└── README.md               # Hướng dẫn này
```

## 🚀 Kế hoạch thực hiện

### Phase 1: Thiết lập Denodo Express

- [ ] Tải và cài đặt Denodo Express (phiên bản miễn phí)
- [ ] Khởi động Denodo Express Server
- [ ] Truy cập Denodo Administration Tool
- [ ] Tạo database và user accounts

### Phase 2: Chuẩn bị dữ liệu

- [ ] Tạo file categories.csv với cấu trúc:
  - id: Unique identifier
  - name: Tên danh mục
  - description: Mô tả danh mục
  - color: Màu sắc đại diện
  - created_at: Thời gian tạo
- [ ] Tạo file tasks.csv với cấu trúc:
  - id: Unique identifier
  - title: Tiêu đề nhiệm vụ
  - description: Mô tả nhiệm vụ
  - category_id: ID danh mục
  - status: Trạng thái (pending, in_progress, completed)
  - priority: Độ ưu tiên (low, medium, high)
  - created_at: Thời gian tạo
  - updated_at: Thời gian cập nhật

### Phase 3: Tạo Data Views

- [ ] Tạo Base View cho categories từ file CSV
- [ ] Tạo Base View cho tasks từ file CSV
- [ ] Tạo Derived View kết hợp categories và tasks
- [ ] Cấu hình data types và constraints

### Phase 4: Xuất bản REST API

- [ ] Tạo Web Service cho categories endpoint
- [ ] Tạo Web Service cho tasks endpoint
- [ ] Cấu hình CORS và security
- [ ] Test API endpoints với Postman/curl

### Phase 5: Tích hợp với Backend

- [ ] Cung cấp API documentation cho NestJS
- [ ] Test kết nối từ NestJS backend
- [ ] Implement error handling và retry logic
- [ ] Performance testing và optimization

## 🔧 Công nghệ sử dụng

- **Denodo Express**: Data virtualization platform
- **CSV Files**: Data source format
- **VQL**: Denodo View Query Language
- **REST API**: Web service interface
- **XML Configuration**: Web service configuration

## 📝 Lưu ý quan trọng

- Denodo Express phải chạy trước khi khởi động NestJS backend
- File CSV phải có encoding UTF-8 để hỗ trợ tiếng Việt
- Cần backup dữ liệu CSV định kỳ
- API endpoints sẽ chạy trên port mặc định của Denodo
- Cấu hình CORS để cho phép NestJS backend truy cập
- Monitor performance và optimize queries nếu cần

## 🌐 API Endpoints

- `GET /denodo/api/categories` - Lấy tất cả danh mục
- `GET /denodo/api/categories/{id}` - Lấy danh mục theo ID
- `GET /denodo/api/tasks` - Lấy tất cả nhiệm vụ
- `GET /denodo/api/tasks/{id}` - Lấy nhiệm vụ theo ID
- `GET /denodo/api/categories/{id}/tasks` - Lấy nhiệm vụ theo danh mục
