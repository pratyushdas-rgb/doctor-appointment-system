const express = require('express');
const router = express.Router();
const ctrl = require('./referenceController');

router.get('/specializations', ctrl.getSpecializations);
router.get('/departments', ctrl.getDepartments);

module.exports = router;
