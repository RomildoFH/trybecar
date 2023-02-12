const express = require('express');
const { driverModel, carModel, driverCarModel } = require('./models');
const { passengerService, driverService, carService } = require('./services');

const app = express();

app.use(express.json());

// const DRIVER_ON_THE_WAY = 2;
// const TRAVEL_IN_PROGRESS = 3;
// const TRAVEL_FINISHED = 4;

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
  
  // await travelModel.updateById(travelId, { // Acesso direto as models, deve ser feito pelo service
  //   driverId,
  //   travelStatusId: DRIVER_ON_THE_WAY,
  // });
  // const travel = await travelModel.findById(travelId);
  const travel = await driverService.travelAssign({ travelId, driverId });

  if (travel.type) return res.status(400).json(travel.message);

  return res.status(200).json(travel);
});

app.put('/drivers/:driverId/travels/:travelId/start', async (req, res) => {
  const { travelId, driverId } = req.params;

  const travel = await driverService.startTravel({ travelId, driverId });
  if (travel.type) return res.status(400).json(travel.message);
  return res.status(200).json(travel);
});

app.put('/drivers/:driverId/travels/:travelId/end', async (req, res) => {
  const { travelId, driverId } = req.params;
  const result = await driverService.endTravel({ travelId, driverId });
  if (result.type) return res.status(400).json(result.message);
  return res.status(200).json(result);
});

app.get('/drivers/:id', async (req, res) => {
  const { id } = req.params;
  const result = await driverModel.findById(id);
  res.status(200).json(result);
});

app.get('/drivers', async (req, res) => {
  const result = await driverService.getDrivers();
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
  const result = await carService.createCar(carData);
  res.status(200).json(result);
});

module.exports = app;
