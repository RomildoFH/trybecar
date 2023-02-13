const express = require('express');
const { passengerController } = require('../controllers');
const validateNewPassengerFields = require('../middlewares/validateNewPassengerFields');
const validateRequestTravelSchema = require('../middlewares/validateRequestTravelSchema');

const router = express.Router();

router.get(
  '/',
  passengerController.listPassengers,
);

router.get(
  '/:id',
  passengerController.getPassenger,
);

router.post(
  '/',
  validateNewPassengerFields,
  passengerController.createPassenger,
);

router.post(
  '/:passengerId/request/travel',
  validateRequestTravelSchema,
  passengerController.createTravel,
);

module.exports = router;
