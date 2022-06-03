const bcrypt = require('bcrypt');
// const { use } = require('bcrypt/promises');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const { generateToken } = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const DuplicateError = require('../errors/duplicate-err');
const ValidationError = require('../errors/validation-err');

const MONGO_DUPLICATE_KEY_CODE = 11000;
const saltRound = 10;

const JWT_SECRET_KEY = '1234567890';
//  const req = require('express/lib/request');

const getUser = (req, res, next) => {
  // const auth = req.headers.authorization;
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      // console.log('user: ', user);
      if (!user) {
        throw new NotFoundError('Пользователь с данным _id не найден!');
        // return res.status(NotFoundError).send({ message: 'пользователь не найден' });
      }

      return res.status(200).send(user);
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
// централизованная обработка ошибок через next
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new NotFoundError('Не передан емейл или пароль!');
    /* return res.status(ValidationError)
      .send({ message: 'Не передан емейл или пароль.' }); */
  }

  bcrypt.hash(password, saltRound)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          // console.log(user);
          res.status(201).send({
            "name": user.name,
            "about": user.about,
            "avatar": user.avatar,
            "email": user.email,
          });
        })

        .catch((err) => {
          // console.log('DuplicateError ->', err);
          if (err.name === 'ValidationError') {
            throw new ValidationError('Переданы некорректные данные в методы создания пользователя');
          }
          if (err.name === 'MongoError' && err.code === MONGO_DUPLICATE_KEY_CODE) {
            throw new DuplicateError('Пользователь с таким email уже существует!');
            // return res.status(DuplicateError).send({ message: 'Такой емейл занят!' });
          }
          // next(err);
          // return res.status(DefaultError).send({ message: 'Server error' });
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });

      res.status(200).send({ token });
    })
    .catch(() => {
      next(new Error('Неправильные почта или пароль'));
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const profileUpdate = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFoundError('пользователь не найден');
        // return res.status(NotFoundError).send({ message: 'пользователь не найден' });
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('переданы некорректные данные в методы обновления пользователя');
        // return res.status(ValidationError)
        // .send({ message: 'переданы некорректные данные в методы обновления пользователя' });
      }
      // return res.status(DefaultError).send({ message: 'Server error' });
    })
    .catch(next);
};

// контроллер для получения информации о пользователе. Роут: get('/me', getProfile);
const getProfile = (req, res, next) => {
  // console.log('_id: req.user-> ', { _id: req.user });

  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с данным _id не найден!');
        /* return res.status(NotFoundError)
          .send({ message: 'Пользователь с данным _id не найден!' }); */
      }
      res.status(200).send(user);
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
const avatarUpdate = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с данным _id не найден!');
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('переданы некорректные данные в методы обновления аватара');
      // return res.status(DefaultError).send({ message: 'Server error' });
      }
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  getUsers,
  profileUpdate,
  avatarUpdate,
  login,
  getProfile,
};
