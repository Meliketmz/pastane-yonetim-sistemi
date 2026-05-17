const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Kullanıcı Kayıt Rotası (POST /api/auth/register)
router.post("/register", (req, res) => {
  const { ad_soyad, email, sifre } = req.body;

  if (!ad_soyad || !email || !sifre) {
    return res.status(400).json({ hata: "Lütfen tüm alanları doldurun." });
  }

  const sql =
    "INSERT INTO kullanicilar (ad_soyad, email, sifre) VALUES (?, ?, ?)";

  db.run(sql, [ad_soyad, email, sifre], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res
          .status(400)
          .json({ hata: "Bu e-posta adresi zaten kayıtlı." });
      }
      return res
        .status(500)
        .json({ hata: "Veritabanı hatası: " + err.message });
    }
    res.status(201).json({
      mesaj: "Harika! Kayıt başarıyla tamamlandı, şimdi giriş yapabilirsiniz.",
    });
  });
});

module.exports = router;
