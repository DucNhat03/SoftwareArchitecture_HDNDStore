const { urlencoded } = require("body-parser");
const express = require("express");
const app = express();
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const fs = require('fs');
const config = require("./config");
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("./public"));

let ipnUrl = "";

// Cố gắng đọc URL từ file ngrok_url.txt (được tạo từ start.sh)
const getIpnUrl = () => {
  const possiblePaths = [
    '/tmp/ngrok_url.txt',  // Trong Docker container
    './ngrok_url.txt',     // Trong thư mục hiện tại (môi trường dev)
    path.join(__dirname, 'ngrok_url.txt')  // Đường dẫn tuyệt đối
  ];
  
  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const url = fs.readFileSync(filePath, 'utf8').trim();
        console.log(`✅ Đọc được URL callback từ file ${filePath}:`, url);
        return url;
      }
    } catch (err) {
      console.error(`❌ Lỗi khi đọc file ${filePath}:`, err.message);
    }
  }
  
  // Fallback URL nếu không đọc được từ file
  if (process.env.NODE_ENV === 'production') {
    console.log("⚠️ Sử dụng URL fallback cho Docker");
    return `http://payment-service:${process.env.PORT || 5003}/callback`;
  } else {
    console.log("⚠️ Sử dụng URL fallback cho local");
    return `http://localhost:${process.env.PORT || 5003}/callback`;
  }
};

// Health check endpoint
app.get("/health", (req, res) => {
  // Đảm bảo ipnUrl được thiết lập
  if (!ipnUrl) {
    ipnUrl = getIpnUrl();
  }
  res.status(200).json({ status: "Payment Service is running", ipnUrl });
});

app.post("/payment", async (req, res) => {
  // Đảm bảo ipnUrl được thiết lập
  if (!ipnUrl) {
    ipnUrl = getIpnUrl();
  }

  const {
    accessKey,
    secretKey,
    partnerCode,
    redirectUrl,
    requestType,
    orderGroupId,
    autoCapture,
    lang,
  } = config;

  const amount = req.body.amount;
  const order = req.body.orderId;
  const orderInfo = order;
  const extraData = order;
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;

  const rawSignature =
    `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    orderGroupId,
    signature,
  };

  try {
    console.log("💰 Gửi yêu cầu thanh toán tới MoMo");
    console.log("💳 Số tiền:", amount);
    console.log("🔗 ipnUrl:", ipnUrl);
    
    const result = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log("✅ Nhận được phản hồi từ MoMo:", result.data.payUrl ? "Success" : "Failed");
    return res.status(200).json(result.data);
  } catch (error) {
    console.error("❌ Payment request error:", error.message);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
});

app.post("/callback", async (req, res) => {
  try {
    console.log("📞 callback received:", req.body);

    const { orderId, resultCode, message, transId, extraData, orderInfo } = req.body;

    console.log("🆔 orderId (momo):", orderId);
    console.log("🆔 orderId (hệ thống):", extraData);
    console.log("🔄 transId:", transId);
    console.log("💬 message:", message);

    if (resultCode === 0) {
      // Truyền qua params trong URL
      await axios.put(`http://product-service:5002/api/orders/payment`, null, {
        params: {
          orderId: orderInfo,
          statusPayment: "Đã thanh toán",
          paymentMethod: "Ví điện tử",
        },
      });
      console.log("✅ Đã cập nhật trạng thái thanh toán!");
    } else {
      console.log("❌ Giao dịch thất bại:", message);
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("❌ Callback error:", error.message);
    return res.sendStatus(500);
  }
});

// Kiểm tra trạng thái
app.post("/check-status-transaction", async (req, res) => {
  const { orderId } = req.body;
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const accessKey = "F8BBA842ECF85";

  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
  const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

  const requestBody = {
    partnerCode: "MOMO",
    requestId: orderId,
    orderId,
    signature,
    lang: "vi",
  };

  try {
    const result = await axios.post("https://test-payment.momo.vn/v2/gateway/api/query", requestBody, {
      headers: { "Content-Type": "application/json" },
    });
    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5003;

// Thiết lập URL callback khi khởi động
ipnUrl = getIpnUrl();

// Khởi động server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running at port ${PORT}`);
  console.log(`🔗 Using callback URL: ${ipnUrl}`);
});

// Xử lý tắt server
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('🏁 HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('🏁 HTTP server closed');
  });
});
