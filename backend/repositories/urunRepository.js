const db = require("../config/db");

class UrunRepository {
  // Sadece aktif olan (silinmemiş) ürünleri getir
  getAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM urunler WHERE aktif_mi = 1", [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  // Yeni ürün ekle
  create(urun) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO urunler (ad, kategori, fiyat) VALUES (?, ?, ?)";
      db.run(query, [urun.ad, urun.kategori, urun.fiyat], function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID, ...urun });
      });
    });
  }

  // Ürün Güncelle
  update(id, urun) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE urunler SET ad = ?, kategori = ?, fiyat = ?, stokDurumu = ? WHERE id = ?";
      db.run(
        query,
        [urun.ad, urun.kategori, urun.fiyat, urun.stokDurumu, id],
        function (err) {
          if (err) reject(err);
          resolve(this.changes); // Etkilenen satır sayısını döner
        },
      );
    });
  }

  // Soft Delete (Ürünü silme, sadece aktifliğini 0 yap)
  softDelete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE urunler SET aktif_mi = 0 WHERE id = ?",
        id,
        function (err) {
          if (err) reject(err);
          resolve(this.changes);
        },
      );
    });
  }
}

module.exports = new UrunRepository();
