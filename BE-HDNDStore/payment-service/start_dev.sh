#!/bin/bash

# Script dành cho môi trường phát triển

# Cài đặt ngrok nếu chưa có
if ! command -v ngrok &> /dev/null
then
    echo "ngrok không tìm thấy, đang cài đặt..."
    # Tải ngrok dựa vào hệ điều hành
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -s https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz -o ngrok.tgz
        tar xvzf ngrok.tgz -C /tmp
        sudo mv /tmp/ngrok /usr/local/bin
        rm ngrok.tgz
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        curl -s https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-amd64.tgz -o ngrok.tgz
        tar xvzf ngrok.tgz -C /tmp
        sudo mv /tmp/ngrok /usr/local/bin
        rm ngrok.tgz
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        # Windows
        echo "Trên Windows, vui lòng tải và cài đặt ngrok từ: https://ngrok.com/download"
        echo "Sau đó thêm vào PATH và chạy lại script này"
        exit 1
    fi
    echo "ngrok đã được cài đặt!"
fi

# Thiết lập authtoken cho ngrok
if [ -n "$NGROK_AUTHTOKEN" ]; then
    ngrok config add-authtoken $NGROK_AUTHTOKEN
else
    echo "NGROK_AUTHTOKEN không được thiết lập. Đang sử dụng token mặc định nếu có..."
fi

# Khởi động ngrok
echo "Khởi động ngrok..."
ngrok http 5003 > /dev/null &
NGROK_PID=$!

# Đợi ngrok khởi động
sleep 5
echo "Đợi ngrok khởi động..."

# Lấy URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'http[^"]*')

if [ -z "$NGROK_URL" ]; then
    echo "Không thể lấy URL từ ngrok API"
    echo "http://localhost:5003/callback" > ngrok_url.txt
else
    echo "Ngrok URL: $NGROK_URL"
    echo "${NGROK_URL}/callback" > ngrok_url.txt
    echo "URL callback đã được lưu vào file ngrok_url.txt"
fi

# Khởi động server Node.js với nodemon
npm run dev

# Dọn dẹp khi thoát
trap "kill $NGROK_PID" EXIT 