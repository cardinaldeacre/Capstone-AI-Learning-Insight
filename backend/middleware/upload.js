const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = `public/uploads/submissions`;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLocaleLowerCase();

  if (ext === '.zip' || ext === '.rar') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file zip/rar yang diperbolehkan'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter
});

module.exports = upload;
