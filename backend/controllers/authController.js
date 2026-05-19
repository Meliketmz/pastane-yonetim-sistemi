// backend/controllers/authController.js
const authService = require("../services/authService");

class AuthController {
  // Kayıt Olma İsteğini Karşılayan Fonksiyon
  async kayitOl(req, res) {
    try {
      // Frontend'den gelen verileri alıyoruz
      const { ad_soyad, email, sifre } = req.body;

      // İşlemi yapması için Service (İş Kuralları) katmanına yolluyoruz
      const yeniKullanici = await authService.kayitOl(ad_soyad, email, sifre);

      // İşlem başarılıysa 201 (Oluşturuldu) koduyla Frontend'e mesaj dönüyoruz
      res.status(201).json({
        mesaj:
          "Harika! Kayıt başarıyla tamamlandı, şimdi giriş yapabilirsiniz.",
        kullanici: yeniKullanici,
      });
    } catch (error) {
      // Service katmanından bir hata gelirse (örn: şifre kısa) Frontend'e 400 koduyla fırlat
      res.status(400).json({ hata: error.message });
    }
  }

  // Giriş Yapma İsteğini Karşılayan Fonksiyon
  async girisYap(req, res) {
    try {
      const { email, sifre } = req.body;

      // Servis katmanından token'ı ve kullanıcıyı alıyoruz
      const sonuc = await authService.girisYap(email, sifre);

      // Başarılı giriş
      res.status(200).json({
        mesaj: "Giriş başarılı!",
        token: sonuc.token,
        kullanici: sonuc,
      });
    } catch (error) {
      res.status(400).json({ hata: error.message });
    }
  }
}

module.exports = new AuthController();
