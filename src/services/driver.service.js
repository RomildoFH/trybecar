const { travelModel, driverModel, carModel, driverCarModel } = require('../models');
const {
  validateTravelAssignSchema,
  validadeAlreadyAssingn,
  validateNewDriver,
} = require('./validations/validationsInputValues');

const WAITING_DRIVER = 1;
const DRIVER_ON_THE_WAY = 2;
const TRAVEL_IN_PROGRESS = 3;
const TRAVEL_FINISHED = 4;

const getWaitingDriverTravels = async () => {
  const travels = await travelModel.findByTravelStatusId(WAITING_DRIVER);
  return { type: null, message: travels };
};

const travelAssign = async ({ travelId, driverId }) => {  
  const error = await validateTravelAssignSchema({ travelId, driverId }); // Valida se existem os IDs
  if (error.type) return error;
  const hasDriver = await validadeAlreadyAssingn(travelId); // Verifica se a corrida já possúi motorista designado
  if (hasDriver.type) return hasDriver;
  
  await travelModel.updateById(travelId, { // Atualiza caso existam
    driverId,
    travelStatusId: DRIVER_ON_THE_WAY,
  });

  const travel = await travelModel.findById(travelId);
  return travel;
};

const startTravel = async ({ travelId, driverId }) => {
  const error = await validateTravelAssignSchema({ travelId, driverId }); // Valida se existem os IDs
  if (error.type) return error;
  await travelModel.updateById(travelId, {
    driverId,
    travelStatusId: TRAVEL_IN_PROGRESS,
  });
  const travel = await travelModel.findById(travelId);
  return travel;
};

const endTravel = async ({ travelId, driverId }) => {
  await travelModel.updateById(travelId, {
    driverId,
    travelStatusId: TRAVEL_FINISHED,
  });
  const travel = await travelModel.findById(travelId);
  return travel;
};

const getDrivers = async () => {
  const [drivers] = await driverModel.findAll();
  if (!drivers) return ({ type: 'DRIVERS_NOT_FOUND', message: 'could not find drivers' });

  return ({ type: null, message: drivers });
};

const createDriver = async (name, carIds) => {
  // Validando dados recebidos
  const error = await validateNewDriver(name, carIds);
  if (error.type) return error;

  // Cadastrando pessoa motorista
  const driverId = await driverModel.insert({ name });
  
  // Pegando a pessoa motorista cadastrada na DB
  const newDriver = await driverModel.findById(driverId);
 
  // Se houver a lista de ids de carros, criamos os relacionamentos
  // e adicionamos a lista ao resultado final,
  // senão usamos um array vazio no lugar
  if (carIds && carIds.length > 0) {
    await Promise.all(carIds.map(
      // Usando a camada Model para vincular os carros à pessoa motorista
      async (carId) => driverCarModel.insert({ driverId: newDriver.id, carId }),
    ));
    // Adicionamos os carros ao resultado final
    newDriver.cars = await Promise.all(
      carIds.map(async (carId) => carModel.findById(carId)),
    );
  } else {
    newDriver.cars = [];
  }
  
  // Retornando os dados da pessoa motorista
  return { type: null, message: newDriver };
};

module.exports = {
  getWaitingDriverTravels,
  travelAssign,
  startTravel,
  endTravel,
  getDrivers,
  createDriver,
};