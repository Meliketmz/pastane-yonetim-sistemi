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
    const data = req.body;

    // Eğer formdan bir resim dosyası geldiyse, yolunu veritabanına kaydetmek için ekle
    if (req.file) {
      data.resim_url = `/uploads/${req.file.filename}`;
    }

    const yeniUrun = await urunService.ekle(data);
    res.status(201).json({ mesaj: "Ürün başarıyla eklendi.", urun: yeniUrun });
  } catch (error) {
    res.status(500).json({ hata: error.message });
  }
};

// Ürün güncelle
const updateUrun = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Güncelleme sırasında yeni bir resim yüklendiyse, onu da ekle
    if (req.file) {
      data.resim_url = `/uploads/${req.file.filename}`;
    }

    await urunService.guncelle(id, data);
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
