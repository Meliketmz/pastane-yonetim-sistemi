const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const db = require("./config/db");
const urunRoutes = require("./routes/urunRoutes");

const app = express();
const PORT = 3000;

// Swagger'ı YAML yerine Javascript Objesi (JSON) olarak tanımlıyoruz
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Butik Pastane API",
    version: "1.0.0",
    description: "Elif'in Butik Pastanesi için Menü ve Ürün Yönetimi API'si",
  },
  servers: [{ url: `http://localhost:${PORT}` }],
  paths: {
    "/api/urunler": {
      get: {
        summary: "Tüm ürünleri listeler",
        responses: { 200: { description: "Başarılı" } },
      },
      post: {
        summary: "Yeni ürün ekler",
        responses: { 201: { description: "Ürün başarıyla eklendi" } },
      },
    },
    "/api/urunler/{id}": {
      put: {
        summary: "Ürün günceller",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Güncellendi" } },
      },
      delete: {
        summary: "Ürünü siler",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Silindi" } },
      },
    },
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware'ler (Sadece bir kez tanımlıyoruz)
app.use(cors());
app.use(express.json());

// Resimleri dış dünyaya (Frontend'e) açıyoruz
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Rotalarını Kullan
app.use("/api/urunler", urunRoutes);

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde calisiyor...`);
  console.log(`Swagger Dokümantasyonu: http://localhost:${PORT}/api-docs`);
});
