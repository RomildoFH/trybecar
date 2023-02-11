const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../src/models/connection');
const { driverCarModel } = require('../../../src/models/index');

describe('Realizar testes da camada model na rota /driver-car', function () {
  afterEach(function () {
    sinon.restore();
  });
  
  it('Realizar testes na rota post/driver-car', async function () {
    const expected = 1;
    const mockExecute = [{ insertId: 1 }];
    const relationship = {
      driver_id: 3,
      car_id: 1,
    };

    sinon.stub(connection, 'execute').resolves(mockExecute);

    const result = await driverCarModel.insert(relationship);

    expect(result).to.equal(expected);
  });
});