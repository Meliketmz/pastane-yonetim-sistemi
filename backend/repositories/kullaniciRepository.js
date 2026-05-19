const db = require("../config/db");
// Not: Uyumsuzluk yarattığı için Kullanici modelini aradan çıkardık.

class KullaniciRepository {
  // 1. E-posta adresine göre kullanıcı arama (GÜNCELLENDİ)
  findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM kullanicilar WHERE email = ?`;
      db.get(query, [email], (err, row) => {
        if (err) return reject(err);
        // Modeli aradan çıkardık, doğrudan veritabanından gelen saf veriyi (row) iletiyoruz!
        resolve(row);
      });
    });
  }

  // 2. Yeni kullanıcı kaydetme
  create(ad_soyad, email, hashedPassword) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO kullanicilar (ad_soyad, email, sifre) VALUES (?, ?, ?)`;
      db.run(query, [ad_soyad, email, hashedPassword], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ad_soyad, email, rol: "kullanici" });
      });
    });
  }

  // 3. Sadece Şifre Güncelleme
  updatePassword(email, newHashedPassword) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE kullanicilar SET sifre = ? WHERE email = ?`;
      db.run(query, [newHashedPassword, email], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }

  // 4. Başarılı Girişi Log Tablosuna Kaydetme
  logLogin(ad_soyad, email) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO giris_kayitlari (ad_soyad, email) VALUES (?, ?)`;
      db.run(query, [ad_soyad, email], function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  }

  // 5. Giriş Loglarını Getirme
  getLoginLogs() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM giris_kayitlari ORDER BY giris_tarihi DESC LIMIT 50`;
      db.all(query, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = new KullaniciRepository();
