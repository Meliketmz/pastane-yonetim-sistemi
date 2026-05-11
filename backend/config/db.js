const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Veritabanı dosyasının oluşturulacağı yol
const dbPath = path.resolve(__dirname, "../pastane.sqlite");

// Veritabanı bağlantısını başlat
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Veritabanı bağlantı hatası:", err.message);
  } else {
    console.log("SQLite veritabanına başarıyla bağlanıldı.");

    // Ürünler tablosunu oluştur (Eğer yoksa)
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS urunler (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ad TEXT NOT NULL,
                kategori TEXT NOT NULL,
                fiyat REAL NOT NULL,
                stokDurumu BOOLEAN DEFAULT 1
            )
        `;

    db.run(createTableQuery, (err) => {
      if (err) {
        console.error("Tablo oluşturma hatası:", err.message);
      } else {
        console.log("Urunler tablosu hazır.");
      }
    });
  }
});

module.exports = db;
