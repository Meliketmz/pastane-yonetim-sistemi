const express = require("express");
const router = express.Router();
const urunController = require("../controllers/urunController");

// CRUD rotalarımız ve onları bağladığımız controller fonksiyonları
router.get("/", urunController.getUrunler); // READ: Tüm ürünleri getir
router.post("/", urunController.createUrun); // CREATE: Yeni ürün ekle
router.put("/:id", urunController.updateUrun); // UPDATE: Ürün güncelle
router.delete("/:id", urunController.deleteUrun); // DELETE: Ürün sil

module.exports = router;
