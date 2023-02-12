const express = require('express');
const { travelModel, driverModel, carModel, driverCarModel } = require('./models');
const { passengerService, driverService } = require('./services');

const app = express();

app.use(express.json());

const DRIVER_ON_THE_WAY = 2;
const TRAVEL_IN_PROGRESS = 3;
const TRAVEL_FINISHED = 4;

app.post('/passengers/:passengerId/request/travel', async (req, res) => {
  const { passengerId } = req.params;
  const { startingAddress, endingAddress, waypoints } = req.body;

  const travel = await passengerService.requestTravel(
    passengerId, 
    startingAddress, 
    endingAddress, 
    waypoints,
  );
  
  res.status(201).json(travel);
});

app.post('/drivers-cars', async (req, res) => {
  const driver = req.body;
  const result = await driverCarModel.insert(driver);
  res.status(200).json(result);
});

app.get('/drivers/open/travels', async (_req, res) => {
  const result = await driverService.getWaitingDriverTravels();
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
