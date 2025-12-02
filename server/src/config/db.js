const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Database connection failed', err);
  }
};

const disconnectDB = async () => {
  await client.end();
  console.log('Disconnected from PostgreSQL database');
};

module.exports = { client, connectDB, disconnectDB };
