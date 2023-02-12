const { travelModel } = require('../models');
const {
  validateTravelAssignSchema,
  validadeAlreadyAssingn,
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

module.exports = {
  getWaitingDriverTravels,
  travelAssign,
  startTravel,
  endTravel,
};