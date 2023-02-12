const { expect } = require('chai');
const sinon = require('sinon');
const driverService = require('../../../src/services/driver.service');
const { driverModel, travelModel } = require('../../../src/models');
const {
  // DRIVER_ON_THE_WAY,
  correctReturnTravel,
  correctReturnDriver,
  // correctAssignTravel,
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

  // describe('Atribuições de viagem com motorista ocupado', function () {
  //   it('esta falahando ao tentar iniciar uma viagem com motorista ocupado', async function () {});
  // });

  describe('Atribuições de viagem com sucesso', function () {
    it('estão atribuindo com sucesso', async function () {
      sinon.stub(driverModel, 'findById').resolves(correctReturnDriver);
      sinon.stub(travelModel, 'findById').resolves(correctReturnTravel);
      sinon.stub(travelModel, 'updateById').resolves(true);

      const travel = await driverService.travelAssign({ travelId: 1, driverId: 1 });

      expect(travel).to.deep.equal(correctReturnTravel);
    });
  });

  afterEach(function () {
    sinon.restore();
  });
});
