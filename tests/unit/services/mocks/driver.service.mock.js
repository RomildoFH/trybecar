const DRIVER_ON_THE_WAY = 2;

const correctReturnTravel = {
  "id": 18,
  "passengerId": 1,
  "driverId": null,
  "travelStatusId": 1,
  "startingAddress": "Rua XYZ",
  "endingAddress": "Rua ABC",
  "requestDate": "2023-02-12T18:45:25.000Z",
};

const correctReturnDriver = {
  "id": 1,
  "name": "Liana Cisneiros"
};

const correctAssignTravel = {
  "id": 18,
  "passengerId": 1,
  "driverId": 1,
  "travelStatusId": 2,
  "startingAddress": "Rua XYZ",
  "endingAddress": "Rua ABC",
  "requestDate": "2023-02-12T18:45:25.000Z",
};

const correctReturnDrivers = {
  type: null,
  message: [
    { id: 1, name: 'Liana Cisneiros' },
    { id: 2, name: 'Fábio Frazão' },
    { id: 3, name: 'Anastacia Bicalho' },
    { id: 4, name: 'Samara Granjeiro' },
    { id: 5, name: 'Levi Teixeira' },
  ],
};

const driverList = [
  [
    { id: 1, name: 'Liana Cisneiros' },
    { id: 2, name: 'Fábio Frazão' },
    { id: 3, name: 'Anastacia Bicalho' },
    { id: 4, name: 'Samara Granjeiro' },
    { id: 5, name: 'Levi Teixeira' },
  ],
  undefined
];

module.exports = {
  DRIVER_ON_THE_WAY,
  correctReturnTravel,
  correctReturnDriver,
  correctAssignTravel,
  correctReturnDrivers,
  driverList,
};
