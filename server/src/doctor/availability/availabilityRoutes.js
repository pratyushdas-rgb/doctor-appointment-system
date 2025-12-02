const express = require('express');
const router = express.Router();
const availabilityController = require('./availabilityController');
router.post(
  '/doctor/availability',

  availabilityController.setAvailability
);

router.get('/doctor/availability', availabilityController.getAvailabilitySlots);

module.exports = router;
