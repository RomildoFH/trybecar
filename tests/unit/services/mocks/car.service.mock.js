const carMock = {
  mode: "Ford Ka",
  color: "Azul",
  licensePlate: "ABC1D2E",
};

const invalidModelResponse = {
  type: 'INVALID_VALUE',
  message: '"model" length must be at least 3 characters long',
};

const invalidColorResponse = {
  type: 'INVALID_VALUE',
  message: '"color" length must be at least 2 characters long',
};

const invalidPlateResponse = {
  type: 'INVALID_VALUE',
  message: '"licensePlate" length must be less than or equal to 7 characters long',
};

module.exports = {
  carMock,
  invalidModelResponse,
  invalidColorResponse,
  invalidPlateResponse,
};