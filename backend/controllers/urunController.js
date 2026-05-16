const urunService = require("../services/urunService");

// Bütün ürünleri getir
const getUrunler = async (req, res) => {
  try {
    const urunler = await urunService.listele();
    res.status(200).json({ urunler });
  } catch (error) {
    res.status(500).json({ hata: "Ürünler listelenirken bir hata oluştu." });
  }
};

// Yeni ürün ekle
const createUrun = async (req, res) => {
  try {
    // Dikkat: Boş veri kontrollerini artık Middleware kapıda hallettiği için
    // burada sadece gelen temiz veriyi Service'e gönderiyoruz!
    const yeniUrun = await urunService.ekle(req.body);
    res.status(201).json({ mesaj: "Ürün başarıyla eklendi.", urun: yeniUrun });
  } catch (error) {
    res.status(500).json({ hata: error.message });
  }
};

// Ürün güncelle
const updateUrun = async (req, res) => {
  try {
    const { id } = req.params;
    await urunService.guncelle(id, req.body);
    res.status(200).json({ mesaj: "Ürün bilgileri başarıyla güncellendi." });
  } catch (error) {
    if (error.message.includes("bulunamadı")) {
      return res.status(404).json({ mesaj: error.message });
    }
    res.status(500).json({ hata: error.message });
  }
};

// Ürün sil (Soft Delete)
const deleteUrun = async (req, res) => {
  try {
    const { id } = req.params;
    await urunService.sil(id);
    res
      .status(200)
      .json({ mesaj: "Ürün başarıyla menüden kaldırıldı (Soft Delete)." });
  } catch (error) {
    if (error.message.includes("bulunamadı")) {
      return res.status(404).json({ mesaj: error.message });
    }
    res.status(500).json({ hata: error.message });
  }
};

module.exports = {
  getUrunler,
  createUrun,
  updateUrun,
  deleteUrun,
};
