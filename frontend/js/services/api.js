const API_URL = "http://localhost:3000/api/urunler";

const apiService = {
  // Tüm ürünleri listeleme (GET)
  async urunleriGetir() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Ürünler getirilirken bir hata oluştu.");
    return await response.json();
  },

  // Yeni ürün ekleme (POST - Resimli form verisi olduğu için FormData kullanıyoruz)
  async urunEkle(formData) {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData, // Başlık (Content-Type) eklemiyoruz, tarayıcı FormData görünce otomatik ayarlar
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.mesaj || "Ürün eklenemedi.");
    return result;
  },

  // Ürün güncelleme (PUT)
  async urunGuncelle(id, formData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.mesaj || "Ürün güncellenemedi.");
    return result;
  },

  // Ürün silme (DELETE - Arka planda Soft Delete çalışacak)
  async urunSil(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.mesaj || "Ürün silinemedi.");
    return result;
  },
};

// Diğer JS dosyalarından erişebilmek için window nesnesine bağlıyoruz
window.apiService = apiService;
