const { expect } = require('chai');
const { afterEach } = require('mocha');
const sinon = require('sinon');
const { carModel } = require('../../../src/models');
const carService = require('../../../src/services/car.service');
const { 
  carMock,
  invalidModelResponse,
  invalidColorResponse,
  invalidPlateResponse,
 } = require('./mocks/car.service.mock');

describe('Verificando service Car ', function () {
  describe('Tentando cadastrar um novo carro com erros semânticos', function () {
    it('retorna um erro ao receber um modelo inválido', async function () {
      sinon.stub(carModel, 'insert').resolves(invalidModelResponse);
      const car = await carService.createCar(
        { model: 'F', color: 'Preto', licensePlate: 'KII7124' },
      );

      expect(car).to.deep.equal(invalidModelResponse);
      expect(car.type).to.equal('INVALID_VALUE');
    });

    it('retorna um erro ao receber uma cor inválida', async function () {
      sinon.stub(carModel, 'insert').resolves(invalidColorResponse);
      const car = await carService.createCar(
        { model: 'Fiat Grand Siena', color: 'P', licensePlate: 'KII7124' },
      );

      expect(car).to.deep.equal(invalidColorResponse);
      expect(car.type).to.equal('INVALID_VALUE');
    });

    it('retorna um erro ao receber uma placa inválida', async function () {
      sinon.stub(carModel, 'insert').resolves(invalidPlateResponse);
      const car = await carService.createCar(
        { model: 'Fiat Grand Siena', color: 'Preto', licensePlate: 'KII-7124' },
      );

      expect(car).to.deep.equal(invalidPlateResponse);
      expect(car.type).to.equal('INVALID_VALUE');
    });
  });

  describe('Cadastrando um novo carro com sucesso', function () {
    it('não retorna erros', async function () {
      sinon.stub(carModel, 'insert').resolves(carMock);
      const car = await carService.createCar(carMock);

      expect(car.type).to.equal(undefined);
    });

    it('retorna o carro cadastrado', async function () {
      sinon.stub(carModel, 'insert').resolves(carMock);
      const car = await carService.createCar(carMock);

      expect(car).to.equal(carMock);
    });
  });

  afterEach(function () {
    sinon.restore();
  });
});