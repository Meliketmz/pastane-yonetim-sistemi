const express = require("express");
const router = express.Router();
const urunController = require("../controllers/urunController");
const {
  validateRequest,
  urunValidation,
} = require("../middlewares/validationMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // Resim yükleme görevlimiz

// Sadece ürünleri listeleme ve silme (Gövde verisi yok)
router.get("/", urunController.getUrunler);
router.delete("/:id", urunController.deleteUrun);

// POST: Önce 'resim' alanındaki dosyayı al -> Sonra verileri doğrula -> Hata yoksa Controller'a git
router.post(
  "/",
  upload.single("resim"),
  urunValidation,
  validateRequest,
  urunController.createUrun,
);

// PUT: Güncelleme sırasında da aynı sıralama geçerli
router.put(
  "/:id",
  upload.single("resim"),
  urunValidation,
  validateRequest,
  urunController.updateUrun,
);

module.exports = router;
