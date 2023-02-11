const camelize = require('camelize');
const connection = require('./connection');

const findAll = async () => {
  const result = await connection.execute(
    'SELECT * FROM drivers',
  );
  return camelize(result); 
};

const findById = async (id) => {
  const [[result]] = await connection.execute(
    'SELECT * FROM drivers WHERE id = ?', [id],
  );

  return camelize(result);
};

const insert = async (driver) => {
  const [result] = await connection.execute(
    'INSERT INTO drivers (name) VALUE (?)', [driver.name],
  );
  return result.insertId;
};

module.exports = {
  findAll,
  findById,
  insert,
};