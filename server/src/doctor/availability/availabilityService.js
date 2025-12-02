const repo = require('./availabilityRepository');

function parseTimeStr(timeStr) {
  const parts = timeStr.split(':');
  return {
    hours: parseInt(parts[0]),
    minutes: parseInt(parts[1])
  };
}

function makeDate(dateStr, timeStr) {
  const { hours, minutes } = parseTimeStr(timeStr);
  const d = new Date(dateStr);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function addMinutesNative(date, mins) {
  return new Date(date.getTime() + mins * 60000);
}

function formatTime(date) {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

const generateSlots = (dateStr, startTimeStr, endTimeStr, durationMinutes) => {
  let start = makeDate(dateStr, startTimeStr);
  let end = makeDate(dateStr, endTimeStr);

  const slots = [];
  let cur = start;

  while (cur < end) {
    const slotEnd = addMinutesNative(cur, durationMinutes);
    if (slotEnd > end) break;

    slots.push({
      start: formatTime(cur),
      end: formatTime(slotEnd)
    });

    cur = slotEnd;
  }

  return slots;
};

const setAvailability = async ({ userId, date, startTime, endTime, slotDuration }) => {
  const doctorId = await repo.getDoctorIdByUserId(userId);

  if (!doctorId) {
    throw new Error('Doctor profile not found for this user');
  }

  const created = await repo.createAvailabilityReturning({
    doctorId,
    date,
    startTime,
    endTime,
    slotDuration
  });

  const slots = generateSlots(date, startTime, endTime, slotDuration);
  return { availability: created, slots };
};


const getAvailabilitySlots = async (userId, date) => {
  const doctorId = await repo.getDoctorIdByUserId(userId);
  if (!doctorId) return [];
  
  const availabilities = await repo.getAvailabilitiesByDoctorAndDate(doctorId, date);
  if (!availabilities || availabilities.length === 0) return [];

  const appointments = await repo.getAppointmentsForDoctorDate(doctorId, date);

  const bookedRanges = appointments.map(ap => {
    const dt = new Date(ap.appointment_date);
    const start = formatTime(dt);
    return { start, id: ap.id, status: ap.status };
  });

  const allSlots = [];

  for (const a of availabilities) {
    const slots = generateSlots(date, a.start_time, a.end_time, a.slot_duration_minutes);

    const annotated = slots.map(s => {
      const booked = bookedRanges.some(b => b.start === s.start);
      return { ...s, booked };
    });

    allSlots.push(...annotated);
  }

  return allSlots;
};

module.exports = { setAvailability, getAvailabilitySlots, generateSlots };
