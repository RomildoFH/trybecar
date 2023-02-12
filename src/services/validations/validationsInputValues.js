// src/services/validations/validationsInputValues.js

const { idSchema, addPassengerSchema, addRequestTravelSchema } = require('./schemas');
const { driverModel, travelModel } = require('../../models');

const validateId = (id) => {
  const { error } = idSchema.validate(id);
  if (error) return { type: 'INVALID_VALUE', message: '"id" must be a number' };
  
  return { type: null, message: '' };
};

const validateNewPassenger = (name, email, phone) => {
  const { error } = addPassengerSchema
  .validate({ name, email, phone });

  if (error) return { type: 'INVALID_VALUE', message: error.message };

  return { type: null, message: '' };
};

const validateRequestTravelSchema = (passengerId, startingAddress, endingAddress, waypoints) => {
  const { error } = addRequestTravelSchema
    .validate({ passengerId, startingAddress, endingAddress, waypoints });
  if (error) return { type: 'INVALID_VALUE', message: error.message };

  return { type: null, message: '' };
};

const validateTravelAssignSchema = async ({ travelId, driverId }) => {
  const travel = await travelModel.findById(travelId);
  if (!travel) return { type: 'TRAVEL_NOT_FOUND', message: 'travel id not found' };
  const driver = await driverModel.findById(driverId);
  if (!driver) return { type: 'DRIVER_NOT_FOUND', message: 'driver id not found' };
  return { type: '', message: '' };
};

const validadeAlreadyAssingn = async (travelId) => {
  const travel = await travelModel.findById(travelId);
  if (travel && travel.driverId) {
    return { type: 'TRAVEL_CONFLIT', message: 'traval already assigned' };
  }
  return { type: '', message: '' };
};

module.exports = {
  validateId,
  validateNewPassenger,
  validateRequestTravelSchema,
  validateTravelAssignSchema,
  validadeAlreadyAssingn,
};