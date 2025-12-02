const repo = require('./referenceRepository');

const getSpecializations = async (req, res) => {
  try {
    const rows = await repo.getAllSpecializations();
    return res.json(rows);
  } catch (err) {
    console.error('getSpecializations error:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getDepartments = async (req, res) => {
  try {
    const rows = await repo.getAllDepartments();
    return res.json(rows);
  } catch (err) {
    console.error('getDepartments error:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSpecializations,
  getDepartments
};
