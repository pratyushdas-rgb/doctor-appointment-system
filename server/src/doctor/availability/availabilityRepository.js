const squel = require('squel').useFlavour('postgres');
const {client} = require('../../config/db'); 


const getDoctorIdByUserId = async (userId) => {
  const sql = squel.select()
    .from('doctors')
    .field('id')
    .where('user_id = ?', userId)
    .limit(1)
    .toParam();

  const res = await client.query({ text: sql.text, values: sql.values });
  return res.rows.length ? res.rows[0].id : null;
};

const createAvailability = async ({ doctorId, date, startTime, endTime, slotDuration }) => {
  const sql = squel.insert()
    .into('doctor_availabilities')
    .set('doctor_id', doctorId)
    .set('date', date)
    .set('start_time', startTime)
    .set('end_time', endTime)
    .set('slot_duration_minutes', slotDuration)
    .toParam(); 

  const result = await client.query({ text: sql.text, values: sql.values });
  return result.rows[0]; 
};

const createAvailabilityReturning = async (data) => {
  const sql = squel.insert()
    .into('doctor_availabilities')
    .set('doctor_id', data.doctorId)
    .set('date', data.date)
    .set('start_time', data.startTime)
    .set('end_time', data.endTime)
    .set('slot_duration_minutes', data.slotDuration)
    .returning('*')
    .toParam();

  const res = await client.query({ text: sql.text, values: sql.values });
  return res.rows[0] || null;
};

const getAvailabilitiesByDoctorAndDate = async (doctorId, date) => {
  const sql = squel.select()
    .from('doctor_availabilities', 'a')
    .field('a.*')
    .where('a.doctor_id = ?', doctorId)
    .where('a.date = ?', date)
    .where('a.is_active = true')
    .order('a.start_time')
    .toParam();

  const res = await client.query({ text: sql.text, values: sql.values });
  return res.rows;
};

const getAppointmentsForDoctorDate = async (doctorId, date) => {
  const sql = squel.select()
    .from('appointments', 'ap')
    .field('ap.id')
    .field('ap.patient_id')
    .field('ap.appointment_date')
    .field('ap.status')
    .where('ap.doctor_id = ?', doctorId)
    .where('date(ap.appointment_date) = ?', date)
    .toParam();

  const res = await client.query({ text: sql.text, values: sql.values });
  return res.rows;
};

const deleteAvailability = async (availabilityId) => {
  const sql = squel.update()
    .table('doctor_availabilities')
    .set('is_active', false)
    .set('updated_at', squel.rstr("now()"))
    .where('id = ?', availabilityId)
    .toParam();

  await client.query({ text: sql.text, values: sql.values });
  return true;
};

module.exports = {
  getDoctorIdByUserId,
    createAvailability,
  createAvailabilityReturning,
  getAvailabilitiesByDoctorAndDate,
  getAppointmentsForDoctorDate,
  deleteAvailability
};
