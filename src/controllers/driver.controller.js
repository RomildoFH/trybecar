const { driverService } = require('../services');
const errorMap = require('../utils/errorMap');

const openTravel = async (_req, res) => {
  const { type, message } = await driverService.getWaitingDriverTravels();

  // Linha de código responsável por gerar uma resposta em caso de erro no
  // processamento do componente de software da camada `Service`
  if (type) return res.status(errorMap.mapError(type)).json(message);

  return res.status(200).json(message);
};

const travelAssign = async (req, res) => {
  const { travelId, driverId } = req.params;
  const { type, message } = await driverService.travelAssign({
    travelId,
    driverId,
  });
  if (type) return res.status(errorMap.mapError(type)).json(message);
  return res.status(200).json(message);
};

const startTravel = async (req, res) => {
  const { travelId, driverId } = req.params;
  const { type, message } = await driverService.startTravel({
    travelId,
    driverId,
  });
  if (type) return res.status(errorMap.mapError(type)).json(message);
  return res.status(200).json(message);
};

const endTravel = async (req, res) => {
  const { travelId, driverId } = req.params;
  const { type, message } = await driverService.endTravel({
    travelId,
    driverId,
  });
  if (type) return res.status(errorMap.mapError(type)).json(message);
  return res.status(200).json(message);
};

module.exports = {
  openTravel,
  travelAssign,
  startTravel,
  endTravel,
};