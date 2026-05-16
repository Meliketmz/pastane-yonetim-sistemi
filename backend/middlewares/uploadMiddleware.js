const multer = require("multer");
const path = require("path");

// Resimlerin kaydedileceği yer ve isimlendirme kuralları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Ana dizindeki uploads klasörüne kaydet
  },
  filename: (req, file, cb) => {
    // İki pasta aynı isimde yüklenirse çakışmasın diye isimlerine tarih ekliyoruz
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Sadece resim formatlarına izin veren güvenlik filtresi
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Resimse izin ver
  } else {
    cb(new Error("Sadece resim dosyaları yüklenebilir!"), false); // Değilse reddet
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum dosya boyutu: 5MB
});

module.exports = upload;
