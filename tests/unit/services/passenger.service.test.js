const { expect } = require('chai');
const sinon = require('sinon');
const { passengerService } = require('../../../src/services');
const { passengerModel, travelModel, waypointModel } = require('../../../src/models');

const {
  allPassengers,
  invalidValue,
  validName,
  validEmail,
  validPhone,
  travelResponse,
} = require('./mocks/passenger.service.mock');

describe('Verificando service pessoa passageira', function () {
  describe('listagem de pessoas passageiras', function () {
    it('retorna a lista completa de pessoas passageiras', async function () {
      // arrange
      sinon.stub(passengerModel, 'findAll').resolves(allPassengers);
      
      // act
      const result = await passengerService.findAll();

      // assert
      expect(result.type).to.be.equal(null);
      expect(result.message).to.deep.equal(allPassengers);
    });
  });

  describe('busca de uma pessoa passageira', function () {
    it('retorna um erro caso receba um ID inválido', async function () {
      // arrange: Especificamente nesse it não temos um arranjo pois nesse fluxo o model não é chamado!

      // act
      const result = await passengerService.findById('a');
      
      // assert
      expect(result.type).to.equal('INVALID_VALUE');
      expect(result.message).to.equal('"id" must be a number');
    });

    it('retorna um erro caso a pessoa passageira não existe', async function () {
      // arrange
      sinon.stub(passengerModel, 'findById').resolves(undefined);
     
      // act
      const result = await passengerService.findById(1);
      
      // assert
      expect(result.type).to.equal('PASSENGER_NOT_FOUND');
      expect(result.message).to.equal('Passenger not found');
    });
    
    it('retorna a pessoa passageira caso ID existente', async function () {
      // arrange
      sinon.stub(passengerModel, 'findById').resolves(allPassengers[0]);
      
      // act
      const result = await passengerService.findById(1);

      // assert
      expect(result.type).to.equal(null);
      expect(result.message).to.deep.equal(allPassengers[0]);
    });
  });

  describe('cadastro de uma pessoa passageira com valores inválidos', function () {
    it('retorna um erro ao passar um nome inválido', async function () {
      // arrange: Novamente não precisamos de um arranjo pois esse é um fluxo que não chama o model!

      // act
      const result = await passengerService.createPassenger(invalidValue, validEmail, validPhone);

      // assert
      expect(result.type).to.equal('INVALID_VALUE');
      expect(result.message).to.equal('"name" length must be at least 3 characters long');
    });

    it('retorna um erro ao passar um email inválido', async function () {
      // arrange: Novamente não precisamos de um arranjo pois esse é um fluxo que não chama o model! [2]

      // act
      const result = await passengerService.createPassenger(validName, invalidValue, validPhone);

      // assert
      expect(result.type).to.equal('INVALID_VALUE');
      expect(result.message).to.equal('"email" must be a valid email');
    });

    it('retorna um erro ao passar um telefone inválido', async function () {
      // arrange: Novamente não precisamos de um arranjo pois esse é um fluxo que não chama o model! [3]

      // act
      const result = await passengerService.createPassenger(validName, validEmail, invalidValue);

      // assert
      expect(result.type).to.equal('INVALID_VALUE');
      expect(result.message).to.equal('"phone" length must be at least 9 characters long');
    });
  });

  describe('cadastro de uma pessoa passageira com valores válidos', function () {
    it('retorna o ID da pessoa passageira cadastrada', async function () {
      // arrange
      sinon.stub(passengerModel, 'insert').resolves(1);
      sinon.stub(passengerModel, 'findById').resolves(allPassengers[0]);
      
      // act
      const result = await passengerService.createPassenger(validName, validEmail, validPhone);

      // assert
      expect(result.type).to.equal(null);
      expect(result.message).to.deep.equal(allPassengers[0]);
    });
  });

  describe('solicitação de viagem', function () {
    it('sem pontos de parada é realizada com sucesso', async function () {
        // arrange
        /* retorna verdadeiro sinalizando que o passageiro existe */
        sinon.stub(passengerModel, 'findById').resolves(true); 
        /* retorna travel com ID 1 */
        sinon.stub(travelModel, 'insert').resolves(1); 
        /* retorna a viagem "mockada" */
        sinon.stub(travelModel, 'findById').resolves(travelResponse);
        const WAITING_DRIVER = 1;
        const passenger = {
            id: 1,
            startingAddress: 'Rua X',
            endingAddress: 'Rua Y',
        };
        // act
        const travel = await passengerService.requestTravel(
            passenger.id,
            passenger.startingAddress,
            passenger.endingAddress,
        );
        // assert
        expect(travel.message).to.deep.equal({
            id: 1,
            passengerId: 1,
            driverId: null,
            travelStatusId: WAITING_DRIVER,
            startingAddress: 'Rua X',
            endingAddress: 'Rua Y',
            requestDate: '2022-08-24T03:04:04.374Z',
        });
    });

    it('com pontos de parada é realizada com sucesso', async function () {
        // arrange
        /* retorna verdadeiro sinalizando que o passageiro existe */
        sinon.stub(passengerModel, 'findById').resolves(true); 
        /* retorna travel com ID 1 */
        sinon.stub(travelModel, 'insert').resolves(1); 
        /* retorna a viagem "mockada" */
        sinon.stub(travelModel, 'findById').resolves(travelResponse);
        /* retorna waypoint com ID 1 */
        sinon.stub(waypointModel, 'insert').resolves(1); 
        const WAITING_DRIVER = 1;
        const passenger = {
            id: 1,
            startingAddress: 'Rua X',
            endingAddress: 'Rua Y',
            waypoints: [{
                address: 'Rua Z',
                stopOrder: 1,
            }],
        };

        // act
        const travel = await passengerService.requestTravel(
            passenger.id,
            passenger.startingAddress,
            passenger.endingAddress,
            passenger.waypoints,
        );

        // assert
        expect(travel.message).to.deep.equal({
            id: 1,
            passengerId: 1,
            driverId: null,
            travelStatusId: WAITING_DRIVER,
            startingAddress: 'Rua X',
            endingAddress: 'Rua Y',
            requestDate: '2022-08-24T03:04:04.374Z',
        });
    });

    it('com mesmo local de origem e destino é rejeitada', async function () {
        // arrange
        /* Aqui foi criado um mock de uma viagem inválida */
        const passenger = {
            id: 1,
            startingAddress: 'Rua X',
            endingAddress: 'Rua X',
        };

        // act
        const error = await passengerService.requestTravel(
            passenger.id,
            passenger.startingAddress,
            passenger.endingAddress,
        );

        // assert
        expect(error.type).to.equal('INVALID_VALUE');
        expect(error.message).to.equal('"endingAddress" contains an invalid value');
    });
  });
  
   afterEach(function () {
     sinon.restore();
   });
 });