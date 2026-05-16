const urunRepository = require("../repositories/urunRepository");

class UrunService {
  // Ürünleri listele
  async listele() {
    return await urunRepository.getAll();
  }

  // Yeni ürün ekle
  async ekle(data) {
    return await urunRepository.create(data);
  }

  // Ürün güncelle ve hata kontrolü yap
  async guncelle(id, data) {
    const changes = await urunRepository.update(id, data);
    if (changes === 0) throw new Error("Güncellenecek ürün bulunamadı.");
    return true;
  }

  // Ürünü güvenli sil (Soft Delete)
  async sil(id) {
    const changes = await urunRepository.softDelete(id);
    if (changes === 0) throw new Error("Silinecek ürün bulunamadı.");
    return true;
  }
}

module.exports = new UrunService();
