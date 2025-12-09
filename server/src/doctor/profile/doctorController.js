const service = require("./doctorService");

const getProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const profile = await service.getMyProfile(userId);
    return res.json(profile);
  } catch (err) {
    console.error("getProfile error:", err);
    if (err.message && err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};
const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      specializationId = null,
      departmentId = null,
      bio = null,
      documents = [],
    } = req.body;

    const doctor = await service.createDoctorProfile({
      userId,
      specializationId,
      departmentId,
      bio,
      documents,
    });

    return res.status(201).json({ doctor });
  } catch (err) {
    console.error("createDoctor error:", err);
    const status = err.status || 500;
    const body = { error: err.message || "Internal server error" };
    if (err.doctorId) body.doctorId = err.doctorId;
    return res.status(status).json(body);
  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const payload = {
      specialization_id: req.body.specialization_id,
      department_id: req.body.department_id,
      bio: req.body.bio,
      documents: req.body.documents,
    };

    const updated = await service.updateMyProfile(userId, payload);
    return res.json(updated);
  } catch (err) {
    console.error("updateProfile error:", err);
    if (err.message && err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const result = await service.uploadDocument(req.user.id, req.file);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { url } = req.body;

    if (!url)
      return res.status(400).json({ error: "Document URL is required" });

    const docs = await service.deleteDocument(userId, url);

    return res.json({ message: "Document removed", documents: docs });
  } catch (err) {
    console.error("deleteDocument error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile, uploadDocument, deleteDocument,createDoctor};
