const path = require('path');
const fs = require('fs').promises;
// const users = require('../data.json');
const User = require('../models/User');
const ValidationError = 400;
const NotFoundError = 404;
const DefaultError = 500;

const getUser = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(NotFoundError).send({ message: 'пользователь не найден' });
      }

      // console.log('res.status ->', res.status)
      res.status(200).send(user);
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(ValidationError).send({ message: 'переданы некорректные данные в методы создания пользователя!' });
      }
    /* .catch(err => {
      console.log('findById err -> ', err)
      if (err.kind === 'ObjectID') {
        return res.status(ValidationError).send({ message: 'Неправильный Id пользователя' });
      }
 */
      res.status(DefaultError).send({ message: 'Server error' });
    });
  // console.log("typeof id ->", typeof id);
  // console.log("typeof users[0].id -> ", typeof users[0].id);
  /* const user = users.find(user => user.id === Number(id));
  if (!user) {
    return res.status(404).send({ message: "User not found!" });
  }
  res.status(200).send(user); */
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // console.log({age, name});
  if (!name || !about || !avatar) {
    return res.status(ValidationError).send({ message: 'переданы некорректные данные в методы создания пользователя' });
  }

  User.create({ name, about, avatar })
    .then(user => {
      res.status(201).send(user);
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(ValidationError).send({ message: 'переданы некорректные данные в методы создания пользователя!' });
      }
      res.status(500).send({ message: 'Server error' });
      // console.log('err', err);
    });
};

const getUsers = (_, res) => {
  User.find({})
    .then(users => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(DefaultError).send({ message: 'Server error' });
    });
  // res.status(200).send(users);
};

const profileUpdate = (req, res) => {
  req.user = {
    _id: '6284e5caf459e18331bf63ad',
  };
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about}, {
    new: true, // обработчик then получит на вход обновлённую запись
  })
    .then(user => res.status(200). send({ data: user }))
    .catch(err => res.status(DefaultError).send({ message: 'Server error' }));
};

const avatarUpdate = (req, res) => {
  req.user = {
    _id: '6284e5caf459e18331bf63ad',
  };
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar}, {
    new: true, // обработчик then получит на вход обновлённую запись
  })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(DefaultError).send({ message: 'Server error' }));
};

module.exports = {
  getUser,
  createUser,
  getUsers,
  profileUpdate,
  avatarUpdate,
};
