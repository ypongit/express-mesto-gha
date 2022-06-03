const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = '1234567890';
// const User = require('../models/User');
const {
  AuthError, // 401
} = require('../errors/errors');

/* const generateToken = (payload) => {
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
}; */

// eslint-disable-next-line consistent-return
const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res
      .status(AuthError)
      .send({ message: 'Требуется авторизация!!!' });
  }

  const token = auth.replace('Bearer ', '');
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return res
      .status(AuthError)
      .send({ message: 'Требуется авторизация!' });
  }

  req.user = decoded;
  next();

  /* return User.findOne({ _id: decoded._id })
    .then((user) => {
      if (!user) {
        return res.status(NotFoundError).send({ message: 'Пользователь не найден!' });
      }
      // req.user = decoded;
      next();
    })
    .catch(() => res.status(DefaultError).send({ message: 'Server error.' })); */
};

module.exports = { isAuthorized/* ,  generateToken */ };
