const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // Veritabanı bağlantımızı ekledik

const app = express();
const PORT = 3000;

// Middleware'ler
app.use(cors());
app.use(express.json());

// Temel Test Route'u
app.get("/api", (req, res) => {
  res.json({ mesaj: "Butik Pastane API'sine Hosgeldiniz!" });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde calisiyor...`);
});
