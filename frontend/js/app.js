const app = {
  silinecekId: null, // Silme işlemi için id'yi hafızada tutacağız

  async init() {
    this.etkinlikDinleyicileriKazan();
    await this.menuListele();
  },

  etkinlikDinleyicileriKazan() {
    // Form Kaydetme (Lezzet Ekle)
    document
      .getElementById("urun-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.formuKaydet();
      });

    // Form Kaydetme (Ayarlar / Profil Güncelleme Simülasyonu)
    document.getElementById("ayarlar-form").addEventListener("submit", (e) => {
      e.preventDefault();
      notification.show(
        "Profil bilgileriniz başarıyla güncellendi!",
        "success",
      );
    });

    // Resim Seçimi
    // Resim Seçimi ve CANLI ÖNİZLEME
    document.getElementById("resim").addEventListener("change", function (e) {
      const dosya = e.target.files[0];
      const uploadArea = document.querySelector(".upload-area");
      const resimIsimDiv = document.getElementById("resim-isim");

      if (dosya) {
        // Dosya seçildiyse, FileReader ile resmi oku ve arka plan olarak ayarla
        const okuyucu = new FileReader();
        okuyucu.onload = function (e) {
          uploadArea.style.backgroundImage = `url(${e.target.result})`;
          uploadArea.style.backgroundSize = "contain";
          uploadArea.style.backgroundPosition = "center";
          uploadArea.style.backgroundRepeat = "no-repeat";

          // İkonu ve yazıyı gizle (resim daha net görünsün)
          uploadArea.querySelector(".upload-icon").style.display = "none";
          resimIsimDiv.style.display = "none";
        };
        okuyucu.readAsDataURL(dosya);
      } else {
        // İptal edildiyse varsayılana dön
        uploadArea.style.backgroundImage = "none";
        uploadArea.querySelector(".upload-icon").style.display = "block";
        resimIsimDiv.style.display = "block";
        resimIsimDiv.innerText = "Fotoğraf seçmek için tıklayın";
      }
    });

    // Sol Menü "Yeni Ekle" tıklanınca formu temizle
    document
      .querySelector('[data-target="ekle-sayfasi"]')
      .addEventListener("click", () => {
        urunlerView.formuTemizle();
      });

    // Çıkış Yap Butonu
    document.getElementById("btn-logout").addEventListener("click", () => {
      window.location.href = "login.html";
    });

    // ÖZEL MODAL İŞLEMLERİ (İptal ve Onay)
    document
      .getElementById("btn-cancel-delete")
      .addEventListener("click", () => {
        document.getElementById("delete-modal").classList.remove("active");
        this.silinecekId = null;
      });

    document
      .getElementById("btn-confirm-delete")
      .addEventListener("click", async () => {
        if (this.silinecekId) {
          try {
            const res = await apiService.urunSil(this.silinecekId);
            notification.show(res.mesaj);
            await this.menuListele();
            document.getElementById("delete-modal").classList.remove("active");
          } catch (error) {
            notification.show(error.message, "error");
          }
        }
      });
  },

  async menuListele() {
    try {
      const data = await apiService.urunleriGetir();
      urunlerView.renderUrunler(data.urunler);
      this.ozetPaneliGuncelle(data.urunler);
    } catch (error) {
      notification.show(error.message, "error");
    }
  },

  ozetPaneliGuncelle(urunler) {
    const toplam = urunler.length;
    const stoktaOlanlar = urunler.filter((u) => u.stokDurumu == 1).length;

    // Benzersiz kategori sayısını bulma
    const benzersizKategoriler = new Set(urunler.map((u) => u.kategori));
    const kategoriSayisi = benzersizKategoriler.size;

    document.getElementById("stat-toplam").innerText = toplam;
    document.getElementById("stat-stok").innerText = stoktaOlanlar;
    document.getElementById("stat-kategori").innerText = kategoriSayisi; // Artık dinamik!
  },

  async formuKaydet() {
    const id = document.getElementById("urun-id").value;
    const formElement = document.getElementById("urun-form");
    const formData = new FormData(formElement);

    try {
      if (id) {
        const res = await apiService.urunGuncelle(id, formData);
        notification.show(res.mesaj);
      } else {
        const res = await apiService.urunEkle(formData);
        notification.show(res.mesaj);
      }

      urunlerView.formuTemizle();
      document.querySelector('[data-target="liste-sayfasi"]').click();
      await this.menuListele();
    } catch (error) {
      notification.show(error.message, "error");
    }
  },

  // DÜZELTİLDİ: Formu doldurur ama sol menü butonuna TIKLAMAZ, sadece sayfayı aktif eder.
  duzenlemeyiBaslat(id, ad, kategori, fiyat, stokDurumu) {
    // 1. Formu doldur
    urunlerView.formuDoldur({ id, ad, kategori, fiyat, stokDurumu });

    // 2. Tıklama simülasyonu yapmadan sayfayı manuel değiştir
    document
      .querySelectorAll(".page-section")
      .forEach((p) => p.classList.remove("active"));
    document.getElementById("ekle-sayfasi").classList.add("active");

    // 3. Sol menüdeki aktif rengi güncelle
    document
      .querySelectorAll(".menu-item")
      .forEach((m) => m.classList.remove("active"));
    document
      .querySelector('[data-target="ekle-sayfasi"]')
      .classList.add("active");
  },

  // DÜZELTİLDİ: Artık browser confirm() değil, kendi şık modalımızı açıyoruz
  urunSil(id) {
    this.silinecekId = id;
    document.getElementById("delete-modal").classList.add("active");
  },
};

document.addEventListener("DOMContentLoaded", () => {
  app.init();
  window.app = app;
});
