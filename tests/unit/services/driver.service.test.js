const { expect } = require('chai');
const sinon = require('sinon');
const driverService = require('../../../src/services/driver.service');
const { driverModel, travelModel, carModel, driverCarModel } = require('../../../src/models');
const {
  // DRIVER_ON_THE_WAY,
  correctReturnTravel,
  correctReturnDriver,
  // correctAssignTravel,
  driverList,
  createdDriverWithoutCars,
  createdDriverWithCars,
  createdDriver,
} = require('./mocks/driver.service.mock');

const { carList } = require('./mocks/car.service.mock');

const validDriverName = 'Gus';
const invalidValue = '1';

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
      const response = await driverService.createDriver(invalidValue);

      expect(response.type).to.equal('INVALID_VALUE');
      expect(response.message).to.equal(
        '"name" length must be at least 3 characters long',
      );
    });
    it('retorna um erro ao receber uma lista de carros inválida', async function () {
      const response = await driverService.createDriver(
        validDriverName,
        invalidValue,
      );

      expect(response.type).to.equal('INVALID_VALUE');
      expect(response.message).to.equal('"carIds" must be an array');
    });
  });
  describe('Tentando cadastrar uma nova pessoa motorista com erros de id', function () {
    beforeEach(function () {
      // Aqui o nosso stub deve simular que o carro solicitado não existe
      sinon.stub(carModel, 'findById').resolves();
    });

    afterEach(function () {
      sinon.restore();
    });

    it('retorna o erro “CAR_NOT_FOUND”', async function () {
      const response = await driverService.createDriver(validDriverName, [999]);

      expect(response.type).to.equal('CAR_NOT_FOUND');
    });
    it('retorna a mensagem “Some car is not found”', async function () {
      const response = await driverService.createDriver(validDriverName, [999]);

      expect(response.message).to.equal('Some car is not found');
    });
  });
  describe('Cadastrando uma nova pessoa motorista com sucesso sem carro', function () {
    beforeEach(function () {
      // como aqui estamos criando motorista sem carro,
      // não precisamos encontrar nenhum, apenas cadastrar e encontrar a pessoa motorista
      sinon.stub(driverModel, 'insert').resolves(1);
      sinon.stub(driverModel, 'findById').resolves(createdDriver);
    });

    afterEach(function () {
      sinon.restore();
    });

    it('retorna a pessoa motorista cadastrada', async function () {
      const response = await driverService.createDriver(validDriverName);
      
      expect(response.message).to.deep.equal(createdDriverWithoutCars);
    });
    it('não retorna erro', async function () {
      const response = await driverService.createDriver(validDriverName);
      
      expect(response.type).to.equal(null);
    });
  });
  describe('Cadastrando uma nova pessoa motorista com sucesso com carros', function () {
    beforeEach(function () {
      // já aqui temos vários stubs em cena!

      // 1 - cadastra e encontra a pessoa motorista ok
      sinon.stub(driverModel, 'insert').resolves(1);
      sinon.stub(driverModel, 'findById').resolves(createdDriver);

      // 2 - criação de relacionamentos ok
      sinon.stub(driverCarModel, 'insert').resolves();

      // 3 - ao procurar um carro, mande o primeiro e depois o segundo da lista
      // eles são chamados tanto ao validar como para retornar na função principal
      sinon.stub(carModel, 'findById')
      .onCall(0) // chamada da validação
        .resolves(carList[0])
      .onCall(1) // chamada da validação
        .resolves(carList[1])
      .onCall(2) // chamada da função
        .resolves(carList[0])
      .onCall(3) // chamada da função
        .resolves(carList[1]);
    });

    afterEach(function () {
      sinon.restore();
    });
    it('retorna os carros vinculados à pessoa motorista', async function () {
      const response = await driverService.createDriver(
        validDriverName,
        [1, 2],
      );

      expect(response.type).to.equal(null);
      expect(response.message).to.deep.equal(createdDriverWithCars);
    });
    it('não retorna erro', async function () {
      const response = await driverService.createDriver(
        validDriverName,
        [1, 2],
      );

      expect(response.type).to.equal(null);
    });
  });

  afterEach(function () {
    sinon.restore();
  });
});
