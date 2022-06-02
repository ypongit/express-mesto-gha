const bcrypt = require('bcrypt');
const { use } = require('bcrypt/promises');
const User = require('../models/User');
const { generateToken } = require('../middlewares/auth');
const jwt = require('jsonwebtoken');

const MONGO_DUPLICATE_KEY_CODE = 11000;
const saltRound = 10;

const JWT_SECRET_KEY = '1234567890';
const {
  ValidationError, // 400
  NotFoundError, // 404
  DefaultError, // 500
} = require('../errors/errors');
//  const req = require('express/lib/request');

const getUser = (req, res) => {
  // const auth = req.headers.authorization;
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      // console.log('user: ', user);
      if (!user) {
        return res.status(NotFoundError).send({ message: 'пользователь не найден' });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      res.status(DefaultError).send(err);
    });
};

// eslint-disable-next-line consistent-return
// централизованная обработка ошибок через next
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    const err = new Error('Не передан емейл или пароль');
    err.statusCode = NotFoundError;
    next(err);
    return;
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
        .then(() => {
          res.status(200).send({ message: 'Пользователь создан.' });
        })
        .catch((err) => {
          // console.log('DuplicateError ->', err);
          if (err.code === MONGO_DUPLICATE_KEY_CODE) {
            const DuplicateError = new Error('Такой емейл занят!');
            DuplicateError.statusCode = 409;
            return next(DuplicateError);
            // return res.status(DuplicateError).send({ message: 'Такой емейл занят!' });
          }
          next(err);
          // return res.status(DefaultError).send({ message: 'Server error' });
        });
    });
};


const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });

      res.send({ token });
    })
  /* User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта и пароль'));
      }
      // аутентификация успешна
      res.send({ message: 'Все верно!' });
    }) */
    .catch(() => {
      next(new Error('Неправильные почта или пароль'));
    });
};

/* const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      // console.log(user);

      if (!user) {
        // пользователь с такой почтой не найден
        throw new Error('not_found');
        // return res.status(ValidationError).send({ message: 'Email или пароль неверный' });
      }
      // пользователь найден
      // сравниваем переданный пароль и хеш из базы
       return {
        isPasswordValid: bcrypt.compare(password, user.password),
        user,
      };
    })

    .then(({ isPasswordValid, user }) => {
      if (!isPasswordValid) {
        return res.status(ValidationError)
          .send({ message: 'Email или пароль не верные!' });
      }
      // console.log('user', user);
      return generateToken({ _id: user._id });
      // return jwt.sign({ _id: user._id }, JWT_SECRET_KEY);
    })
    // eslint-disable-next-line arrow-body-style
    .then((token) => {
      // console.log('token ->', token);
      return res.status(200).send({ token });
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === 'not_found') {
        return res.status(ValidationError).send({ message: 'Email или пароль не верны!' });
      }

      return res.status(DefaultError).send({ message: 'Server error' });
    });

}; */

const getUsers = (req, res) => {
  console.log('req.user', req.user);
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(DefaultError).send({ message: 'Server error' });
    });
};

const profileUpdate = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(NotFoundError).send({ message: 'пользователь не найден' });
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ValidationError).send({ message: 'переданы некорректные данные в методы обновления пользователя' });
      }
      return res.status(DefaultError).send({ message: 'Server error' });
    });
};

// контроллер для получения информации о пользователе. Роут: get('/me', getProfile);
const getProfile = (req, res) => {
  console.log('_id: req.user-> ', { _id: req.user });

  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        return res.status(NotFoundError)
          .send({ message: 'Пользователь с данным _id не найден!' });
      }
      res.status(200).send(user);
    })
    .catch((err) => res.status(DefaultError).send(err));
};

// eslint-disable-next-line consistent-return
const avatarUpdate = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(ValidationError).send({ message: 'некорректные данные!' });
  }

  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.log(err);
      return res.status(DefaultError).send({ message: 'Server error' });
    });
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
