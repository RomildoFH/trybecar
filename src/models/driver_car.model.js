const connection = require('./connection');

const insert = async (relationship) => {
  const columns = Object.keys(relationship).map((key) => (`${key}`)).join(', ');
  const placeholders = Object.values(relationship).map((_value) => ('?')).join(', ');
  const [{ insertId }] = await connection.execute(
    `INSERT INTO drivers_cars (${columns}) VALUE (${placeholders})`,
    [...Object.values(relationship)],
  );

  return insertId;
};

module.exports = {
  insert,
};