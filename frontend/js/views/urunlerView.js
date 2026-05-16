const urunlerView = {
  // Ürünleri "Tüm Lezzetler" sayfasındaki grid alanına basar
  renderUrunler(urunler) {
    const grid = document.getElementById("urunler-grid");
    grid.innerHTML = ""; // İçini temizle

    if (urunler.length === 0) {
      grid.innerHTML =
        '<p style="grid-column: span 3; text-align: center; color: var(--mauve); font-weight: bold; font-size: 18px;">Menüde henüz lezzet bulunmuyor.</p>';
      return;
    }

    urunler.forEach((urun) => {
      const kart = document.createElement("div");
      kart.className = "product-card";

      const resimYolu = urun.resim_url
        ? `http://localhost:3000${urun.resim_url}`
        : "https://placehold.co/300x200?text=Lezzet";
      const stokClass = urun.stokDurumu ? "stok-var" : "stok-yok";
      const stokText = urun.stokDurumu ? "Stokta" : "Tükendi";

      kart.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${resimYolu}" alt="${urun.ad}">
                    <span class="stok-badge ${stokClass}">${stokText}</span>
                </div>
                <div class="product-info">
                    <div>
                        <span class="product-category">${urun.kategori}</span>
                        <h3 class="product-name">${urun.ad}</h3>
                        <div class="product-price">${urun.fiyat.toFixed(2)} ₺</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn-action btn-edit" onclick="app.duzenlemeyiBaslat(${urun.id}, '${urun.ad}', '${urun.kategori}', ${urun.fiyat}, ${urun.stokDurumu})"><i class="fas fa-pen"></i> Düzenle</button>
                        <button class="btn-action btn-delete" onclick="app.urunSil(${urun.id})"><i class="fas fa-trash"></i> Sil</button>
                    </div>
                </div>
            `;
      grid.appendChild(kart);
    });
  },

  // Bir ürünü "Düzenle" butonuna basılınca formu doldurur
  formuDoldur(urun) {
    document.getElementById("urun-id").value = urun.id;
    document.getElementById("ad").value = urun.ad;
    document.getElementById("kategori").value = urun.kategori;
    document.getElementById("fiyat").value = urun.fiyat;
    document.getElementById("stokDurumu").value = urun.stokDurumu;

    // Form başlığını ve butonunu güncelle
    document.querySelector("#ekle-sayfasi .page-title").innerHTML =
      '<i class="fas fa-pen" style="color: var(--mauve);"></i> Lezzeti Düzenle';
    document.getElementById("btn-form-kaydet").innerHTML =
      '<i class="fas fa-save"></i> Değişiklikleri Kaydet';
  },

  // Formu sıfırlar (Yeni ürün eklemeye hazır hale getirir)
  formuTemizle() {
    document.getElementById("urun-form").reset();
    document.getElementById("urun-id").value = "";
    document.getElementById("resim-isim").innerText =
      "Fotoğraf seçmek için tıklayın";

    // Önizlemeyi de sıfırla
    const uploadArea = document.querySelector(".upload-area");
    uploadArea.style.backgroundImage = "none";
    uploadArea.querySelector(".upload-icon").style.display = "block";
    document.getElementById("resim-isim").style.display = "block";

    // Form başlığını ve butonunu varsayılana döndür
    document.querySelector("#ekle-sayfasi .page-title").innerHTML =
      '<i class="fas fa-plus-circle"></i> Yeni Lezzet Ekle';
    document.getElementById("btn-form-kaydet").innerHTML =
      '<i class="fas fa-save"></i> Menüye Ekle ve Kaydet';
  },
};

window.urunlerView = urunlerView;
