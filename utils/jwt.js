const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = '1234567890';
const User = require('../models/User');
const {
  ValidationError, // 400
  NotFoundError, // 404
  DefaultError, // 500
  DuplicateError, // 409
  AuthError, // 401
} = require('../errors/errors');

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY , { expiresIn: '7d' });
};

const verifyToken = (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return Promise.reject({ message: 'token invalid' });
  }
  console.log('decoded ', decoded);
  return User.findOne({ _id: decoded._id })
    .then((user) => {
      if (user) {
        return true;
      }

      throw new Error('user not found');
    });
};

const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(AuthError).send({ message: 'Требуется авторизация!' });
  }
  let decoded;
  try {
    decoded = jwt.verify(auth, JWT_SECRET_KEY);
  } catch (err) {
    return res.status(AuthError).send({ message: 'Требуется авторизация!' });
  }
  console.log('decoded ', decoded);
  return User.findOne({ _id: decoded._id })
    .then((user) => {
      if (!user) {
        return res.status(NotFoundError).send({ message: 'Пользователь не найден!' });
      }

      next();
    })
    .catch(() => {
      return res.status(DefaultError).send({ message: 'Server error.' });
    });
};

module.exports = { generateToken, isAuthorized };
