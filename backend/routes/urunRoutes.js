const express = require("express");
const router = (module.exports = express.Router());
const multer = require("multer");
const path = require("path");
const urunRepository = require("../repositories/urunRepository");

// Resim Yükleme Ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Resimler backend/uploads içine gider
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// 1. Tüm Ürünleri Getir
router.get("/", async (req, res) => {
  try {
    const urunler = await urunRepository.getAll();
    res.json(urunler);
  } catch (error) {
    res
      .status(500)
      .json({ hata: "Ürünler getirilirken hata oluştu: " + error.message });
  }
});

// 2. Yeni Ürün Ekle (stokDurumu pakete dahil edildi!)
router.post("/", upload.single("resim"), async (req, res) => {
  try {
    const yeniUrun = {
      ad: req.body.ad,
      kategori: req.body.kategori,
      fiyat: req.body.fiyat,
      stokDurumu: req.body.stokDurumu, // İŞTE EKSİK OLAN VE ARTIK YAKALANAN VERİ!
      resim_url: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const sonuc = await urunRepository.create(yeniUrun);
    res.status(201).json(sonuc);
  } catch (error) {
    res
      .status(500)
      .json({ hata: "Ürün eklenirken hata oluştu: " + error.message });
  }
});

// 3. Ürün Güncelle
router.put("/:id", upload.single("resim"), async (req, res) => {
  try {
    const id = req.params.id;
    const guncelUrun = {
      ad: req.body.ad,
      kategori: req.body.kategori,
      fiyat: req.body.fiyat,
      stokDurumu: req.body.stokDurumu,
      resim_url: req.file ? `/uploads/${req.file.filename}` : null,
    };

    await urunRepository.update(id, guncelUrun);
    res.json({ mesaj: "Ürün başarıyla güncellendi." });
  } catch (error) {
    res.status(500).json({ hata: error.message });
  }
});

// 4. Ürün Sil
router.delete("/:id", async (req, res) => {
  try {
    await urunRepository.softDelete(req.params.id);
    res.json({ mesaj: "Ürün başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ hata: error.message });
  }
});

module.exports = router;
