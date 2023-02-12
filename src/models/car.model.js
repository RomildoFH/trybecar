const snakeize = require('snakeize');
const camelize = require('camelize');
const connection = require('./connection');

const findAll = async () => {
  const result = await connection.execute('SELECT * FROM trybecardb.cars');
  return result;
};

const insert = async (car) => {
  const columns = Object.keys(snakeize(car)).join(', ');
  const placeholders = Object.values(car).map((_key) => '?').join(', ');
  const [{ insertId }] = await connection.execute(
    `INSERT INTO trybecardb.cars (${columns}) VALUE (${placeholders})`,
  [...Object.values(car)],
  );
  return ({ id: insertId, ...car });
};

const findById = async (id) => {
  const [[result]] = await connection.execute(
    'SELECT * FROM trybecardb.cars WHERE id = ?', [id],
  );

  return camelize(result);
};

module.exports = {
  findAll,
  insert,
  findById,
};