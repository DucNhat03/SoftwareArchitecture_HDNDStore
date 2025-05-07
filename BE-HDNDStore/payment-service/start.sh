#!/bin/sh

# Script khởi động cho payment-service với ngrok

# Cài đặt ngrok nếu chưa có
if [ ! -f "/usr/local/bin/ngrok" ]; then
  echo "Downloading ngrok..."
  wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz -O /tmp/ngrok.tgz
  tar -xzf /tmp/ngrok.tgz -C /usr/local/bin
  rm /tmp/ngrok.tgz
  chmod +x /usr/local/bin/ngrok
fi

# Cấu hình authtoken cho ngrok
/usr/local/bin/ngrok authtoken ${NGROK_AUTHTOKEN:-"2T8fQw9v3a6MnMzWmTeRP4WQ97q_5TyiMEBqHAcZeiD57k6Dv"}

# Khởi động ngrok trong background
echo "Starting ngrok..."
/usr/local/bin/ngrok http ${PORT:-5003} --log=stdout > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

# Đợi ngrok khởi động
sleep 5

# Lấy public URL từ ngrok API
echo "Getting ngrok public URL..."
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'http[^"]*' || echo "")

if [ -n "$NGROK_URL" ]; then
  echo "Ngrok started successfully at $NGROK_URL"
  # Lưu URL vào file để Node.js app đọc
  echo "$NGROK_URL/callback" > /tmp/ngrok_url.txt
else
  echo "Failed to get ngrok URL, using fallback"
  if [ "$NODE_ENV" = "production" ]; then
    echo "http://payment-service:$PORT/callback" > /tmp/ngrok_url.txt
  else
    echo "http://localhost:$PORT/callback" > /tmp/ngrok_url.txt
  fi
fi

# Khởi động Node.js app
echo "Starting Node.js application..."
exec node server.js 