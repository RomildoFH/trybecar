const { passengerModel, waypointModel, travelModel } = require('../models');
const schema = require('./validations/validationsInputValues');

const passengerExists = async (passengerId) => {
  const passenger = await passengerModel.findById(passengerId);
  if (passenger) return true;
  return false;
};

const saveWaypoints = (waypoints, travelId) => {
  if (waypoints && waypoints.length > 0) {
    return waypoints.map(async (value) => {
      await waypointModel.insert({
        address: value.address,
        stopOrder: value.stopOrder,
        travelId,
      });
    });
  }

  return [];
};

const findAll = async () => {
  const passengers = await passengerModel.findAll();
  return { type: null, message: passengers }; // Este é o contrato, que pode ser definido de diversas formas, este padrão é um exemplo. Type é o resultado da requisição, que pode ser um erro. Message é a mensagem gerada pelo resultado da consulta.
};

const findById = async (passengerId) => {
  const error = schema.validateId(passengerId);
  if (error.type) return error;

  const passenger = await passengerModel.findById(passengerId);
  if (!passenger) return { type: 'PASSENGER_NOT_FOUND', message: 'Passenger not found' };

  return { type: null, message: passenger };
};

const createPassenger = async (name, email, phone) => {
  const error = schema.validateNewPassenger(name, email, phone);
  if (error.type) return error;

  const newPassengerId = await passengerModel.insert({ name, email, phone });
  const newPassenger = await passengerModel.findById(newPassengerId);

  return { type: null, message: newPassenger };
};

const requestTravel = async (passengerId, startingAddress, endingAddress, waypoints) => {
  const validationResult = schema.validateRequestTravelSchema(
    passengerId,
    startingAddress,
    endingAddress,
    waypoints,
  );

  if (validationResult.type) return validationResult;
  
  if (await passengerExists(passengerId)) {
    const travelId = await travelModel.insert({
      passengerId,
      startingAddress,
      endingAddress,
    });

    await Promise.all(saveWaypoints(waypoints, travelId));
    const travel = await travelModel.findById(travelId);
    return { type: null, message: travel };
  }
};

module.exports = {
  findAll,
  findById,
  createPassenger,
  requestTravel,
};