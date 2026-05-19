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

  // Yeni ürün ekle (stokDurumu sütunu başarıyla dahil edildi!)
  create(urun) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO urunler (ad, kategori, fiyat, stokDurumu, resim_url) VALUES (?, ?, ?, ?, ?)";
      db.run(
        query,
        [
          urun.ad,
          urun.kategori,
          urun.fiyat,
          urun.stokDurumu !== undefined ? urun.stokDurumu : 1, // Eğer seçilmediyse varsayılan 1 yapar
          urun.resim_url || null,
        ],
        function (err) {
          if (err) reject(err);
          resolve({ id: this.lastID, ...urun });
        },
      );
    });
  }

  // Ürün Güncelle
  update(id, urun) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE urunler SET ad = ?, kategori = ?, fiyat = ?, stokDurumu = ?, resim_url = COALESCE(?, resim_url) WHERE id = ?";
      db.run(
        query,
        [
          urun.ad,
          urun.kategori,
          urun.fiyat,
          urun.stokDurumu,
          urun.resim_url || null,
          id,
        ],
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
