// backend/models/Kullanici.js
class Kullanici {
  constructor(id, ad_soyad, email, sifre, rol, aktif_mi) {
    this.id = id;
    this.ad_soyad = ad_soyad;
    this.email = email;
    this.sifre = sifre; // Güvenlik gereği hash'lenmiş şifre
    this.rol = rol;
    this.aktif_mi = aktif_mi;
  }
}

module.exports = Kullanici;
