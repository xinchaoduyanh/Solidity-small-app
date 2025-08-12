-- Script thiết lập Denodo Express cho dự án Task Manager
-- Chạy script này trong Denodo Administration Tool

-- 1. Tạo database cho dự án
CREATE DATABASE task_manager_db;

-- 2. Sử dụng database
USE task_manager_db;

-- 3. Tạo Base View cho categories từ file CSV
CREATE OR REPLACE VIEW categories_view AS
SELECT 
    CAST(id AS INTEGER) AS id,
    name,
    description,
    color,
    CAST(created_at AS TIMESTAMP) AS created_at
FROM EXTERNAL_OBJECT(
    'categories.csv',
    'CSV',
    'id,INTEGER;name,VARCHAR(255);description,TEXT;color,VARCHAR(10);created_at,TIMESTAMP',
    'UTF-8',
    ',',
    '"',
    'true'
);

-- 4. Tạo Base View cho tasks từ file CSV
CREATE OR REPLACE VIEW tasks_view AS
SELECT 
    CAST(id AS INTEGER) AS id,
    title,
    description,
    CAST(category_id AS INTEGER) AS category_id,
    status,
    priority,
    CAST(created_at AS TIMESTAMP) AS created_at,
    CAST(updated_at AS TIMESTAMP) AS updated_at
FROM EXTERNAL_OBJECT(
    'tasks.csv',
    'CSV',
    'id,INTEGER;title,VARCHAR(255);description,TEXT;category_id,INTEGER;status,VARCHAR(20);priority,VARCHAR(10);created_at,TIMESTAMP;updated_at,TIMESTAMP',
    'UTF-8',
    ',',
    '"',
    'true'
);

-- 5. Tạo Derived View kết hợp categories và tasks
CREATE OR REPLACE VIEW tasks_with_categories_view AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.created_at,
    t.updated_at,
    c.id AS category_id,
    c.name AS category_name,
    c.description AS category_description,
    c.color AS category_color
FROM tasks_view t
LEFT JOIN categories_view c ON t.category_id = c.id;

-- 6. Tạo view thống kê theo danh mục
CREATE OR REPLACE VIEW category_stats_view AS
SELECT 
    c.id,
    c.name,
    c.color,
    COUNT(t.id) AS total_tasks,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
    SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
    SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) AS pending_tasks
FROM categories_view c
LEFT JOIN tasks_view t ON c.id = t.category_id
GROUP BY c.id, c.name, c.color;

-- 7. Tạo view thống kê theo priority
CREATE OR REPLACE VIEW priority_stats_view AS
SELECT 
    priority,
    COUNT(*) AS total_tasks,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_tasks
FROM tasks_view
GROUP BY priority;

-- 8. Tạo view tasks theo ngày
CREATE OR REPLACE VIEW daily_tasks_view AS
SELECT 
    DATE(created_at) AS task_date,
    COUNT(*) AS total_tasks,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_tasks
FROM tasks_view
GROUP BY DATE(created_at)
ORDER BY task_date DESC;

-- 9. Kiểm tra views đã tạo
SELECT 'categories_view' AS view_name, COUNT(*) AS record_count FROM categories_view
UNION ALL
SELECT 'tasks_view' AS view_name, COUNT(*) AS record_count FROM tasks_view
UNION ALL
SELECT 'tasks_with_categories_view' AS view_name, COUNT(*) AS record_count FROM tasks_with_categories_view;
