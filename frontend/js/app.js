const app = {
  guncelFiltre: "all",
  guncelSayfa: "ozet-sayfasi",
  oncekiFiltre: "all",
  oncekiSayfa: "ozet-sayfasi",
  oncekiMenuIndex: -1,
  silinecekUrunId: null,
  silinecekUrunAdi: null,

  async init() {
    this.form = document.getElementById("urun-form");
    this.resimInput = document.getElementById("resim");
    this.resimIsim = document.getElementById("resim-isim");
    this.uploadArea = document.querySelector(".upload-area");

    this.bindEvents();
    this.sayfaGoster("ozet-sayfasi", "all");
  },

  sayfaGoster(sayfaId, filtre = null) {
    this.guncelSayfa = sayfaId;
    if (filtre !== null) this.guncelFiltre = filtre;

    const pageSections = document.querySelectorAll(".page-section");
    pageSections.forEach((page) => page.classList.remove("active"));
    document.getElementById(sayfaId).classList.add("active");

    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((m) => m.classList.remove("active"));

    if (sayfaId === "ekle-sayfasi") {
      document
        .querySelector('[data-target="ekle-sayfasi"]')
        .classList.add("active");
    } else if (sayfaId === "ayarlar-sayfasi") {
      document
        .querySelector('[data-target="ayarlar-sayfasi"]')
        .classList.add("active");
      this.ayarlarSayfasiniYukle();
    } else if (sayfaId === "ozet-sayfasi") {
      document
        .querySelector('[data-target="ozet-sayfasi"]')
        .classList.add("active");
    } else if (sayfaId === "liste-sayfasi") {
      if (
        this.oncekiMenuIndex !== undefined &&
        this.oncekiMenuIndex !== -1 &&
        filtre === this.oncekiFiltre
      ) {
        if (menuItems[this.oncekiMenuIndex]) {
          menuItems[this.oncekiMenuIndex].classList.add("active");
        }
      } else {
        if (this.guncelFiltre === "yiyecek") {
          document.getElementById("menu-yiyecek").classList.add("active");
        } else if (this.guncelFiltre === "icecek") {
          document.getElementById("menu-icecek").classList.add("active");
        }
      }
    }

    if (sayfaId === "liste-sayfasi") {
      this.urunleriYukle(this.guncelFiltre);
    } else if (sayfaId === "ozet-sayfasi") {
      this.istatistikleriYenile();
    }
  },

  async ayarlarSayfasiniYukle() {
    const emailInput = document.getElementById("ayar-email");
    let aktifEmail = "";

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        aktifEmail = payload.email;
        if (emailInput) emailInput.value = aktifEmail;
      }
    } catch (e) {
      console.error("E-posta okunamadı", e);
      if (emailInput) emailInput.value = "Bilinmeyen E-posta";
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/giris-kayitlari",
      );
      const loglar = await response.json();

      const tbody = document.getElementById("log-tablosu-body");
      if (tbody) {
        tbody.innerHTML = "";
        if (loglar.length === 0) {
          tbody.innerHTML =
            '<tr><td colspan="3" style="text-align: center; padding: 20px;">Henüz giriş kaydı bulunmuyor.</td></tr>';
        } else {
          loglar.forEach((log) => {
            const tarih = new Date(log.giris_tarihi).toLocaleString("tr-TR");
            tbody.innerHTML += `
                       <tr style="border-bottom: 1px solid #eee;">
                           <td style="padding: 12px; font-weight: 500; color: #555;">${tarih}</td>
                           <td style="padding: 12px; font-weight: bold; color: var(--evergreen);">${log.ad_soyad}</td>
                           <td style="padding: 12px; color: #666;">${log.email}</td>
                       </tr>
                   `;
          });
        }
      }
    } catch (error) {
      console.error("Loglar çekilemedi", error);
      document.getElementById("log-tablosu-body").innerHTML =
        '<tr><td colspan="3" style="text-align: center; padding: 20px; color: red;">Kayıtlar yüklenirken bir hata oluştu.</td></tr>';
    }
  },

  bindEvents() {
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        const targetId = item.getAttribute("data-target");
        let filtre = "all";
        if (item.id === "menu-yiyecek") filtre = "yiyecek";
        if (item.id === "menu-icecek") filtre = "icecek";

        this.oncekiMenuIndex = -1;
        this.sayfaGoster(targetId, filtre);
      });
    });

    document.getElementById("kard-toplam").addEventListener("click", () => {
      this.sayfaGoster("liste-sayfasi", "all");
    });
    document.getElementById("kard-stok").addEventListener("click", () => {
      this.sayfaGoster("liste-sayfasi", "stokta");
    });
    document.getElementById("kard-tukenmis").addEventListener("click", () => {
      this.sayfaGoster("liste-sayfasi", "tukenmis");
      menuItems.forEach((m) => m.classList.remove("active"));
      document
        .querySelector('[data-target="ozet-sayfasi"]')
        .classList.add("active");
    });
    document.getElementById("kard-kategori").addEventListener("click", () => {
      this.sayfaGoster("liste-sayfasi", "all");
    });

    document.getElementById("btn-geri").addEventListener("click", () => {
      this.sayfaGoster("ozet-sayfasi");
    });

    this.resimInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        this.resimIsim.innerText = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
          this.uploadArea.style.backgroundImage = `url(${event.target.result})`;
          this.uploadArea.style.backgroundSize = "cover";
          this.uploadArea.style.backgroundPosition = "center";
          this.uploadArea.querySelector(".upload-icon").style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById("btn-form-iptal").addEventListener("click", () => {
      urunlerView.formuTemizle();
      this.sayfaGoster(this.oncekiSayfa, this.oncekiFiltre);
    });

    const deleteModal = document.getElementById("delete-modal");
    const btnCancelDelete = document.getElementById("btn-cancel-delete");
    const btnConfirmDelete = document.getElementById("btn-confirm-delete");

    if (btnCancelDelete) {
      btnCancelDelete.addEventListener("click", () => {
        deleteModal.classList.remove("active");
        this.silinecekUrunId = null;
        this.silinecekUrunAdi = null;
      });
    }

    if (btnConfirmDelete) {
      btnConfirmDelete.addEventListener("click", async () => {
        if (!this.silinecekUrunId) return;

        const orijinalMetin = btnConfirmDelete.innerHTML;
        btnConfirmDelete.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Siliniyor...`;
        btnConfirmDelete.disabled = true;

        try {
          await apiService.urunSil(this.silinecekUrunId);
          deleteModal.classList.remove("active");

          const successModal = document.getElementById("success-modal");
          const successMessage = document.getElementById("success-message");
          const btnSuccessOk = document.getElementById("btn-success-ok");

          if (successModal && successMessage) {
            successMessage.innerText = `"${this.silinecekUrunAdi}" isimli lezzet başarıyla menüden silindi!`;
            successModal.classList.add("active");

            btnSuccessOk.onclick = () => {
              successModal.classList.remove("active");
              this.urunleriYukle(this.guncelFiltre);
            };
          } else {
            this.urunleriYukle(this.guncelFiltre);
          }
        } catch (error) {
          alert("Silme işlemi başarısız: " + error.message);
        } finally {
          btnConfirmDelete.innerHTML = orijinalMetin;
          btnConfirmDelete.disabled = false;
          this.silinecekUrunId = null;
          this.silinecekUrunAdi = null;
        }
      });
    }

    const ayarlarForm = document.getElementById("ayarlar-form");
    if (ayarlarForm) {
      ayarlarForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = document.getElementById("btn-sifre-kaydet");
        const orijinalMetin = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Kaydediliyor...`;
        btn.disabled = true;

        try {
          const email = document.getElementById("ayar-email").value;
          const yeniSifre = document.getElementById("ayar-sifre").value;

          const response = await fetch(
            "http://localhost:3000/api/auth/sifre-guncelle",
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, yeniSifre }),
            },
          );

          const sonuc = await response.json();

          if (!response.ok)
            throw new Error(sonuc.hata || "Şifre güncellenemedi.");

          const successModal = document.getElementById("success-modal");
          const successMessage = document.getElementById("success-message");
          const btnSuccessOk = document.getElementById("btn-success-ok");

          if (successModal && successMessage) {
            successMessage.innerText =
              "Güvenlik şifreniz başarıyla güncellendi! Yeni şifrenizle kullanıma devam edebilirsiniz.";
            successModal.classList.add("active");

            btnSuccessOk.onclick = () => {
              successModal.classList.remove("active");
              document.getElementById("ayar-sifre").value = "";
            };
          } else {
            alert("Şifreniz başarıyla güncellendi!");
            document.getElementById("ayar-sifre").value = "";
          }
        } catch (error) {
          alert("Hata: " + error.message);
        } finally {
          btn.innerHTML = orijinalMetin;
          btn.disabled = false;
        }
      });
    }

    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.getElementById("btn-form-kaydet");
      const orijinalMetin = btn.innerHTML;
      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Bekleniyor...`;
      btn.disabled = true;

      try {
        const formData = new FormData(this.form);
        const id = document.getElementById("urun-id").value;
        const urunAdi = document.getElementById("ad").value.trim();

        // 🌟 DÜZELTİLDİ: Seçilen kategoriyi form sıfırlanmadan en başta hafızaya alıyoruz
        const secilenKategori = document.getElementById("kategori").value;

        // İçecek kategorilerinin tam listesi
        const icecekKategorileri = [
          "Siyah Çay",
          "Yeşil Çay",
          "Bitki Çayları",
          "Çekirdek Kahve",
          "Öğütülmüş Kahve",
          "Granül Kahve",
          "Kapsül Kahve",
          "Kola",
          "Soda",
          "Fanta",
          "Gazoz",
          "Küçük Su",
          "Büyük Su",
          "Cam Şişe Su",
          "Pet Şişe Su",
        ];

        // 🌟 DÜZELTİLDİ: Ürünün yiyecek mi içecek mi olduğunun akıllı ayrımı
        const isIcecek = icecekKategorileri.includes(secilenKategori);
        const urunTuruMetni = isIcecek ? "içecek" : "lezzet";

        const successModal = document.getElementById("success-modal");
        const successMessage = document.getElementById("success-message");
        const btnSuccessOk = document.getElementById("btn-success-ok");

        if (id) {
          await apiService.urunGuncelle(id, formData);
          if (successModal && successMessage) {
            successMessage.innerText = `"${urunAdi}" isimli ${urunTuruMetni}te yapılan değişiklikler başarıyla kaydedildi.`;
            successModal.classList.add("active");
            btnSuccessOk.onclick = () => {
              successModal.classList.remove("active");
              urunlerView.formuTemizle();
              this.sayfaGoster(this.oncekiSayfa, this.oncekiFiltre);
            };
          } else {
            urunlerView.formuTemizle();
            this.sayfaGoster(this.oncekiSayfa, this.oncekiFiltre);
          }
        } else {
          await apiService.urunEkle(formData);
          if (successModal && successMessage) {
            // 🌟 DÜZELTİLDİ: Mesaj artık dinamik ("taptaze içecek" veya "taptaze lezzet")
            successMessage.innerText = `"${urunAdi}" isimli taptaze ${urunTuruMetni} başarıyla menüye eklendi!`;
            successModal.classList.add("active");
            btnSuccessOk.onclick = () => {
              successModal.classList.remove("active");
              urunlerView.formuTemizle();

              // 🌟 DÜZELTİLDİ: İçecek eklenince doğrudan İçecek Menüsüne fırlatır
              if (isIcecek) {
                this.sayfaGoster("liste-sayfasi", "icecek");
              } else {
                this.sayfaGoster("liste-sayfasi", "yiyecek");
              }
            };
          } else {
            urunlerView.formuTemizle();
            this.sayfaGoster("liste-sayfasi", "all");
          }
        }
      } catch (error) {
        console.error("İşlem hatası:", error);
        alert(error.message);
      } finally {
        btn.innerHTML = orijinalMetin;
        btn.disabled = false;
      }
    });

    const btnLogout = document.getElementById("btn-logout");
    const logoutModal = document.getElementById("logout-modal");
    const btnCancelLogout = document.getElementById("btn-cancel-logout");
    const btnConfirmLogout = document.getElementById("btn-confirm-logout");

    if (btnLogout)
      btnLogout.addEventListener("click", () =>
        logoutModal.classList.add("active"),
      );
    if (btnCancelLogout)
      btnCancelLogout.addEventListener("click", () =>
        logoutModal.classList.remove("active"),
      );
    if (btnConfirmLogout) {
      btnConfirmLogout.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("aktifKullaniciAdi");
        window.location.href = "login.html";
      });
    }
  },

  silmeIsleminiBaslat(id, ad) {
    this.silinecekUrunId = id;
    this.silinecekUrunAdi = ad;
    const deleteModal = document.getElementById("delete-modal");
    if (deleteModal) {
      deleteModal.classList.add("active");
    }
  },

  async urunleriYukle(filtre = "all") {
    try {
      const urunler = await apiService.urunleriGetir();
      this.istatistikleriGuncelle(urunler);

      let gosterilecekUrunler = urunler;
      const icecekKategorileri = [
        "Siyah Çay",
        "Yeşil Çay",
        "Bitki Çayları",
        "Çekirdek Kahve",
        "Öğütülmüş Kahve",
        "Granül Kahve",
        "Kapsül Kahve",
        "Kola",
        "Soda",
        "Fanta",
        "Gazoz",
        "Küçük Su",
        "Büyük Su",
        "Cam Şişe Su",
        "Pet Şişe Su",
      ];

      if (filtre === "yiyecek") {
        gosterilecekUrunler = urunler.filter(
          (u) => !icecekKategorileri.includes(u.kategori),
        );
        document.getElementById("liste-baslik").innerHTML =
          '<i class="fas fa-utensils"></i> Menüdeki Yiyecekler';
      } else if (filtre === "icecek") {
        gosterilecekUrunler = urunler.filter((u) =>
          icecekKategorileri.includes(u.kategori),
        );
        document.getElementById("liste-baslik").innerHTML =
          '<i class="fas fa-mug-hot"></i> Menüdeki İçecekler';
      } else if (filtre === "tukenmis") {
        gosterilecekUrunler = urunler.filter((u) => u.stokDurumu == 0);
        document.getElementById("liste-baslik").innerHTML =
          '<i class="fas fa-exclamation-circle"></i> Tükenen Lezzetler';
      } else if (filtre === "stokta") {
        gosterilecekUrunler = urunler.filter(
          (u) => u.stokDurumu == 1 || u.stokDurumu == undefined,
        );
        document.getElementById("liste-baslik").innerHTML =
          '<i class="fas fa-check-circle"></i> Stoktaki Lezzetler';
      } else {
        document.getElementById("liste-baslik").innerHTML =
          '<i class="fas fa-layer-group"></i> Menüdeki Tüm Lezzetler';
      }

      urunlerView.renderUrunler(gosterilecekUrunler);
    } catch (error) {
      console.error("Ürünler yüklenirken hata:", error);
    }
  },

  duzenlemeyiBaslat(id, ad, kategori, fiyat, stokDurumu) {
    this.oncekiSayfa = this.guncelSayfa;
    this.oncekiFiltre = this.guncelFiltre;

    const menuItems = document.querySelectorAll(".menu-item");
    this.oncekiMenuIndex = -1;
    menuItems.forEach((item, index) => {
      if (item.classList.contains("active")) {
        this.oncekiMenuIndex = index;
      }
    });

    const urun = { id, ad, kategori, fiyat, stokDurumu };
    urunlerView.formuDoldur(urun);
    this.sayfaGoster("ekle-sayfasi");
  },

  async istatistikleriYenile() {
    try {
      const urunler = await apiService.urunleriGetir();
      this.istatistikleriGuncelle(urunler);
    } catch (error) {
      console.error("İstatistikler yenilenirken hata:", error);
    }
  },

  istatistikleriGuncelle(urunler) {
    document.getElementById("stat-toplam").innerText = urunler.length;
    document.getElementById("stat-stok").innerText = urunler.filter(
      (u) => u.stokDurumu == 1 || u.stokDurumu == undefined,
    ).length;
    document.getElementById("stat-tukenmis").innerText = urunler.filter(
      (u) => u.stokDurumu == 0,
    ).length;

    const kategoriler = new Set(urunler.map((u) => u.kategori));
    document.getElementById("stat-kategori").innerText = kategoriler.size;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
