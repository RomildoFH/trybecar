const { travelModel } = require('../models');

const WAITING_DRIVER = 1;

const getWaitingDriverTravels = async () => {
  const travels = await travelModel.findByTravelStatusId(WAITING_DRIVER);
  return { type: null, message: travels }; 
};

module.exports = {
  getWaitingDriverTravels,
};