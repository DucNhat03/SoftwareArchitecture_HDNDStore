const { urlencoded } = require("body-parser");
const express = require("express");
const app = express();
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const ngrok = require("ngrok");
const config = require("./config");

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("./public"));

let ipnUrl = "";

const startNgrok = async (port) => {
  try {
    const url = await ngrok.connect({
      addr: port,
      proto: "http",
      authtoken: '2T8fQw9v3a6MnMzWmTeRP4WQ97q_5TyiMEBqHAcZeiD57k6Dv',
    });
    ipnUrl = `${url}/callback`; // 👉 Gán ipnUrl sau khi có URL từ ngrok
    console.log("✔ Ngrok started at:", url);
    console.log("✔ ipnUrl:", ipnUrl);
  } catch (err) {
    console.error("Ngrok failed to start:", err.message);
    process.exit(1);
  }
};

app.post("/payment", async (req, res) => {
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
    const result = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
});

app.post("/callback", async (req, res) => {
  try {
    console.log("callback:", req.body);

    const { orderId, resultCode, message, transId, extraData, orderInfo } = req.body;

    console.log("orderId (momo):", orderId);
    console.log("orderId (hệ thống):", extraData);
    console.log("transId:", transId);
    console.log("message:", message);

    if (resultCode === 0) {
      // Truyền qua params trong URL
      await axios.put(`http://localhost:5002/api/orders/payment`, null, {
        params: {
          orderId: orderInfo,
          statusPayment: "Đã thanh toán",
          paymentMethod: "Ví điện tử",
        },
      });
      console.log("Đã cập nhật trạng thái thanh toán!");
    }else {
      console.log("Giao dịch thất bại:", message);
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Callback error:", error.message);
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

const PORT = 5003;

// 👉 Start ngrok trước khi mở server
startNgrok(PORT).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at port ${PORT}`);
  });
});
