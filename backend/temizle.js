const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// YOL DÜZELTİLDİ: temizle.js ile pastane.sqlite aynı klasörde (backend içinde) olduğu için direkt 'pastane.sqlite' hedefliyoruz
const dbPath = path.resolve(__dirname, "pastane.sqlite");
const db = new sqlite3.Database(dbPath);

console.log("🌪️ Büyük sıfırlama operasyonu ASIL veritabanında başlıyor...");

db.serialize(() => {
  // 1. Tüm kullanıcıları istisnasız sil
  db.run("DELETE FROM kullanicilar", function (err) {
    if (err) {
      console.error("❌ Kullanıcılar silinirken hata:", err.message);
    } else {
      console.log(`✅ ${this.changes} adet kullanıcı hesabı tamamen silindi.`);
    }
  });

  // 2. Tüm giriş geçmişini (logları) sil
  db.run("DELETE FROM giris_kayitlari", function (err) {
    if (err) {
      console.error("❌ Giriş kayıtları silinirken hata:", err.message);
    } else {
      console.log(`✅ ${this.changes} adet giriş geçmişi logu temizlendi.`);
    }
  });

  // 3. ID sayaçlarını sıfırla (Yeni kayıtlar 1 numarasından başlasın)
  db.run(
    "DELETE FROM sqlite_sequence WHERE name='kullanicilar' OR name='giris_kayitlari'",
    function (err) {
      if (!err) {
        console.log("✅ ID sayaçları başarıyla sıfırlandı.");
      }
      console.log(
        "🚀 Veritabanı hesaplar açısından tamamen İLK GÜNKÜ haline döndü!",
      );

      // İşlem bitince veritabanı bağlantısını kapat
      db.close();
    },
  );
});
