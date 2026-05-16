const express = require("express");
const router = express.Router();
const urunController = require("../controllers/urunController");
const {
  validateRequest,
  urunValidation,
} = require("../middlewares/validationMiddleware");

// CRUD Rotalarımız - GET ve DELETE işlemlerinde gövde (body) verisi olmadığı için validation gerekmez
router.get("/", urunController.getUrunler);

// POST ve PUT işlemlerinde önce 'urunValidation' kuralları, sonra 'validateRequest' hata kontrolü, en son Controller çalışır
router.post("/", urunValidation, validateRequest, urunController.createUrun);
router.put("/:id", urunValidation, validateRequest, urunController.updateUrun);
router.delete("/:id", urunController.deleteUrun);

module.exports = router;
