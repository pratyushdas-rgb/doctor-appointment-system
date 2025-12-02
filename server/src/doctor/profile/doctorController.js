const service = require('./doctorService');

const getProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const profile = await service.getMyProfile(userId);
    return res.json(profile);
  } catch (err) {
    console.error('getProfile error:', err);
    if (err.message && err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const payload = {
      specialization_id: req.body.specialization_id,
      department_id: req.body.department_id,
      bio: req.body.bio,
      documents: req.body.documents 
    };

    const updated = await service.updateMyProfile(userId, payload);
    return res.json(updated);
  } catch (err) {
    console.error('updateProfile error:', err);
    if (err.message && err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
