const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const AUTH_SERVICE_URL = "http://localhost:5001";
const USER_SERVICE_URL = "http://localhost:5002";
const ORDER_SERVICE_URL = "http://localhost:5003";

// Điều hướng API tới các services
app.use("/api/auth", (req, res) => axios({ url: `${AUTH_SERVICE_URL}${req.url}`, method: req.method, data: req.body }).then(r => res.json(r.data)).catch(err => res.status(500).json(err)));
app.use("/api/user", (req, res) => axios({ url: `${USER_SERVICE_URL}${req.url}`, method: req.method, data: req.body }).then(r => res.json(r.data)).catch(err => res.status(500).json(err)));
app.use("/api/order", (req, res) => axios({ url: `${ORDER_SERVICE_URL}${req.url}`, method: req.method, data: req.body }).then(r => res.json(r.data)).catch(err => res.status(500).json(err)));

app.listen(5000, () => console.log("API Gateway chạy trên cổng 5000"));
