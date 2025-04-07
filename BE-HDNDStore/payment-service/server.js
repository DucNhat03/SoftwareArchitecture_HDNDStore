const { urlencoded } = require("body-parser");
const express = require("express");
const app = express();
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const ngrok = require("ngrok");
app.use(cors());
const config = require("./config");

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("./public"));

app.post("/payment", async (req, res) => {
  let {
    accessKey,
    secretKey,
    // orderInfo,
    partnerCode,
    redirectUrl,
    ipnUrl,
    requestType,
    orderGroupId,
    autoCapture,
    lang,
  } = config;

  const amount = req.body.amount;
  const order = req.body.orderId;
  const orderInfo = order;
  console.log("orderInfo:", orderInfo);
  const extraData = order;
  console.log("extraData:", extraData);

  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;

  const rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
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
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
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


app.post("/check-status-transaction", async (req, res) => {
  const { orderId } = req.body;

  var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  var accessKey = "F8BBA842ECF85";
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };

  const result = await axios(options);

  return res.status(200).json(result.data);
});

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
