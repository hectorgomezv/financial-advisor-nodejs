const { StatusCodes } = require('http-status-codes');

const { createPosition, deletePosition } = require('../../../domain/use-cases');
const { mapError } = require('../../../../shared/adapters/http/error-mapper');

const createPositionCtl = async (req, res) => {
  try {
    const position = await createPosition(req.body);
    res.code(StatusCodes.CREATED).send(position);
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

const deletePositionCtl = async (req, res) => {
  try {
    const { uuid } = req.params;
    await deletePosition(uuid);
    res.code(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

module.exports = {
  createPositionCtl,
  deletePositionCtl,
};
