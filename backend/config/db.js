const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// YOL DÜZELTİLDİ: ../pastane.sqlite (Doğrudan backend klasörünün dışındaki asıl dosyaya bakar)
const dbPath = path.resolve(__dirname, "../pastane.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Veritabanına bağlanılamadı:", err.message);
  } else {
    console.log("SQLite veritabanına başarıyla bağlanıldı.");

    const createLogsTable = `
            CREATE TABLE IF NOT EXISTS giris_kayitlari (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ad_soyad TEXT NOT NULL,
                email TEXT NOT NULL,
                giris_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

    db.run(createLogsTable, (err) => {
      if (err) {
        console.error(
          "Giriş kayıtları tablosu oluşturulurken hata:",
          err.message,
        );
      } else {
        console.log("Giriş kayıtları (Audit Log) tablosu hazır.");
      }
    });
  }
});

module.exports = db;
