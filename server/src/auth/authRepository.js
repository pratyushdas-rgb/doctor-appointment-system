const squel = require('squel');
const { client } = require('../config/db');  

const getUserByEmail = async (email) => {
  const query = {
    text: `SELECT id, first_name, last_name, email, password_hash, phone_number, role_id
           FROM users
           WHERE email = $1
           LIMIT 1`,
    values: [email]
  };

  console.log(query.text, query.values);

  try {
    const result = await client.query(query);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error querying user by email:', err);
    throw err;
  }
};


const createUser = async (userData) => {
  const query = squel.insert()
    .into('Users')
    .set('first_name', userData.first_name)
    .set('last_name', userData.last_name)
    .set('email', userData.email)
    .set('password_hash', userData.password_hash)
    .set('role_id', userData.role)
    .set('phone_number', userData.phone_number)
    .toString();

  try {
    await client.query(query);  
  } catch (err) {
    console.error('Error inserting user:', err);
    throw err;
  }
};

const setResetToken = async (email, token, expires) => {
  const query = {
    text: `UPDATE users
           SET reset_token = $1,
               reset_token_expires = $2
           WHERE email = $3
           RETURNING id, email`,
    values: [token, expires, email]
  };

  try {
    const res = await client.query(query);
    return res.rows[0] || null;
  } catch (err) {
    console.error('Error setting reset token:', err);
    throw err;
  }
};


const getUserByResetToken = async (token) => {
  const query = {
    text: `SELECT id, email, first_name, last_name
           FROM users
           WHERE reset_token = $1
             AND reset_token_expires > NOW()
           LIMIT 1`,
    values: [token]
  };

  try {
    const res = await client.query(query);
    return res.rows[0] || null;
  } catch (err) {
    console.error('Error querying user by reset token:', err);
    throw err;
  }
};

const updatePasswordById = async (userId, passwordHash) => {
  const query = {
    text: `UPDATE users
           SET password_hash = $1,
               reset_token = NULL,
               reset_token_expires = NULL
           WHERE id = $2`,
    values: [passwordHash, userId]
  };

  try {
    await client.query(query);
    return true;
  } catch (err) {
    console.error('Error updating password:', err);
    throw err;
  }
};

module.exports = { createUser, getUserByEmail,  setResetToken, getUserByResetToken, updatePasswordById };
