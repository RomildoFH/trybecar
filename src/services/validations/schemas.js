// src/services/validations/schemas.js

const Joi = require('joi');

const idSchema = Joi.number().integer().min(1).required();

const addPassengerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(9).max(20).required(),
});

const pointSchema = Joi.string().min(3).required();

const waypointSchema = Joi.object({
  address: pointSchema,
  stopOrder: Joi.number().integer().min(1) });

const addRequestTravelSchema = Joi.object({
  passengerId: idSchema,
  startingAddress: pointSchema,
  endingAddress: pointSchema.invalid(Joi.ref('startingAddress')),
  waypoints: Joi.array().items(waypointSchema),
});

const addCarSchema = Joi.object({
  model: Joi.string().min(3).message('"model" length must be at least 3 characters long'),
  color: Joi.string().min(2).message('"color" length must be at least 2 characters long'),
  licensePlate:
    Joi.string()
      .min(7)
      .max(7)
      .message('"licensePlate" length must be less than or equal to 7 characters long'),
});

module.exports = {
  idSchema,
  addPassengerSchema,
  addRequestTravelSchema,
  addCarSchema,
};