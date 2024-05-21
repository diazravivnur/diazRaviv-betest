const Joi = require('joi');

const createUserValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    emailAddress: Joi.string().required(),
    accountNumber: Joi.string().required(),
    identityNumber: Joi.number().required()
  });
  return schema.validate(data);
};

const updateUserValidation = (data) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    userName: Joi.string().optional(),
    emailAddress: Joi.string().optional(),
    accountNumber: Joi.string().optional(),
    identityNumber: Joi.number().optional()
  });
  return schema.validate(data);
};

const getUserByIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().required()
  });
  return schema.validate(data);
};

module.exports = { createUserValidation, getUserByIdValidation, updateUserValidation };
