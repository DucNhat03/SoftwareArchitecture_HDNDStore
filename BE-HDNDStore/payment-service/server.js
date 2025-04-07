const { urlencoded } = require("body-parser");
const express = require("express");
const app = express();
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const ngrok = require("ngrok");
app.use(cors());
const config = require("./config");
const { console } = require("inspector/promises");

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("./public"));

app.post("/payment", async (req, res) => {
  let {
    accessKey,
    secretKey,
    orderInfo,
    partnerCode,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
    orderGroupId,
    autoCapture,
    lang,
  } = config;

  const amount = req.body.amount;
  const order = req.body.orderId;
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  console.log("order: ", order);

  var rawSignature =
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
    requestType +
    "&order=" +
    order;

  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
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

  let result;
  try {
    result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
});

app.post("/callback", async (req, res) => {
  console.log("callback: ");
  console.log(req.body);

  const { orderId, resultCode, message, transId, order } = req.body;
  console.log("orderId: ", orderId);
  console.log("resultCode: ", resultCode);
  console.log("message: ", message);
  console.log("transId: ", transId);
  console.log("order: ", order);

  return res.status(204).json(req.body);
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
