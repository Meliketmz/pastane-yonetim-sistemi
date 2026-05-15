const express = require("express");
const router = express.Router();
const urunController = require("../controllers/urunController");

router.get("/", urunController.getUrunler);
router.post("/", urunController.createUrun);
router.put("/:id", urunController.updateUrun);
router.delete("/:id", urunController.deleteUrun);

module.exports = router;
