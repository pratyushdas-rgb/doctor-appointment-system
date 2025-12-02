const service = require('./availabilityService');

const setAvailability = async (req, res) => {
  try {
      const userId = req.user.id;
    const { date, start_time, end_time, slot_duration_minutes } = req.body;

    if (!date || !start_time || !end_time || !slot_duration_minutes) {
      return res.status(400).json({
        error: 'date, start_time, end_time, slot_duration_minutes required'
      });
    }

const result = await service.setAvailability({
  userId,
  date,
  startTime: start_time,
  endTime: end_time,
  slotDuration: parseInt(slot_duration_minutes, 10)
});


    res.status(201).json(result);
  } catch (err) {
    console.error('setAvailability error:', err);
    res.status(500).json({ error: err.message });
  }
};

const getAvailabilitySlots = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.query.date;

    if (!date) {
      return res
        .status(400)
        .json({ error: 'date query parameter required (YYYY-MM-DD)' });
    }

    const slots = await service.getAvailabilitySlots(userId, date);
    res.json({ date, slots });
  } catch (err) {
    console.error('getAvailabilitySlots error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  setAvailability,
  getAvailabilitySlots
};
