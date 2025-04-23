
# 👟 HDND Store - E-commerce Website

## 🛍️ Giới thiệu

**HDND Store** là một website thương mại điện tử chuyên bán giày, được phát triển bởi **nhóm HDND** gồm 4 thành viên. Dự án được xây dựng theo mô hình **kiến trúc microservices**, giúp nâng cao khả năng mở rộng, tính linh hoạt, dễ bảo trì và phát triển lâu dài.


---

## 🧱 Kiến trúc hệ thống
![image](https://github.com/user-attachments/assets/a68b9b0e-cc75-4374-accd-3eefc4387e54)
- 🧑‍💼 **Auth Service** – Xác thực người dùng (**Nguyễn Đức Nhật**)  
- 🛒 **Order Service** – Quản lý đơn hàng (**Trần Quốc Huy**)  
- 📦 **Product Service** – Quản lý sản phẩm (**Trần Quốc Huy**, hỗ trợ: **Phan Nguyễn Đại Dương**)  
- 💳 **Payment Service** – Xử lý thanh toán (**Phan Nguyễn Đại Dương**)  
- ⚙️ **Admin Service** – Quản lý dashboard admin (**Trương Công Duy**)  
- 🌐 **API Gateway** – Giao tiếp trung gian, định tuyến request từ client đến các service  

## 🧰 Công nghệ sử dụng

### 🖥️ Backend

- ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
- 🧩 Microservices Architecture
- 🔀 API Gateway
- 🔐 JWT Authentication

### 💻 Frontend

- ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
- ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
- ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)

---

## 🚀 Đề xuất cải tiến

### 🧠 Trí tuệ nhân tạo (AI/ML)

- Gợi ý sản phẩm theo lịch sử mua hàng (Recommendation System)
- Phân tích hành vi người dùng (heatmap, click tracking)

### 🔍 Search & Filter nâng cao

- Tích hợp ElasticSearch vào Product Service
- Bộ lọc thông minh (giá, size, màu, thương hiệu...)

### 📊 Monitoring & Logging

- Theo dõi hiệu suất qua Prometheus + Grafana
- Ghi log tập trung qua ELK Stack (ElasticSearch - Logstash - Kibana)

### ⚙️ CI/CD + DevOps

- Docker & Docker Compose
- CI/CD với GitHub Actions, deploy lên Render/Vercel/AWS

### 📱 Mobile App

- Phát triển app bằng React Native từ cùng backend

### 🔄 Event-driven Communication

- Dùng Kafka hoặc RabbitMQ để giao tiếp bất đồng bộ giữa các service
- Ví dụ: Gửi email xác nhận đơn hàng sau khi tạo đơn

---

## 📬 Liên hệ

- 📧 Email: hdndstore.cs01@gmail.com

---

## ©️ Bản quyền

Dự án thuộc quyền sở hữu của **Nhóm HDND** – phát triển trong khuôn khổ môn học **Software Architecture – 2025**.

> **© 2025 HDND Team**. All rights reserved.
