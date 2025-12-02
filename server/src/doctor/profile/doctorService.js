const repo = require('./doctorRepository');

const getMyProfile = async (userId) => {
  const doctorId = await repo.getDoctorIdByUserId(userId);
  if (!doctorId) throw new Error('Doctor profile not found');
  const profile = await repo.getDoctorProfileByDoctorId(doctorId);
  return profile;
};

const updateMyProfile = async (userId, payload) => {
  const doctorId = await repo.getDoctorIdByUserId(userId);
  if (!doctorId) throw new Error('Doctor profile not found');

  const specializationId = payload.specialization_id ?? null;
  const departmentId = payload.department_id ?? null;
  const bio = payload.bio ?? null;
  const documents = Array.isArray(payload.documents) ? payload.documents : [];

  const updated = await repo.updateDoctorProfile({
    doctorId,
    specializationId,
    departmentId,
    bio,
    documents
  });

  return updated;
};

module.exports = { getMyProfile, updateMyProfile };
