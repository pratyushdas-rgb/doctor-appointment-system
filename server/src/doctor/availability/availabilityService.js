const repo = require('./availabilityRepository');
const { parse, addMinutes, format } = require('date-fns'); 

const generateSlots = (dateStr, startTimeStr, endTimeStr, durationMinutes) => {
  const start = parse(`${dateStr} ${startTimeStr}`, 'yyyy-MM-dd HH:mm:ss', new Date());
  if (isNaN(start)) {
    const s2 = parse(`${dateStr} ${startTimeStr}`, 'yyyy-MM-dd HH:mm', new Date());
    if (!isNaN(s2)) start = s2;
  }
  let end = parse(`${dateStr} ${endTimeStr}`, 'yyyy-MM-dd HH:mm:ss', new Date());
  if (isNaN(end)) {
    const e2 = parse(`${dateStr} ${endTimeStr}`, 'yyyy-MM-dd HH:mm', new Date());
    if (!isNaN(e2)) end = e2;
  }

  const slots = [];
  let cur = start;
  while (cur < end) {
    const slotEnd = addMinutes(cur, durationMinutes);
    if (slotEnd > end) break;
    slots.push({
      start: format(cur, 'HH:mm'),
      end: format(slotEnd, 'HH:mm')
    });
    cur = slotEnd;
  }
  return slots;
};

const setAvailability = async ({ doctorId, date, startTime, endTime, slotDuration }) => {
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

const getAvailabilitySlots = async (doctorId, date) => {
  const availabilities = await repo.getAvailabilitiesByDoctorAndDate(doctorId, date);
  if (!availabilities || availabilities.length === 0) return [];

  const appointments = await repo.getAppointmentsForDoctorDate(doctorId, date);
  const bookedRanges = appointments.map(ap => {
    const start = (new Date(ap.appointment_date)).toTimeString().slice(0,5);
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
