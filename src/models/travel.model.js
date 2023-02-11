const snakeize = require('snakeize');
const camelize = require('camelize');
const connection = require('./connection');

const insert = async (travel) => {
  const columns = Object.keys(snakeize(travel)).join(', ');

  const placeholders = Object.keys(travel)
    .map((_key) => '?')
    .join(', ');

  const [{ insertId }] = await connection.execute(
    `INSERT INTO travels (${columns}) VALUE (${placeholders})`,
    [...Object.values(travel)],
  );

  return insertId;
};

const findById = async (travelId) => {
  const [[result]] = await connection.execute(
    'SELECT * FROM travels WHERE id = ?',
    [travelId],
  );
  return camelize(result);
};

const findByTravelStatusId = async (travelStatusId) => {
  const [result] = await connection.execute(
    'SELECT * FROM travels WHERE travel_status_id = ?',
    [travelStatusId],
  );
  return camelize(result);
};

// Opção não dinâmica, não é o mais recomendado
// const updateById = async (travelId, dataToUpdate) => connection.execute(
//     'UPDATE travels SET diver_id = ?, travel_status_id = ? WHERE id = ?;',
//     [dataToUpdate.driverId, dataToUpdate.travelStatusId, travelId],
//     );

// Opção recomendada, onde as propriedades são dinâmicas
const updateById = async (travelId, dataToUpdate) => {
  const columns = Object.keys(snakeize(dataToUpdate)).map((key) => `${key} = ?`).join(', ');
  return connection.execute(
    `UPDATE travels SET ${columns} WHERE id = ?;`,
    [...Object.values(dataToUpdate), travelId],
    );
  };

module.exports = {
  insert,
  findById,
  findByTravelStatusId,
  updateById,
};