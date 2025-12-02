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




module.exports = { register, login};
