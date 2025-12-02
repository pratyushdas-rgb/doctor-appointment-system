const squel = require('squel').useFlavour('postgres');
const { client } = require('../config/db');

const getAllSpecializations = async () => {
  const sql = squel.select()
    .from('specializations')
    .field('id')
    .field('name')
    .order('name')
    .toParam();

  const res = await client.query({ text: sql.text, values: sql.values });
  return res.rows;
};

const getAllDepartments = async () => {
  const sql = squel.select()
    .from('departments')
    .field('id')
    .field('name')
    .order('name')
    .toParam();

  const res = await client.query({ text: sql.text, values: sql.values });
  return res.rows;
};

module.exports = {
  getAllSpecializations,
  getAllDepartments
};
