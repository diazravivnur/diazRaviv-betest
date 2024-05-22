const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const CommonHelper = require('../helpers/commonHelper');
const authHelper = require('../helpers/authHelper');

dotenv.config();
const secretKey = process.env.SECRETKEY;
const expiresIn = process.env.EXPIRES_IN;

/* 
  PRIVATE FUNCTION
*/
const verifyTokenJwt = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

/* 
  PUBLIC FUNCTION
*/
exports.auth = async (request, res, next) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return CommonHelper.errorResponse(res, 401, 'Unauthorized', 'Invalid Authorization header');

    const token = authHeader.split(' ')[1];
    if (!token) return CommonHelper.errorResponse(res, 401, 'Unauthorized', 'Token is missing');

    const decoded = await verifyTokenJwt(token, secretKey);
    const user = await authHelper.getUserData(decoded.id);
    if (!user) return CommonHelper.errorResponse(res, 401, 'Unauthorized', 'User not found');

    request.header.userName = user.userName;
    request.headers.id = user._id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) return CommonHelper.errorResponse(res, 401, 'Unauthorized', 'Token expired');
    CommonHelper.log(['ERROR', 'Services', 'auth.js'], { message: `${error}` });
    return CommonHelper.errorResponse(res, 403, 'Forbidden', 'Token invalid');
  }
};

exports.generatePayloadToken = (data) => {
  const payloadToken = {
    id: data._id,
    userName: data.userName
  };
  return payloadToken;
};

exports.generateAuthToken = (data) => {
  return jwt.sign(data, secretKey, { expiresIn });
};
