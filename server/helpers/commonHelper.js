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
const getDefaultHeaders = (dataObject) => ({
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGQzYzI1ZDE4MDEyMTZjNTE3YTcxNSIsInVzZXJOYW1lIjoiQWxlbmVfRnJpZXNlbjE0IiwiaWF0IjoxNzE2MzM3NzAxLCJleHAiOjE3MTYzNDEzMDF9.m18XgVpl_0P9eE6IAHFmWyQsqH-EU8_PyrvVcCbRBpU'
});

module.exports = {
  log,
  responseSuccess,
  errorResponse,
  getDefaultHeaders
};
