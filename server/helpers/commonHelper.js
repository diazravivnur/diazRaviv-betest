const Pino = require('pino');
const logger = Pino();

const log = (tags, data) => {
  const logs = { tags };
  if (data) {
    Object.assign(logs, { data });
  }

  logger.info(logs);
};

const responseSuccess = (res, status, statusMessage, data) => {
  return res.status(status).json({ status: statusMessage, data });
};

const errorResponse = (res, status = 500, statusMessage = 'Internal Server Error', message = 'Something Went Wrong') => {
  return res.status(status).json({ status, message, statusMessage });
};

module.exports = {
  log,
  responseSuccess,
  errorResponse
};
