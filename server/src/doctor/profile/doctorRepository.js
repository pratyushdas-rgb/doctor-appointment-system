const squel = require('squel').useFlavour('postgres');
const { client } = require('../../config/db');

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

const getDoctorProfileByDoctorId = async (doctorId) => {
  const sql = squel.select()
    .from('doctors', 'd')
    .left_join('users', 'u', 'u.id = d.user_id')
    .left_join('specializations', 's', 's.id = d.specialization_id')
    .left_join('departments', 'dep', 'dep.id = d.department_id')
    .field('d.id', 'doctor_id')
    .field('d.user_id')
    .field('d.specialization_id')
    .field('s.name', 'specialization_name')
    .field('d.department_id')
    .field('dep.name', 'department_name')
    .field('d.bio')
    .field('d.documents')
    .field('d.updated_at')
    .field('u.first_name')
    .field('u.last_name')
    .field('u.email')
    .where('d.id = ?', doctorId)
    .toParam();

  const res = await client.query({ text: sql.text, values: sql.values });
  return res.rows.length ? res.rows[0] : null;
};


const updateDoctorProfile = async ({ doctorId, specializationId, departmentId, bio, documents }) => {
  const sql = squel.update()
    .table('doctors')
    .set('specialization_id', specializationId)
    .set('department_id', departmentId)
    .set('bio', bio)
    .set('documents', squel.rstr('$1::jsonb'), documents) 
    .set('updated_at', squel.rstr('now()'))
    .where('id = ?', doctorId)
    .returning('*')
    .toParam();

  const text = `
    UPDATE doctors
    SET specialization_id = $1,
        department_id = $2,
        bio = $3,
        documents = $4::jsonb,
        updated_at = now()
    WHERE id = $5
    RETURNING *
  `;
  const values = [specializationId, departmentId, bio, JSON.stringify(documents), doctorId];

  const res = await client.query({ text, values });
  return res.rows.length ? res.rows[0] : null;
};

module.exports = {
  getDoctorIdByUserId,
  getDoctorProfileByDoctorId,
  updateDoctorProfile
};
