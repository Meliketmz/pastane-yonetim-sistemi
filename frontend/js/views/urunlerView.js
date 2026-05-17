const urunlerView = {
  renderUrunler(urunler) {
    const anaKapsayici = document.getElementById("urunler-grid");
    anaKapsayici.innerHTML = "";
    anaKapsayici.style.display = "block";
    anaKapsayici.style.gridTemplateColumns = "none";
    anaKapsayici.style.gap = "0";

    if (urunler.length === 0) {
      anaKapsayici.innerHTML =
        '<p style="text-align: center; color: var(--mauve); font-weight: bold; font-size: 18px; padding: 40px; border: 2px dashed var(--peony); border-radius: 12px;">Bu alanda henüz bir lezzet bulunmuyor.</p>';
      return;
    }

    const kategoriler = {};
    urunler.forEach((urun) => {
      if (!kategoriler[urun.kategori]) {
        kategoriler[urun.kategori] = [];
      }
      kategoriler[urun.kategori].push(urun);
    });

    for (const [kategoriAdi, urunListesi] of Object.entries(kategoriler)) {
      const kategoriBolumu = document.createElement("div");
      kategoriBolumu.className = "menu-kategori-bolumu";

      const baslik = document.createElement("h3");
      baslik.className = "menu-kategori-baslik";

      baslik.innerHTML = `${kategoriAdi} <span class="kategori-adet-badge">${urunListesi.length} Çeşit</span>`;
      kategoriBolumu.appendChild(baslik);

      const grid = document.createElement("div");
      grid.className = "menu-kategori-grid";

      urunListesi.forEach((urun) => {
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
                            <div class="product-price">${parseFloat(urun.fiyat).toFixed(2)} ₺</div>
                        </div>
                        <div class="card-actions">
                            <button class="btn-action btn-edit" onclick="app.duzenlemeyiBaslat(${urun.id}, '${urun.ad.replace(/'/g, "\\'")}', '${urun.kategori}', ${urun.fiyat}, ${urun.stokDurumu})"><i class="fas fa-pen"></i> Düzenle</button>
                            <button class="btn-action btn-delete" onclick="app.urunSil(${urun.id})"><i class="fas fa-trash"></i> Sil</button>
                        </div>
                    </div>
                `;
        grid.appendChild(kart);
      });

      kategoriBolumu.appendChild(grid);
      anaKapsayici.appendChild(kategoriBolumu);
    }
  },

  formuDoldur(urun) {
    document.getElementById("urun-id").value = urun.id;
    document.getElementById("ad").value = urun.ad;
    document.getElementById("kategori").value = urun.kategori;
    document.getElementById("fiyat").value = urun.fiyat;
    document.getElementById("stokDurumu").value = urun.stokDurumu;

    document.querySelector("#ekle-sayfasi .page-title").innerHTML =
      '<i class="fas fa-pen" style="color: var(--mauve);"></i> Lezzeti Düzenle';
    document.getElementById("btn-form-kaydet").innerHTML =
      '<i class="fas fa-save"></i> Değişiklikleri Kaydet';

    // İptal Butonunu Görünür Yap
    document.getElementById("btn-form-iptal").style.display = "block";
  },

  formuTemizle() {
    document.getElementById("urun-form").reset();
    document.getElementById("urun-id").value = "";

    const uploadArea = document.querySelector(".upload-area");
    uploadArea.style.backgroundImage = "none";
    uploadArea.querySelector(".upload-icon").style.display = "block";
    document.getElementById("resim-isim").style.display = "block";
    document.getElementById("resim-isim").innerText =
      "Fotoğraf seçmek için tıklayın";

    document.querySelector("#ekle-sayfasi .page-title").innerHTML =
      '<i class="fas fa-plus-circle"></i> Yeni Lezzet Ekle';
    document.getElementById("btn-form-kaydet").innerHTML =
      '<i class="fas fa-save"></i> Menüye Ekle ve Kaydet';

    // Yeni ürün eklerken İptal butonunu gizle
    document.getElementById("btn-form-iptal").style.display = "none";
  },
};

window.urunlerView = urunlerView;
