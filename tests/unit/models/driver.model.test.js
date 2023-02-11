const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../src/models/connection');
const { driversList, driverMock } = require('./mocks/driver.model.mock');
const { driverModel } = require('../../../src/models/index');

describe('Testes de unidade do model de pessoas motoristas', function () {
  it('Retorna um array', async function () {
    sinon.stub(connection, 'execute').resolves(driversList);

    const result = await driverModel.findAll();

    expect(result).to.be.a('array');
  });

  it('Recupera lista com todos os motoristas cadastrados', async function () {
    sinon.stub(connection, 'execute').resolves(driversList);

    const result = await driverModel.findAll();

    expect(result).to.deep.equal(driversList);
  });

  it('Recupera objeto com dados do motorista através da rota get/drivers/:id', async function () {
    const { id } = driversList[0];

    sinon.stub(connection, 'execute').resolves([[driverMock]]);

    const result = await driverModel.findById(id);

    expect(result).to.deep.equal(driversList[0]);
  });

  it('Insere uma nova pessoa motorista, e retorna seu Id', async function () {
    const newId = driversList.length + 1;
    const newDriver = {
      name: 'Romildo Silva',
    };

    sinon.stub(connection, 'execute').resolves([{ insertId: newId }]);

    const result = await driverModel.insert(newDriver);

    expect(result).to.equal(newId);
  });
  
  afterEach(function () {
    sinon.restore();
  });
});