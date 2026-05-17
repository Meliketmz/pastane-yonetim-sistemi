const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Veritabanı dosyasının tam yolu (backend/pastane.sqlite)
const dbPath = path.resolve(__dirname, "../pastane.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Veritabanı bağlantı hatası:", err.message);
  } else {
    console.log("SQLite Veritabanına başarıyla bağlanıldı.");

    // TABLO OLUŞTURMA: Sunucu her açıldığında bu kontrolü otomatik yapar
    db.run(
      `
      CREATE TABLE IF NOT EXISTS kullanicilar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ad_soyad TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        sifre TEXT NOT NULL,
        olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (tableErr) => {
        if (tableErr) {
          console.error(
            "Kullanıcılar tablosu oluşturulamadı:",
            tableErr.message,
          );
        } else {
          console.log("Kullanıcılar tablosu hazır.");
        }
      },
    );
  }
});

module.exports = db;
