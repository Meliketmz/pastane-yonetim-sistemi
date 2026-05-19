const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const kullaniciRepository = require("../repositories/kullaniciRepository");

// JWT için gizli anahtarımız
const SECRET_KEY = "pastane_gizli_anahtar_123";

// 1. Kullanıcı Kayıt (Register)
router.post("/register", async (req, res) => {
  try {
    const { ad_soyad, email, sifre } = req.body;

    const mevcutKullanici = await kullaniciRepository.findByEmail(email);
    if (mevcutKullanici) {
      return res
        .status(400)
        .json({ hata: "Bu e-posta adresi zaten kullanılıyor." });
    }

    const hashedPassword = await bcrypt.hash(sifre, 10);
    const yeniKullanici = await kullaniciRepository.create(
      ad_soyad,
      email,
      hashedPassword,
    );

    res.status(201).json({
      mesaj: "Kullanıcı başarıyla oluşturuldu.",
      kullanici: yeniKullanici,
    });
  } catch (error) {
    res
      .status(500)
      .json({ hata: "Kayıt sırasında hata oluştu: " + error.message });
  }
});

// 2. Kullanıcı Giriş (Login) - PAKETLEME FORMATI DÜZELTİLDİ
router.post("/login", async (req, res) => {
  try {
    const { email, sifre } = req.body;
    const kullanici = await kullaniciRepository.findByEmail(email);

    if (!kullanici) {
      return res.status(401).json({ hata: "E-posta veya şifre hatalı." });
    }

    const sifreDogruMu = await bcrypt.compare(sifre, kullanici.sifre);
    if (!sifreDogruMu) {
      return res.status(401).json({ hata: "E-posta veya şifre hatalı." });
    }

    await kullaniciRepository.logLogin(kullanici.ad_soyad, kullanici.email);

    const token = jwt.sign(
      {
        id: kullanici.id,
        email: kullanici.email,
        ad_soyad: kullanici.ad_soyad,
        rol: kullanici.rol,
      },
      SECRET_KEY,
      { expiresIn: "24h" },
    );

    // İŞTE ÇÖZÜM: login.html'nin beklediği "kullanici" paketini (objesini) tekrar oluşturduk!
    res.json({
      mesaj: "Giriş başarılı",
      token: token,
      kullanici: {
        ad_soyad: kullanici.ad_soyad,
        email: kullanici.email,
        rol: kullanici.rol,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ hata: "Giriş sırasında hata oluştu: " + error.message });
  }
});

// 3. Şifre Güncelleme Rotası
router.put("/sifre-guncelle", async (req, res) => {
  try {
    const { email, yeniSifre } = req.body;
    const hashedPassword = await bcrypt.hash(yeniSifre, 10);
    const degisenSatir = await kullaniciRepository.updatePassword(
      email,
      hashedPassword,
    );

    if (degisenSatir > 0) {
      res.json({ mesaj: "Şifreniz başarıyla güncellendi." });
    } else {
      res.status(404).json({ hata: "Kullanıcı bulunamadı." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ hata: "Şifre güncellenirken hata oluştu: " + error.message });
  }
});

// 4. Giriş Kayıtlarını (Logları) Getirme Rotası
router.get("/giris-kayitlari", async (req, res) => {
  try {
    const loglar = await kullaniciRepository.getLoginLogs();
    res.json(loglar);
  } catch (error) {
    res.status(500).json({
      hata: "Giriş kayıtları getirilirken hata oluştu: " + error.message,
    });
  }
});

module.exports = router;
