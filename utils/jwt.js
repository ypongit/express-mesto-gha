// const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = '1234567890';
const User = require('../models/User');
const {
  NotFoundError, // 404
  DefaultError, // 500
  AuthError, // 401
} = require('../errors/errors');

// eslint-disable-next-line arrow-body-style
const generateToken = (payload) => {
  // eslint-disable-next-line no-undef
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '7d' });
};

// eslint-disable-next-line no-unused-vars
const verifyToken = (token) => {
  let decoded;
  try {
    // eslint-disable-next-line no-undef
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    // eslint-disable-next-line prefer-promise-reject-errors
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
    // eslint-disable-next-line no-undef
    decoded = jwt.verify(auth, JWT_SECRET_KEY);
  } catch (err) {
    return res.status(AuthError).send({ message: 'Требуется авторизация!' });
  }
  console.log('decoded ', decoded);
  return User.findOne({ _id: decoded._id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(NotFoundError).send({ message: 'Пользователь не найден!' });
      }

      next();
    })
    // eslint-disable-next-line arrow-body-style
    .catch(() => {
      return res.status(DefaultError).send({ message: 'Server error.' });
    });
};

module.exports = { generateToken, isAuthorized };
