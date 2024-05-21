const Router = require('express').Router();
const Boom = require('boom');

const CommonHelper = require('../helpers/commonHelper');
const ValidationHelper = require('../helpers/validationHelper');
const userService = require('../services/dbService');
const { auth, generateAuthToken, generatePayloadToken } = require('../middlewares/auth');
const { User } = require('../models/User');
const { isValidObjectId } = require('../helpers/mongoHelper');

/* 
  PRIVATE FUNCTION
*/
const validateMongoId = (res, _id) => {
  if (!isValidObjectId(_id)) {
    CommonHelper.errorResponse(res, 404, 'Invalid User Id');
    return false; // Return false to indicate invalid ID
  }
  return true; // Return true to indicate valid ID
};

/* 
  PUBLIC FUNCTION
*/
const createUser = async (req, res) => {
  const { error } = ValidationHelper.createUserValidation(req.body);
  if (error) return res.status(400).send(Boom.badRequest(error.details[0].message));

  try {
    const savedUser = await new User(req.body).save();
    const payloadToken = generatePayloadToken(savedUser);
    const response = generateAuthToken(payloadToken);
    return CommonHelper.responseSuccess(res, 201, 'Success', response);
  } catch (error) {
    console.log(['ERROR', 'createUser', 'users.js'], { message: `${error}` });
    return CommonHelper.errorResponse(res, error.status, error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return CommonHelper.responseSuccess(res, 200, 'Success', users);
  } catch (error) {
    CommonHelper.log(['ERROR', 'getAllUsers', 'users.js'], { message: `${error}` });
    return CommonHelper.errorResponse(res, error.status, error.message);
  }
};

const getUserById = async (req, res) => {
  const _id = req.headers.id;
  if (!validateMongoId(res, _id)) return;

  try {
    const user = await userService.findUserById(_id);
    if (!user) return CommonHelper.errorResponse(res, 404, 'Not Found');

    return CommonHelper.responseSuccess(res, 200, 'Success', user);
  } catch (error) {
    CommonHelper.log(['ERROR', 'getUserById', 'users.js'], {
      message: `${error}`
    });
    return CommonHelper.errorResponse(res, error.status, error.message);
  }
};

const delUserById = async (req, res) => {
  const { error } = ValidationHelper.getUserByIdValidation(req.query);
  if (error) return res.status(400).send(Boom.badRequest(error.details[0].message));
  const _id = req.query.id;

  if (!validateMongoId(res, _id)) return;

  try {
    const user = await User.findByIdAndDelete(_id);
    console.log(111, user);

    if (!user) return CommonHelper.errorResponse(res, 404, 'Not Found');

    return CommonHelper.responseSuccess(res, 200, 'Del Success', user);
  } catch (error) {
    console.log(['ERROR', 'getUserById', 'users.js'], {
      message: `${error}`
    });
    return CommonHelper.errorResponse(res, error.status, error.message);
  }
};

const updateUserById = async (req, res) => {
  const { error } = ValidationHelper.updateUserValidation(req.body);
  if (error) return res.status(400).send(Boom.badRequest(error.details[0].message));
  const _id = req.body.userId;
  try {
    const user = await User.findByIdAndUpdate(_id, {
      ...req.body
    });

    return CommonHelper.responseSuccess(res, 201, 'Success', user);
  } catch (error) {
    CommonHelper.log(['ERROR', 'createUser', 'users.js'], {
      message: `${error}`
    });
    return CommonHelper.errorResponse(res, error.status, error.message);
  }
};

Router.post('/user', createUser);
Router.get('/users', getAllUsers);
Router.get('/user', auth, getUserById);
Router.delete('/user', delUserById);
Router.patch('/user', updateUserById);

module.exports = Router;
