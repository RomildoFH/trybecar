const { expect } = require('chai');
const sinon = require('sinon');
const camelize = require('camelize');
const connection = require('../../../src/models/connection');
const { carsList, carMock } = require('./mocks/car.model.mock');
const { carModel } = require('../../../src/models/index');

describe('Testes unitários de models cars', function () {
  it('Testa se ao acessar a rota get/cars todos os carros são listados', async function () {
    sinon.stub(connection, 'execute').resolves(carsList);

    const result = await carModel.findAll();

    expect(result).to.deep.equal(carsList);
  });

  it('Teste se é possível cadastrar um carro no banco de dados', async function () {
    const newId = carsList.length + 1;
    const mockExecute = [{ insertId: newId }];
    const newCar = {
      model: 'Volkswagen Gol',
      color: 'Vermelho',
      licensePlate: 'DZG-4376',
    };
    sinon.stub(connection, 'execute').resolves(mockExecute);

    const result = await carModel.insert(newCar);

    expect(result).to.equal(carsList.length + 1);
  });

  it('Testa se retorna um objeto com os dados do carro na rota get/cars/:id', async function () {
    const searchId = 2;
    
    sinon.stub(connection, 'execute').resolves([[carMock]]);

    const result = await carModel.findById(searchId);

    expect(result).to.deep.equal(camelize(carMock));
  });
  
  afterEach(function () {
    sinon.restore();
  });
});