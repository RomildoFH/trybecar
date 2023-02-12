const { expect } = require('chai');
const sinon = require('sinon');
const driverService = require('../../../src/services/driver.service');
const { driverModel, travelModel } = require('../../../src/models');
const {
  // DRIVER_ON_THE_WAY,
  correctReturnTravel,
  correctReturnDriver,
  // correctAssignTravel,
  driverList,
} = require('./mocks/driver.service.mock');

describe('Verificando service Driver', function () {
  describe('Atribuições de viagem com erros de id inexistente', function () {
    it('estão falhando ao tentar atribuir uma viagem com motorista inexistente', async function () {
      sinon.stub(driverModel, 'findById').resolves(undefined);
      sinon.stub(travelModel, 'findById').resolves(correctReturnTravel);
      const result = await driverService.travelAssign({ travelId: 1, driverId: 999 });

      expect(result.type).to.be.equal('DRIVER_NOT_FOUND');
      expect(result.message).to.be.equal('driver id not found');
    });
    it('estão falhando ao tentar atribuir uma viagem com viagem inexistente', async function () {
      sinon.stub(driverModel, 'findById').resolves(correctReturnDriver);
      sinon.stub(travelModel, 'findById').resolves(undefined);
      const result = await driverService.travelAssign({ travelId: 99, driverId: 1 });

      expect(result.type).to.be.equal('TRAVEL_NOT_FOUND');
      expect(result.message).to.be.equal('travel id not found');
    });
  });

  describe('Atribuições de viagem com sucesso', function () {
    it('estão atribuindo com sucesso', async function () {
      sinon.stub(driverModel, 'findById').resolves(correctReturnDriver);
      sinon.stub(travelModel, 'findById').resolves(correctReturnTravel);
      sinon.stub(travelModel, 'updateById').resolves(true);

      const travel = await driverService.travelAssign({ travelId: 1, driverId: 1 });

      expect(travel).to.deep.equal(correctReturnTravel);
    });
  });

  describe('Listando as pessoas motoristas', function () {
    it('a lista de motoristas é um array', async function () {
      sinon.stub(driverModel, 'findAll').resolves([driverList]);
      
      const drivers = await driverService.getDrivers();

      expect(drivers.message instanceof Array).to.equal(true);
    });

    it('retorna a lista de motoristas com sucesso', async function () {
      sinon.stub(driverModel, 'findAll').resolves([driverList]);
      
      const drivers = await driverService.getDrivers();

      expect(drivers.message).to.deep.equal(driverList);
    });
  });
  describe('Tentando cadastrar uma nova pessoa motorista com erros semânticos', function () {
    it('retorna um erro ao receber um nome inválido', async function () {

    });
    it('retorna um erro ao receber uma lista de carros inválida', async function () {

    });
  });
  describe('Tentando cadastrar uma nova pessoa motorista com erros de id', function () {
    it('retorna o erro “CAR_NOT_FOUND”', async function () {

    });
    it('retorna a mensagem “Some car is not found”', async function () {

    });
  });
  describe('Cadastrando uma nova pessoa motorista com sucesso sem carro', function () {
    it('retorna a pessoa motorista cadastrada', async function () {

    });
    it('não retorna erro', async function () {

    });
  });
  describe('Cadastrando uma nova pessoa motorista com sucesso com carros', function () {
    it('retorna os carros vinculados à pessoa motorista', async function () {

    });
    it('não retorna erro', async function () {

    });
  });

  afterEach(function () {
    sinon.restore();
  });
});
