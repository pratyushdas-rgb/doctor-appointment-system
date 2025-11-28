
const express = require('express');
const router = express.Router();
const availabilityController = require('./availabilityController');
router.post(
  '/doctors/:id/availabilities',

  availabilityController.setAvailability
);

router.get('/doctors/:id/availabilities', availabilityController.getAvailabilitySlots);

module.exports = router;
