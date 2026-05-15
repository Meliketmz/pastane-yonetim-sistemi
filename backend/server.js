const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const urunRoutes = require("./routes/urunRoutes"); // Rotaları içe aktardık

const app = express();
const PORT = 3000;

// Middleware'ler
app.use(cors());
app.use(express.json());

// API Rotalarını Kullan
app.use("/api/urunler", urunRoutes);

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde calisiyor...`);
});
