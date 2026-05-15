const db = require("../config/db");

// Bütün ürünleri getir (READ)
const getUrunler = (req, res) => {
  db.all("SELECT * FROM urunler", [], (err, rows) => {
    if (err) return res.status(500).json({ hata: err.message });
    res.json({ urunler: rows });
  });
};

// Yeni ürün ekle (CREATE)
const createUrun = (req, res) => {
  const { ad, kategori, fiyat } = req.body;

  // Basit Veri Doğrulama (Validation)
  if (!ad || !kategori || !fiyat) {
    return res.status(400).json({
      mesaj: "Lütfen ad, kategori ve fiyat alanlarını eksiksiz doldurun.",
    });
  }

  const query = "INSERT INTO urunler (ad, kategori, fiyat) VALUES (?, ?, ?)";
  db.run(query, [ad, kategori, fiyat], function (err) {
    if (err) return res.status(500).json({ hata: err.message });
    res.status(201).json({
      id: this.lastID,
      ad,
      kategori,
      fiyat,
      mesaj: "Ürün başarıyla eklendi.",
    });
  });
};

// Ürün güncelle (UPDATE)
const updateUrun = (req, res) => {
  const { id } = req.params;
  const { ad, kategori, fiyat, stokDurumu } = req.body;

  const query =
    "UPDATE urunler SET ad = ?, kategori = ?, fiyat = ?, stokDurumu = ? WHERE id = ?";
  db.run(query, [ad, kategori, fiyat, stokDurumu, id], function (err) {
    if (err) return res.status(500).json({ hata: err.message });
    if (this.changes === 0)
      return res.status(404).json({ mesaj: "Güncellenecek ürün bulunamadı." });
    res.json({ mesaj: "Ürün başarıyla güncellendi." });
  });
};

// Ürün sil (DELETE)
const deleteUrun = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM urunler WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ hata: err.message });
    if (this.changes === 0)
      return res.status(404).json({ mesaj: "Silinecek ürün bulunamadı." });
    res.json({ mesaj: "Ürün başarıyla silindi." });
  });
};

// Fonksiyonları diğer dosyalarda kullanabilmek için dışa aktarıyoruz
module.exports = {
  getUrunler,
  createUrun,
  updateUrun,
  deleteUrun,
};
