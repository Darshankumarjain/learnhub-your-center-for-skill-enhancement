const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const DBConnection = require('./config/connect')
const path = require("path");
const fs = require('fs')

const app = express()
dotenv.config()
DBConnection()

const PORT = process.env.PORT || 8000
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
  : true
const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, "uploads")

app.use(express.json())
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.get("/", (req, res) => {
  res.json({ success: true, message: "LearnHub API is running" });
});
app.get("/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/uploads", express.static(uploadsDir));
app.use('/api/admin', require('./routers/adminRoutes'))
app.use('/api/user', require('./routers/userRoutes'))

app.listen(PORT, () => console.log(`running on ${PORT}`))
