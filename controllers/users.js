const User = require('../models/User');

/* const ValidationError = 400;
const NotFoundError = 404;
const DefaultError = 500; */
const {
  ValidationError,
  NotFoundError,
  DefaultError,
} = require('../errors/errors');

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(NotFoundError).send({ message: 'пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ValidationError).send({ message: 'передан некорректный id в метод поиска пользователя!' });
      }
      return res.status(DefaultError).send({ message: 'Server error' });
    });
};

// eslint-disable-next-line consistent-return
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(ValidationError).send({ message: 'переданы некорректные данные в методы создания пользователя' });
  }

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ValidationError).send({ message: 'переданы некорректные данные в методы создания пользователя!' });
      }
      return res.status(DefaultError).send({ message: 'Server error' });
    });
};

const getUsers = (_, res) => {
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
};
