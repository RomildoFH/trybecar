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

const carList = [
  {
    id: 1,
    model: 'Renault Sandero',
    color: 'Branco',
    licensePlate: 'NCA-0956',
  },
  {
    id: 2,
    model: 'Volkswagen Gol',
    color: 'Vermelho',
    licensePlate: 'DZG-4376',
  },
  {
    id: 3,
    model: 'Chevrolet Onix',
    color: 'Prata',
    licensePlate: 'KBJ-2899',
  },
  {
    id: 4,
    model: 'Renault Logan',
    color: 'Azul',
    licensePlate: 'NFA-9035',
  },
  {
    id: 5,
    model: 'Fiat Siena',
    color: 'Cinza',
    licensePlate: 'HTH-9177',
  },
  {
    id: 6,
    model: 'Nissan Versa',
    color: 'Preto',
    licensePlate: 'BGY-6802',
  },
];

module.exports = {
  carMock,
  invalidModelResponse,
  invalidColorResponse,
  invalidPlateResponse,
  carList,
};