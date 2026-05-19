// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "benim_gizli_pastane_anahtarim";

const yetkiKontrolu = (req, res, next) => {
  let token = null;

  // Header üzerinden gelen token'ı yakalama
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Token yoksa içeri alma
  if (!token) {
    return res
      .status(401)
      .json({ hata: "Bu işlemi gerçekleştirmek için giriş yapmalısınız." });
  }

  try {
    // Token geçerli mi diye kontrol et
    const cozulmusToken = jwt.verify(token, JWT_SECRET_KEY);

    // Kullanıcı bilgilerini diğer sayfalarda kullanabilmek için aktar
    req.kullanici = cozulmusToken;
    next(); // Geçişe izin ver
  } catch (error) {
    return res
      .status(403)
      .json({ hata: "Oturum süreniz dolmuş veya yetkisiz erişim denemesi." });
  }
};

module.exports = yetkiKontrolu;
