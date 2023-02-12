const { carModel } = require('../models');
const schema = require('./validations/validationsInputValues');

const createCar = async ({ model, color, licensePlate }) => {
  const error = await schema.validateCreateCar({ model, color, licensePlate });
  if (error.type) return ({ type: error.type, message: error.message });
  const car = await carModel.insert({ model, color, licensePlate });
  return car;
};

module.exports = {
  createCar,
};