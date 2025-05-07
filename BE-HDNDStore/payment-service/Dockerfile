FROM node:18-alpine

WORKDIR /app

# Cài đặt các công cụ cần thiết cho ngrok
RUN apk add --no-cache python3 make g++ curl wget

# Sao chép package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Sao chép mã nguồn
COPY . .

# Cấp quyền thực thi cho script khởi động
RUN chmod +x start.sh

# Expose port
EXPOSE 5003 4040

# Thiết lập ngrok authtoken như biến môi trường
ENV NGROK_AUTHTOKEN=2T8fQw9v3a6MnMzWmTeRP4WQ97q_5TyiMEBqHAcZeiD57k6Dv

# Khởi động ứng dụng sử dụng script start.sh
CMD ["./start.sh"] 