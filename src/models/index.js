// src/models/index.js

/* Este vai ser o único lugar do nosso código onde importamos o objeto Model direto do seu arquivo */
const passengerModel = require('./passenger.model');
const travelModel = require('./travel.model');
const driverModel = require('./driver.model');
const carModel = require('./car.model');
const driverCarModel = require('./driver_car.model');
const waypointModel = require('./waypoint.model');

module.exports = {
  passengerModel,
  travelModel,
  driverModel,
  carModel,
  driverCarModel,
  waypointModel,
};