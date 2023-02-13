const express = require('express');
const { driverController } = require('../controllers');

const router = express.Router();

router.get('/open/travels', driverController.openTravel);

router.put('/:driverId/travels/:travelId/assign', driverController.travelAssign);

router.put('/:driverId/travels/:travelId/start', driverController.startTravel);

router.put('/:driverId/travels/:travelId/end', driverController.endTravel);

module.exports = router;