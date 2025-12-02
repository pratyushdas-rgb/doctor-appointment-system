const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authRepository = require('./authRepository');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const requestPasswordReset = async (email) => {
  const user = await authRepository.getUserByEmail(email);

  if (!user) {
    return { message: 'User not exists' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await authRepository.setResetToken(user.email, token, expires);

const resetLink = `${process.env.FRONTEND_URL.replace(/\/$/, '')}/auth/reset-password?token=${encodeURIComponent(token)}`;


  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: 'Password reset request',
    html: `
      <p>Hi ${user.first_name || 'there'},</p>
      <p>You (or someone else) requested to reset your password. Click the link below to set a new password. This link expires in 1 hour.</p>
      <p><a href="${resetLink}">Reset password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending password reset email:', err);

  }

  return { message: 'A reset link has been sent to the email.' };
};

const resetPassword = async (token, newPassword) => {
  const user = await authRepository.getUserByResetToken(token);
  if (!user) {
    throw new Error('Invalid or expired password reset token.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await authRepository.updatePasswordById(user.id, hashedPassword);

  return { message: 'Password has been reset successfully.' };
};

module.exports = { registerUser, loginUser,   requestPasswordReset, resetPassword};
