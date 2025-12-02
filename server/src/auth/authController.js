const authService = require('./authService');

const register = async (req, res) => {
  const { first_name, last_name, email, password, role, phone_number } = req.body;
  try {
    await authService.registerUser({ first_name, last_name, email, password, role, phone_number });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.loginUser(email, password);

    res.status(200).json({
      token: result.token,
      user: result.user
    });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await authService.requestPasswordReset(email);
    res.status(200).json(result);
  } catch (err) {
    console.error('requestPasswordReset error:', err);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};


const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and newPassword are required' });
  }

  try {
    const result = await authService.resetPassword(token, newPassword);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login, requestPasswordReset, resetPassword};
