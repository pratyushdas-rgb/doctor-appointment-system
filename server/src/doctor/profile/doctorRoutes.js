const express = require('express');
const router = express.Router();
const doctorController = require('../profile/doctorController')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const tmpStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = path.join(__dirname, '..', '..', 'uploads', 'tmp');
    fs.mkdirSync(tmpDir, { recursive: true });
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    const ext = path.extname(file.originalname) || '';
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({
  storage: tmpStorage,
  limits: { fileSize: 20 * 1024 * 1024 } 
});

router.get('/doctor/profile', doctorController.getProfile);
router.post('/doctor/profile',doctorController.createDoctor);
router.put('/doctor/profile',doctorController.updateProfile);
router.post('/doctor/profile/documents', upload.single('file'), doctorController.uploadDocument);
router.delete('/doctor/profile/documents', doctorController.deleteDocument);

module.exports = router;
