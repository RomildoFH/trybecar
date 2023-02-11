const express = require('express');
const { travelModel, passengerModel, driverModel, carModel, driverCarModel } = require('./models');
const connection = require('./models/connection');

const app = express();

app.use(express.json());

const WAITING_DRIVER = 1;
const DRIVER_ON_THE_WAY = 2;
const TRAVEL_IN_PROGRESS = 3;
const TRAVEL_FINISHED = 4;

const passengerExists = async (passengerId) => {
  // const [[passenger]] = await connection.execute(
  //   'SELECT * FROM passengers WHERE id = ?',
  //   [passengerId],
  // );
  const passenger = await passengerModel.findById(passengerId);
  if (passenger) return true;
  return false;
};

const saveWaypoints = (waypoints, travelId) => {
  if (waypoints && waypoints.length > 0) {
    return waypoints.map(async (value) => connection.execute(
      'INSERT INTO waypoints (address, stop_order, travel_id) VALUE (?, ?, ?)',
      [value.address, value.stopOrder, travelId],
    ));
  }
  return [];
};

app.post('/passengers/:passengerId/request/travel', async (req, res) => {
  const { passengerId } = req.params;
  const { startingAddress, endingAddress, waypoints } = req.body;
  if (await passengerExists(passengerId)) {
    /* Aqui substituímos o trecho de código SQL pela chamada a função insert do model
     e armazenamos o retorno da função na variável travelId */
     const travelId = await travelModel.insert({ passengerId, startingAddress, endingAddress });

     /* Renomeamos o parâmetro result.insertId para travelId */
     await Promise.all(saveWaypoints(waypoints, travelId));

     const travel = await travelModel.findById(travelId);
     return res.status(201).json(travel);
  }
  res.status(500).json({ message: 'Ocorreu um erro' });
});

app.post('/drivers-cars', async (req, res) => {
  const driver = req.body;
  const result = await driverCarModel.insert(driver);
  res.status(200).json(result);
});

app.get('/drivers/open/travels', async (_req, res) => {
  const result = await travelModel.findByTravelStatusId(WAITING_DRIVER);
  res.status(200).json(result);
});

app.put('/drivers/:driverId/travels/:travelId/assign', async (req, res) => {
  const { travelId, driverId } = req.params;
  /* await connection.execute(
    'UPDATE travels SET driver_id = ? WHERE id = ?',
    [driverId, travelId],
  );
  await connection.execute(
    'UPDATE travels SET travel_status_id = ? WHERE id = ? AND driver_id = ?',
    [DRIVER_ON_THE_WAY, travelId, driverId],
  ); */
  
  await travelModel.updateById(travelId, {
    driverId,
    travelStatusId: DRIVER_ON_THE_WAY,
  });

  /* const [[result]] = await connection.execute(
    'SELECT * FROM travels WHERE id = ?',
    [travelId],
  ); */

  const result = await travelModel.findById(travelId);

  res.status(200).json(result);
});

app.put('/drivers/:driverId/travels/:travelId/start', async (req, res) => {
  const { travelId, driverId } = req.params;
  // await connection.execute(
  //   'UPDATE travels SET travel_status_id = ? WHERE id = ? AND driver_id = ?',
  //   [TRAVEL_IN_PROGRESS, travelId, driverId],
  // );

  await travelModel.updateById(travelId, {
    driverId,
    travelStatusId: TRAVEL_IN_PROGRESS,
  });
  // const [[result]] = await connection.execute(
  //   'SELECT * FROM travels WHERE id = ?',
  //   [travelId],
  // );
  const result = await travelModel.findById(travelId);
  res.status(200).json(result);
});

app.put('/drivers/:driverId/travels/:travelId/end', async (req, res) => {
  const { travelId, driverId } = req.params;
  // await connection.execute(
  //   'UPDATE travels SET travel_status_id = ? WHERE id = ? AND driver_id = ?',
  //   [TRAVEL_FINISHED, travelId, driverId],
  // );
  await travelModel.updateById(travelId, {
    driverId,
    travelStatusId: TRAVEL_FINISHED,
  });
  // const [[result]] = await connection.execute(
  //   'SELECT * FROM travels WHERE id = ?',
  //   [travelId],
  // );
  const result = await travelModel.findById(travelId);
  res.status(200).json(result);
});

app.get('/drivers/:id', async (req, res) => {
  const { id } = req.params;
  const result = await driverModel.findById(id);
  res.status(200).json(result);
});

app.get('/drivers', async (req, res) => {
  const [result] = await driverModel.findAll();
  res.status(200).json(result);
});

app.post('/drivers', async (req, res) => {
  const driver = req.body;
  const result = await driverModel.insert(driver);
  res.status(200).json(result);
});

app.get('/cars', async (req, res) => {
  const [result] = await carModel.findAll();
  res.status(200).json(result);
});

app.get('/cars/:id', async (req, res) => {
  const { id } = req.params;
  const result = await carModel.findById(Number(id));
  res.status(200).json(result);
});

app.post('/cars', async (req, res) => {
  const carData = req.body;
  const result = await carModel.insert(carData);
  res.status(200).json(result);
});

module.exports = app;
