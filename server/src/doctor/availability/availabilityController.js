const service = require("./availabilityService");
const Joi = require("joi");

const setAvailability = async (req, res) => {
  const schema = Joi.object({
    date: Joi.string().isoDate().required().messages({
      "string.isoDate": "date must be in ISO format (YYYY-MM-DD)",
      "any.required": "date is required",
    }),

    start_time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required()
      .messages({
        "string.pattern.base": "start_time must be in HH:mm (24h) format",
        "any.required": "start_time is required",
      }),

    end_time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required()
      .messages({
        "string.pattern.base": "end_time must be in HH:mm (24h) format",
        "any.required": "end_time is required",
      }),

    slot_duration_minutes: Joi.number()
      .integer()
      .min(1)
      .max(1440)
      .required()
      .messages({
        "number.base": "slot_duration_minutes must be a number",
        "number.integer": "slot_duration_minutes must be an integer",
        "number.min": "slot_duration_minutes must be at least 1",
        "number.max": "slot_duration_minutes seems too large",
        "any.required": "slot_duration_minutes is required",
      }),
  });

  try {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        errors: error.details.map((d) => d.message),
      });
    }

    const { date, start_time, end_time, slot_duration_minutes } = value;

    const toMinutes = (hhmm) => {
      const [hh, mm] = hhmm.split(":").map(Number);
      return hh * 60 + mm;
    };

    const startMin = toMinutes(start_time);
    const endMin = toMinutes(end_time);

    if (endMin <= startMin) {
      return res.status(400).json({
        status: "fail",
        errors: ["end_time must be greater than start_time"],
      });
    }

    if (slot_duration_minutes > endMin - startMin) {
      return res.status(400).json({
        status: "fail",
        errors: [
          "slot_duration_minutes must be less than the total available window",
        ],
      });
    }

    const userId = req.user && req.user.id;

    const result = await service.setAvailability({
      userId,
      date,
      startTime: start_time,
      endTime: end_time,
      slotDuration: parseInt(slot_duration_minutes, 10),
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error("setAvailability error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

module.exports = { setAvailability };

const getAvailabilitySlots = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.query.date;

    if (!date) {
      return res
        .status(400)
        .json({ error: "date query parameter required (YYYY-MM-DD)" });
    }

    const slots = await service.getAvailabilitySlots(userId, date);
    res.json({ date, slots });
  } catch (err) {
    console.error("getAvailabilitySlots error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  setAvailability,
  getAvailabilitySlots,
};
