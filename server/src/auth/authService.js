const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authRepository = require('./authRepository');

dotenv.config();

const registerUser = async (userData) => {
  const { first_name, last_name, email, password, role, phone_number } = userData;

  const existingUser = await authRepository.getUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await authRepository.createUser({ first_name, last_name, email, password_hash: hashedPassword, role, phone_number });
};


const loginUser = async (email, password) => {
  const user = await authRepository.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role_id,
      phone_number: user.phone_number
    }
  };
};



module.exports = { registerUser, loginUser};
