// tests/unit/controllers/passenger.controller.test.js

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const { passengerService } = require('../../../src/services');
const { passengerController } = require('../../../src/controllers');
const {
  passengerListMock,
  passengerMock,
  newPassengerMock,
  happyControllerResponseCreateTravelObject,
  happyReqCreateTravelObject,
  happyResponseCreateTravelObject,
} = require('./mocks/passenger.controller.mock');

describe('Teste de unidade do passengerController', function () {
  describe('Listando as pessoas passageiras', function () {
    it('Deve retornar o status 200 e a lista', async function () {
      // arrange
      const res = {};
      const req = {};
      
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon
        .stub(passengerService, 'findAll')
        .resolves({ type: null, message: passengerListMock });

      // act
      await passengerController.listPassengers(req, res);

      // assert
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(passengerListMock);
    });
  });

  describe('Buscando uma pessoa passageira', function () {
    it('deve responder com 200 e os dados do banco quando existir', async function () {
      // Arrange
      const res = {};
      const req = {
        params: { id: 1 },
      };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon
        .stub(passengerService, 'findById')
        .resolves({ type: null, message: newPassengerMock });

      // Act
      await passengerController.getPassenger(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(newPassengerMock);
    });
  
    it('ao passar um id inválido deve retornar um erro', async function () {
      // Arrange
      const res = {};
      const req = {
        params: { id: 'abc' }, // passamos aqui um id inválido para forçar o erro esperado
      };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      // Definimos o dublê do service retornando o contrato definido.
      sinon
        .stub(passengerService, 'findById')
        .resolves({ type: 'INVALID_VALUE', message: '"id" must be a number' });

      // Act
      await passengerController.getPassenger(req, res);

      // Assert
      // Avaliamos se chamou `res.status` com o valor 422
      expect(res.status).to.have.been.calledWith(422); 
      // Avaliamos se chamou `res.status` com a mensagem esperada
      expect(res.json).to.have.been.calledWith('"id" must be a number');
    });

    it('ao passar um id que não existe no banco deve retornar um erro', async function () {
      // Arrange
      const res = {};
      const req = {
        params: { id: 9999 }, // passamos aqui um id fictício para forçar o erro esperado
      };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      // Definimos o dublê do service retornando o contrato definido para esse cenário
      sinon
        .stub(passengerService, 'findById')
        .resolves({ type: 'PASSENGER_NOT_FOUND', message: 'Passenger not found' });

      // Act
      await passengerController.getPassenger(req, res);

      // Assert
      // Avaliamos se chamou `res.status` com o valor 404
      expect(res.status).to.have.been.calledWith(404); 
      // Avaliamos se chamou `res.status` com a mensagem esperada
      expect(res.json).to.have.been.calledWith('Passenger not found');
    });
  });

  describe('Cadastrando uma nova pessoa passageira', function () {
    it('ao enviar dados válidos deve salvar com sucesso!', async function () {
      // Arrange
      const res = {};
      // Aqui o mock do objeto req, atribui o objeto `passengerMock` ao atributo body
      const req = {
        body: passengerMock,
      };

      /* O dublê de `res.status` e `res.json` é o mesmo padrão que já fizemos anteriormente */
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      /* Definimos um dublê para `passengerService.createPassenger` para retornar o objeto
      de uma pessoa passageira com o id. */
      sinon
        .stub(passengerService, 'createPassenger')
        .resolves({ type: null, message: newPassengerMock });

      // Act
      await passengerController.createPassenger(req, res);

      // Assert
      /* Fazemos a asserção para garantir que o status retornado vai ser 201
      e que o json é o objeto newPassengerMock. */
      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(newPassengerMock);
    });

    it('ao enviar um nome com menos de 3 caracteres deve retornar um erro!', async function () {
      // Arrange
      const res = {};
      /* Aqui mudamos o dublê de req.body com um valor inválido para o campo name */
      const req = {
        body: {
          name: 'Zé',
        },
      };

      /* O dublê de `res.status` e `res.json` é o mesmo padrão que já fizemos anteriormente */
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      /* Definimos um dublê para `passengerService.createPassenger` para retornar o erro
      no contrato estabelecido na camada Service */
      sinon
        .stub(passengerService, 'createPassenger')
        .resolves({
          type: 'INVALID_VALUE',
          message: '"name" length must be at least 3 characters long' });

      // Act
      await passengerController.createPassenger(req, res);

      // Assert
      /* O status HTTP retornado deve ser 422 */
      expect(res.status).to.have.been.calledWith(422);
      /* Ajustamos a mensagem de erro esperada para ser a mensagem gerada pelo service */
      expect(res.json).to.have.been.calledWith('"name" length must be at least 3 characters long');
    });
  });

  describe('Criando uma nova viagem', function () {
    it('enviando dados válidos deve cadastrar a viagem', async function () {
      // Este é o objeto de resposta (res) inicialmente é um objeto vazio
      // que será preenchido pelo express
      const res = {};

      // Este é o objeto de requisição (req) que contém os dados necessários
      // para a requisição que ocorre sem nenhum problema
      const req = happyReqCreateTravelObject;

      // Criamos um stub para a função "res.status" que retorna o objeto res quando executada
      res.status = sinon.stub().returns(res);

      // Criamos um stub para a função "res.json" que não retorna nada
      res.json = sinon.stub().returns();

      // Criamos um stub para a chamada do service "passengerService.requestTravel" que irá
      // retornar uma resposta sem erros
      sinon
        .stub(passengerService, 'requestTravel')
        .resolves(happyControllerResponseCreateTravelObject);

      // Realizamos a chamada para o controller simulando o recebimento de uma requisição
      await passengerController.createTravel(req, res);

      // Validamos se o status code da resposta é igual a 201
      expect(res.status).to.have.been.calledWith(201);

      // Validamos se o json da resposta é igual ao do mock
      expect(res.json).to.have.been.calledWith(happyResponseCreateTravelObject);
    });
  });

  afterEach(function () {
    sinon.restore();
  });
});