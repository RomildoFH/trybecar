// Vamos utilizar esse objeto como mock da função createPassenger que ainda vamos implementar.
const passengerMock = {
  name: 'Bruce Lane',
  email: 'bruce.lane@acme.com',
  phone: '(77) 8179-0943',
};

// Vamos utilizar esse objeto como mock da função createPassenger que ainda vamos implementar.
const newPassengerMock = { id: 1, ...passengerMock };

// Esse é o array que utilizamos no teste da função findAll, reaproveitando o objeto newPassengerMock
const passengerListMock = [newPassengerMock];

/* Este objeto emula o que vai ser ser enviado na requisição! */
const happyReqCreateTravelObject = {
  params: {
    passengerId: 42,
  },
  body: {
    startingAddress: 'Rua X',
    endingAddress: 'Rua Y',
    waypoints: [
      {
        address: 'Ponto 01',
        stopOrder: '1',
      },
      {
        address: 'Ponto 02',
        stopOrder: '2',
      },
    ],
  },
};

/* Este objeto vai emular um objeto de uma viagem recém-criada */
const happyResponseCreateTravelObject = {
  id: 3,
  passengerId: 3,
  driverId: null,
  travelStatusId: 1,
  startingAddress: 'Rua X',
  endingAddress: 'Rua Y',
  requestDate: '2022-08-28T21:10:35.000Z',
};

/* Este objeto vai emular o retorno do service no cenário feliz */
const happyControllerResponseCreateTravelObject = {
  type: null,
  message: happyResponseCreateTravelObject
};

module.exports = {
  passengerMock,
  newPassengerMock,
  passengerListMock,
  happyReqCreateTravelObject,
  happyControllerResponseCreateTravelObject,
  happyResponseCreateTravelObject,
};