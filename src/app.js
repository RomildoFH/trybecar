const express = require('express');
const { driverModel, carModel, driverCarModel } = require('./models');
const { driverService, carService } = require('./services');
const { passengerRouter, driverRoutes } = require('./routers');

const app = express();

app.use(express.json());
app.use('/passengers', passengerRouter);
app.use('/drivers', driverRoutes);

app.post('/drivers-cars', async (req, res) => {
  const driver = req.body;
  const result = await driverCarModel.insert(driver);
  res.status(200).json(result);
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
  const result = await driverService.createDriver(driver);
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
