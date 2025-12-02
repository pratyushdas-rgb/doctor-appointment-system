const express = require('express');
const router = express.Router();
const doctorController = require('../profile/doctorController')

router.get('/doctor/profile', doctorController.getProfile);
router.put('/doctor/profile',doctorController.updateProfile);

module.exports = router;
