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

module.exports = { createUser, getUserByEmail };
