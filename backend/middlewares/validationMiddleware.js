const { validationResult, body } = require("express-validator");

// Merkezi hata fırlatıcı kapı görevlimiz
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      mesaj: "Girdi doğrulama hatası!",
      hatalar: errors.array(),
    });
  }
  next(); // Hata yoksa işlemi bir sonraki katmana (Controller'a) ilet
};

// --- ÜRÜN DOĞRULAMALARI ---
const urunValidation = [
  body("ad").notEmpty().withMessage("Ürün adı boş bırakılamaz"),
  body("kategori").notEmpty().withMessage("Kategori seçimi zorunludur"),
  body("fiyat")
    .isFloat({ min: 0 })
    .withMessage("Fiyat 0 veya daha büyük geçerli bir rakam olmalıdır"),
];

module.exports = {
  validateRequest,
  urunValidation,
};
