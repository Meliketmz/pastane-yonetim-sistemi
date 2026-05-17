const apiService = {
  // 1. Tüm Ürünleri Getirme Fonksiyonu
  async urunleriGetir() {
    const res = await fetch("http://localhost:3000/api/urunler");
    if (!res.ok) throw new Error("Ürünler getirilemedi.");
    return await res.json();
  },

  // 2. Yeni Ürün Ekleme Fonksiyonu
  async urunEkle(formData) {
    const res = await fetch("http://localhost:3000/api/urunler", {
      method: "POST",
      body: formData, // FormData gönderildiği için tarayıcı Content-Type'ı otomatik ayarlar
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.hata || "Ürün eklenemedi.");
    }
    return await res.json();
  },

  // 3. Ürün Güncelleme Fonksiyonu
  async urunGuncelle(id, formData) {
    const res = await fetch(`http://localhost:3000/api/urunler/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.hata || "Ürün güncellenemedi.");
    }
    return await res.json();
  },

  // 4. Ürün Silme Fonksiyonu
  async urunSil(id) {
    const res = await fetch(`http://localhost:3000/api/urunler/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.hata || "Ürün silinemedi.");
    }
    return await res.json();
  },

  // 5. YENİ: Kullanıcı Kayıt Olma Fonksiyonu (Tam nesne yapısının içinde)
  async kayitOl(kullaniciVerisi) {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kullaniciVerisi),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.hata || "Kayıt olunurken bir hata oluştu.");
    }
    return await res.json();
  },
};
