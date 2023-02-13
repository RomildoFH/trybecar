const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiHttp);

// Aqui estamos importando o nosso aap.js
const app = require('../../../src/app');

// Aqui estamos importando o nosso connection pois iremos
// mockar as respostas do banco de dados
const connection = require('../../../src/models/connection');

// Os dados de mock que serão utilizados para realizar os mocks do bano de dados e da resposta
const {
  happyTravelDB,
  happyPassengerDB,
  happyTravelResponse,
} = require('./mocks/passenger.controller.mock');

describe('Teste de integração de passengers', function () {
  it('Criação de uma nova viagem com sucesso', async function () {
    // Aqui estamos realizando o mock do banco de dados. Durante o fluxo de
    // criação de uma viagem, a função 'connection.execute' será executada três vezes.
    // Assim precisamos definir qual será a resposta do mock para cada uma das chamadas
    // da função 'connection.execute'.
    sinon
      .stub(connection, 'execute')
      .onFirstCall()
      .resolves([[happyPassengerDB]])
      .onSecondCall()
      .resolves([{ insertId: 42 }])
      .onThirdCall()
      .resolves([[happyTravelDB]]);

    // Realizamos uma requisição HTTP através do chai-http para o endpoint de criação
    // de uma viagem passando uma versão JSON mínima esperada no corpo da requisição.
    const response = await chai
      .request(app)
      .post('/passengers/1/request/travel')
      .send({
        startingAddress: 'Rua AAAA',
        endingAddress: 'Rua BBB',
      });

    // Verificamos se a resposta contém o status code igual a 201
    expect(response.status).to.be.equal(201);

    // Verificamos se o corpo da resposta contém o JSON esperado
    expect(response.body).to.be.deep.equal(happyTravelResponse);
  });
  
  afterEach(function () {
    sinon.restore();
  });
});
