const app = {
  silinecekId: null,
  tumUrunler: [],

  icecekKategorileri: [
    "Sıcak Kahveler",
    "Soğuk Kahveler",
    "Çaylar",
    "Soğuk İçecekler",
    "Gazlı İçecekler",
    "Şişe / Hazır İçecekler",
  ],

  async init() {
    // Giriş yapan kullanıcının adını hafızadan oku ve ekrana bas
    const hafizadakiIsim = localStorage.getItem("aktifKullaniciAdi") || "Elif";
    const adEtiketi = document.getElementById("lbl-aktif-user");
    if (adEtiketi) {
      adEtiketi.innerText = hafizadakiIsim;
    }

    const bekleyenModal = sessionStorage.getItem("showModalMessage");
    const sonSayfa = sessionStorage.getItem("aktifSayfa");
    const sonBaslik = sessionStorage.getItem("aktifBaslik");

    if (sonSayfa) {
      document
        .querySelectorAll(".page-section")
        .forEach((p) => p.classList.remove("active"));
      const hedefSayfa = document.getElementById(sonSayfa);
      if (hedefSayfa) hedefSayfa.classList.add("active");

      if (sonBaslik) {
        const baslikEl = document.getElementById("liste-baslik");
        if (baslikEl) baslikEl.innerHTML = sonBaslik;
      }

      const btnGeri = document.getElementById("btn-geri");
      if (btnGeri) {
        if (
          sonBaslik &&
          !sonBaslik.includes("Menü Özeti") &&
          !sonBaslik.includes("Yiyecek") &&
          !sonBaslik.includes("İçecek")
        ) {
          btnGeri.style.display = "block";
        } else {
          btnGeri.style.display = "none";
        }
      }

      document
        .querySelectorAll(".menu-item")
        .forEach((m) => m.classList.remove("active"));
      if (sonBaslik && sonBaslik.includes("İçecek")) {
        document.getElementById("menu-icecek")?.classList.add("active");
      } else if (sonBaslik && sonBaslik.includes("Yiyecek")) {
        document.getElementById("menu-yiyecek")?.classList.add("active");
      }

      sessionStorage.removeItem("aktifSayfa");
      sessionStorage.removeItem("aktifBaslik");
    }

    if (bekleyenModal) {
      this.showSuccessModal(bekleyenModal);
      sessionStorage.removeItem("showModalMessage");
    }

    this.etkinlikDinleyicileriKazan();
    await this.menuListele();
  },

  showSuccessModal(mesaj) {
    const temizMesaj = mesaj.replace("(Soft Delete)", "").trim();
    sessionStorage.setItem("showModalMessage", temizMesaj);
    document.getElementById("success-message").innerText = temizMesaj;
    document.getElementById("success-modal").classList.add("active");
  },

  etkinlikDinleyicileriKazan() {
    // YENİ: Ürün adı kutusuna yazılan her şeyi canlı olarak Türkçe BÜYÜK HARFE çevirir
    const adInput = document.getElementById("ad");
    if (adInput) {
      adInput.addEventListener("input", function () {
        this.value = this.value.toLocaleUpperCase("tr-TR");
      });
    }

    document
      .getElementById("urun-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.formuKaydet();
      });

    document.getElementById("btn-success-ok").addEventListener("click", () => {
      sessionStorage.removeItem("showModalMessage");
      document.getElementById("success-modal").classList.remove("active");
    });

    document.getElementById("btn-form-iptal").addEventListener("click", () => {
      urunlerView.formuTemizle();
      document
        .querySelectorAll(".page-section")
        .forEach((p) => p.classList.remove("active"));
      document.getElementById("liste-sayfasi").classList.add("active");
    });

    document.getElementById("menu-yiyecek").addEventListener("click", () => {
      const yiyecekler = this.tumUrunler.filter(
        (u) => !this.icecekKategorileri.includes(u.kategori),
      );
      urunlerView.renderUrunler(yiyecekler);
      document.getElementById("liste-baslik").innerHTML =
        '<i class="fas fa-utensils"></i> Yiyecek Menüsü';
      document.getElementById("btn-geri").style.display = "none";

      document
        .querySelectorAll(".page-section")
        .forEach((p) => p.classList.remove("active"));
      document.getElementById("liste-sayfasi").classList.add("active");
    });

    document.getElementById("menu-icecek").addEventListener("click", () => {
      const icecekler = this.tumUrunler.filter((u) =>
        this.icecekKategorileri.includes(u.kategori),
      );
      urunlerView.renderUrunler(icecekler);
      document.getElementById("liste-baslik").innerHTML =
        '<i class="fas fa-mug-hot"></i> İçecek Menüsü';
      document.getElementById("btn-geri").style.display = "none";

      document
        .querySelectorAll(".page-section")
        .forEach((p) => p.classList.remove("active"));
      document.getElementById("liste-sayfasi").classList.add("active");
    });

    document.getElementById("kard-toplam").addEventListener("click", () => {
      urunlerView.renderUrunler(this.tumUrunler);
      document.getElementById("liste-baslik").innerHTML =
        '<i class="fas fa-layer-group"></i> Tüm Menü Özeti';
      document.getElementById("btn-geri").style.display = "none";
      document
        .querySelectorAll(".page-section")
        .forEach((p) => p.classList.remove("active"));
      document.getElementById("liste-sayfasi").classList.add("active");
    });

    document.getElementById("kard-stok").addEventListener("click", () => {
      const stoktakiler = this.tumUrunler.filter((u) => u.stokDurumu == 1);
      urunlerView.renderUrunler(stoktakiler);
      document.getElementById("liste-baslik").innerHTML =
        '<i class="fas fa-check-circle" style="color: var(--sage);"></i> Sadece Stoktaki Lezzetler';
      document.getElementById("btn-geri").style.display = "block";
      document
        .querySelectorAll(".page-section")
        .forEach((p) => p.classList.remove("active"));
      document.getElementById("liste-sayfasi").classList.add("active");
    });

    document.getElementById("kard-tukenmis").addEventListener("click", () => {
      const tukenenler = this.tumUrunler.filter((u) => u.stokDurumu == 0);
      urunlerView.renderUrunler(tukenenler);
      document.getElementById("liste-baslik").innerHTML =
        '<i class="fas fa-times-circle" style="color: #d6727e;"></i> Tükenen Lezzetler';
      document.getElementById("btn-geri").style.display = "block";
      document
        .querySelectorAll(".page-section")
        .forEach((p) => p.classList.remove("active"));
      document.getElementById("liste-sayfasi").classList.add("active");
    });

    document.getElementById("kard-kategori").addEventListener("click", () => {
      const sirali = [...this.tumUrunler].sort((a, b) =>
        a.kategori.localeCompare(b.kategori),
      );
      urunlerView.renderUrunler(sirali);
      document.getElementById("liste-baslik").innerHTML =
        '<i class="fas fa-tags" style="color: var(--mauve);"></i> Kategorilere Göre Sıralı Liste';
      document.getElementById("btn-geri").style.display = "block";
      document
        .querySelectorAll(".page-section")
        .forEach((p) => p.classList.remove("active"));
      document.getElementById("liste-sayfasi").classList.add("active");
    });

    document.getElementById("btn-geri").addEventListener("click", () => {
      urunlerView.renderUrunler(this.tumUrunler);
      document.getElementById("liste-baslik").innerHTML =
        '<i class="fas fa-layer-group"></i> Tüm Menü Özeti';
      document.getElementById("btn-geri").style.display = "none";
    });

    document.getElementById("ayarlar-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.showSuccessModal("Profil bilgileriniz başarıyla güncellendi!");
    });

    document.getElementById("resim").addEventListener("change", function (e) {
      const dosya = e.target.files[0];
      const uploadArea = document.querySelector(".upload-area");
      const resimIsimDiv = document.getElementById("resim-isim");
      if (dosya) {
        const okuyucu = new FileReader();
        okuyucu.onload = function (e) {
          uploadArea.style.backgroundImage = `url(${e.target.result})`;
          uploadArea.style.backgroundSize = "contain";
          uploadArea.style.backgroundPosition = "center";
          uploadArea.style.backgroundRepeat = "no-repeat";
          uploadArea.querySelector(".upload-icon").style.display = "none";
          resimIsimDiv.style.display = "none";
        };
        okuyucu.readAsDataURL(dosya);
      }
    });

    document
      .querySelector('[data-target="ekle-sayfasi"]')
      .addEventListener("click", () => {
        urunlerView.formuTemizle();
      });

    document.getElementById("btn-logout").addEventListener("click", () => {
      document.getElementById("logout-modal").classList.add("active");
    });

    document
      .getElementById("btn-cancel-logout")
      .addEventListener("click", () => {
        document.getElementById("logout-modal").classList.remove("active");
      });

    document
      .getElementById("btn-confirm-logout")
      .addEventListener("click", () => {
        localStorage.removeItem("aktifKullaniciAdi");
        window.location.href = "login.html";
      });

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
          const aktifSayfa =
            document.querySelector(".page-section.active")?.id ||
            "liste-sayfasi";
          const aktifBaslik =
            document.getElementById("liste-baslik")?.innerHTML || "";
          sessionStorage.setItem("aktifSayfa", aktifSayfa);
          sessionStorage.setItem("aktifBaslik", aktifBaslik);

          try {
            const res = await apiService.urunSil(this.silinecekId);

            await this.menuListele();

            document.getElementById("delete-modal").classList.remove("active");

            this.showSuccessModal(
              res.mesaj || "Lezzet menüden başarıyla kaldırıldı.",
            );
          } catch (error) {
            notification.show(error.message, "error");
          }
        }
      });
  },

  async menuListele() {
    const mainArea = document.querySelector(".main-area");
    const contentContainer = document.querySelector(".content-container");
    const grid = document.getElementById("urunler-grid");

    const scrollWindow = window.scrollY || document.documentElement.scrollTop;
    const scrollMain = mainArea ? mainArea.scrollTop : 0;
    const scrollContainer = contentContainer ? contentContainer.scrollTop : 0;

    const hBody = document.documentElement.scrollHeight;
    const hMain = mainArea ? mainArea.scrollHeight : 0;
    const hContainer = contentContainer ? contentContainer.scrollHeight : 0;
    const hGrid = grid ? grid.scrollHeight : 0;

    document.body.style.minHeight = `${hBody}px`;
    if (mainArea) mainArea.style.minHeight = `${hMain}px`;
    if (contentContainer) contentContainer.style.minHeight = `${hContainer}px`;
    if (grid) grid.style.minHeight = `${hGrid}px`;

    try {
      const data = await apiService.urunleriGetir();
      this.tumUrunler = data.urunler;
      this.ozetPaneliGuncelle(this.tumUrunler);

      const baslikElementi = document.getElementById("liste-baslik");
      const baslik = baslikElementi ? baslikElementi.innerText : "";

      if (baslik.includes("Yiyecek")) {
        const yiyecekler = this.tumUrunler.filter(
          (u) => !this.icecekKategorileri.includes(u.kategori),
        );
        urunlerView.renderUrunler(yiyecekler);
      } else if (baslik.includes("İçecek")) {
        const icecekler = this.tumUrunler.filter((u) =>
          this.icecekKategorileri.includes(u.kategori),
        );
        urunlerView.renderUrunler(icecekler);
      } else if (baslik.includes("Stoktaki")) {
        const stoktakiler = this.tumUrunler.filter((u) => u.stokDurumu == 1);
        urunlerView.renderUrunler(stoktakiler);
      } else if (baslik.includes("Tükenen")) {
        const tukenenler = this.tumUrunler.filter((u) => u.stokDurumu == 0);
        urunlerView.renderUrunler(tukenenler);
      } else if (baslik.includes("Sıralı")) {
        const sirali = [...this.tumUrunler].sort((a, b) =>
          a.kategori.localeCompare(b.kategori),
        );
        urunlerView.renderUrunler(sirali);
      } else {
        urunlerView.renderUrunler(this.tumUrunler);
      }

      const konumuMühürle = () => {
        window.scrollTo(0, scrollWindow);
        if (mainArea) mainArea.scrollTop = scrollMain;
        if (contentContainer) contentContainer.scrollTop = scrollContainer;
      };

      konumuMühürle();
      requestAnimationFrame(konumuMühürle);

      setTimeout(() => {
        konumuMühürle();
        document.body.style.minHeight = "";
        if (mainArea) mainArea.style.minHeight = "";
        if (contentContainer) contentContainer.style.minHeight = "";
        if (grid) grid.style.minHeight = "";
      }, 50);

      setTimeout(() => {
        konumuMühürle();
      }, 150);
    } catch (error) {
      console.error("Liste yüklenemedi:", error);
      document.body.style.minHeight = "";
      if (mainArea) mainArea.style.minHeight = "";
      if (contentContainer) contentContainer.style.minHeight = "";
      if (grid) grid.style.minHeight = "";
    }
  },

  ozetPaneliGuncelle(urunler) {
    document.getElementById("stat-toplam").innerText = urunler.length;
    document.getElementById("stat-stok").innerText = urunler.filter(
      (u) => u.stokDurumu == 1,
    ).length;
    document.getElementById("stat-tukenmis").innerText = urunler.filter(
      (u) => u.stokDurumu == 0,
    ).length;
    document.getElementById("stat-kategori").innerText = new Set(
      urunler.map((u) => u.kategori),
    ).size;
  },

  async formuKaydet() {
    // YENİ: Kaydet butonuna basıldığı an veritabanına gitmeden önce de ismi büyük harfe zorlar
    const adInput = document.getElementById("ad");
    if (adInput) {
      adInput.value = adInput.value.toLocaleUpperCase("tr-TR");
    }

    const id = document.getElementById("urun-id").value;
    const formElement = document.getElementById("urun-form");
    const formData = new FormData(formElement);
    const eklenenKategori = formData.get("kategori");

    const isIcecek = this.icecekKategorileri.includes(eklenenKategori);
    const hrefBaslik = isIcecek
      ? '<i class="fas fa-mug-hot"></i> İçecek Menüsü'
      : '<i class="fas fa-utensils"></i> Yiyecek Menüsü';

    sessionStorage.setItem("aktifSayfa", "liste-sayfasi");
    sessionStorage.setItem("aktifBaslik", hrefBaslik);

    try {
      let res;
      if (id) {
        res = await apiService.urunGuncelle(id, formData);
      } else {
        res = await apiService.urunEkle(formData);
      }

      const mesaj = res.mesaj || "İşlem başarıyla tamamlandı.";

      urunlerView.formuTemizle();

      document
        .querySelectorAll(".page-section")
        .forEach((p) => p.classList.remove("active"));
      document.getElementById("liste-sayfasi").classList.add("active");

      document.getElementById("liste-baslik").innerHTML = hrefBaslik;
      document.getElementById("btn-geri").style.display = "none";

      document
        .querySelectorAll(".menu-item")
        .forEach((m) => m.classList.remove("active"));
      if (isIcecek) {
        document.getElementById("menu-icecek")?.classList.add("active");
      } else {
        document.getElementById("menu-yiyecek")?.classList.add("active");
      }

      sessionStorage.setItem("showModalMessage", mesaj);

      await this.menuListele();

      this.showSuccessModal(mesaj);
    } catch (error) {
      notification.show(error.message, "error");
    }
  },

  duzenlemeyiBaslat(id, ad, kategori, fiyat, stokDurumu) {
    urunlerView.formuDoldur({ id, ad, kategori, fiyat, stokDurumu });
    document
      .querySelectorAll(".page-section")
      .forEach((p) => p.classList.remove("active"));
    document.getElementById("ekle-sayfasi").classList.add("active");
    document
      .querySelectorAll(".menu-item")
      .forEach((m) => m.classList.remove("active"));
    document
      .querySelector('[data-target="ekle-sayfasi"]')
      .classList.add("active");
  },

  urunSil(id) {
    this.silinecekId = id;
    document.getElementById("delete-modal").classList.add("active");
  },
};

document.addEventListener("DOMContentLoaded", () => {
  app.init();
  window.app = app;
});
