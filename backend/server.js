// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

// Rotaları İçeri Aktarıyoruz
const authRoutes = require("./routes/authRoutes");
const urunRoutes = require("./routes/urunRoutes"); // Senin eski ürün rotan (Burası önemli)

const app = express();

// Middleware'ler (Sunucu Ayarları)
app.use(cors()); // Farklı portların (Frontend-Backend) haberleşmesine izin ver
app.use(express.json()); // Gelen JSON verilerini okuyabilmeyi sağla

// Resim klasörünü (uploads) dış dünyaya açıyoruz ki pastaların resimleri gözüksün
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotaları Kullanıma Açıyoruz
app.use("/api/auth", authRoutes);
app.use("/api/urunler", urunRoutes);

// Sunucuyu Başlat
const PORT = 3000;
app.listen(PORT, () => {
  console.log(
    `Pastane Yönetim Sistemi Backend'i ${PORT} portunda başarıyla çalışıyor 🚀`,
  );
});
