// tests/unit/models/mocks/passenger.model.mock.js
const passengers = [
  {
    id: 1,
    name: 'Doriana Quintal',
    email: 'doriana.quintal@acme.com',
    phone: '(49) 3882-3117',
  },
  {
    id: 2,
    name: 'Leo Sampaio',
    email: 'leo.sampaio@acme.com',
    phone: '(66) 3692-7793',
  },
  {
    id: 3,
    name: 'Anabela Monteiro',
    email: 'anabela.monteiro@acme.com',
    phone: '(49) 2134-2152',
  },
  {
    id: 4,
    name: 'Estêvão Paranhos',
    email: 'estevao.paranhos@acme.com',
    phone: '(82) 2166-2413',
  },
  {
    id: 5,
    name: 'Mateo Vidigal',
    email: 'mateo.vidigal@acme.com',
    phone: '(51) 2303-7355',
  },
];

const newPassenger = {
  name: 'Bruce Lane',
  email: 'bruce.lane@acme.com',
  phone: '(77) 8179-0943',
};

module.exports = {
  passengers,
  newPassenger,  
};