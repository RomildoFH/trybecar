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

module.exports = {
  DRIVER_ON_THE_WAY,
  correctReturnTravel,
  correctReturnDriver,
  correctAssignTravel,
};
