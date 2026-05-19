// backend/services/authService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const kullaniciRepository = require("../repositories/kullaniciRepository");

// JWT için gizli anahtar (Gerçek projelerde .env dosyasında saklanmalı)
const JWT_SECRET_KEY = "benim_gizli_pastane_anahtarim";

class AuthService {
  // Kayıt Olma İşlemleri
  async kayitOl(ad_soyad, email, sifre) {
    // İş Kuralı 1: Mail adresi kullanılıyor mu?
    const mevcutKullanici = await kullaniciRepository.findByEmail(email);
    if (mevcutKullanici) {
      throw new Error("Bu e-posta adresi zaten kullanımda.");
    }

    // İş Kuralı 2: Şifre uzunluğu
    if (sifre.length < 6) {
      throw new Error("Şifre en az 6 karakterden oluşmalıdır.");
    }

    // Şifreyi güvenli hale getirme (Hash işlemi)
    const hashedPassword = await bcrypt.hash(sifre, 10);

    // Kullanıcıyı veritabanına kaydetme
    const yeniKullanici = await kullaniciRepository.create(
      ad_soyad,
      email,
      hashedPassword,
    );
    return yeniKullanici;
  }

  // Giriş Yapma İşlemleri
  async girisYap(email, sifre) {
    // İş Kuralı 1: Kullanıcı var mı ve aktif mi?
    const kullanici = await kullaniciRepository.findByEmail(email);
    if (!kullanici) {
      throw new Error("Hatalı e-posta veya şifre girdiniz.");
    }

    // İş Kuralı 2: Girilen şifre ile veritabanındaki hashlenmiş şifre uyuşuyor mu?
    const sifreDogruMu = await bcrypt.compare(sifre, kullanici.sifre);
    if (!sifreDogruMu) {
      throw new Error("Hatalı e-posta veya şifre girdiniz.");
    }

    // Kimlik kartı (Token) için gerekli bilgileri hazırlama
    const payload = {
      id: kullanici.id,
      email: kullanici.email,
      rol: kullanici.rol,
    };

    // Token oluşturma (1 gün geçerli)
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });

    return {
      id: kullanici.id,
      ad_soyad: kullanici.ad_soyad,
      email: kullanici.email,
      token: token,
    };
  }
}

module.exports = new AuthService();
