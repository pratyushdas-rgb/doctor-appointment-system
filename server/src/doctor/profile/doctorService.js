const repo = require('./doctorRepository');
const path = require('path')
const fs = require('fs')

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
const uploadDocument = async (userId, file) => {
  if (!file) throw new Error("No file uploaded");

  const doctorId = await repo.getDoctorIdByUserId(userId);
  if (!doctorId) throw new Error("Doctor profile not found");

  const uploadFolder = path.join(__dirname, "..", "..", "uploads", "doctors", String(doctorId));
  fs.mkdirSync(uploadFolder, { recursive: true });

  const newFileName = `${Date.now()}-${file.originalname}`;
  const destination = path.join(uploadFolder, newFileName);

  fs.renameSync(file.path, destination);

  const fileUrl = `/uploads/doctors/${doctorId}/${newFileName}`;

  const documentObj = {
    name: file.originalname,
    url: fileUrl,
    mime: file.mimetype,
    size: file.size,
    uploaded_at: new Date().toISOString(),
  };

  const updatedDocs = await repo.appendDocumentToDoctor(doctorId, documentObj);

  return {
    documents: updatedDocs,
    added: documentObj
  };
};

const deleteDocument = async (userId, fileUrl) => {
  const doctorId = await repo.getDoctorIdByUserId(userId);
  if (!doctorId) throw new Error("Doctor profile not found");

  const uploadRoot = path.join(__dirname, "..", "..", "uploads");
  const filePath = path.join(uploadRoot, fileUrl.replace("/uploads/", ""));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const updatedDocs = await repo.removeDocumentFromDoctor(doctorId, fileUrl);

  return updatedDocs;
};

module.exports = { getMyProfile, updateMyProfile, uploadDocument, deleteDocument };
