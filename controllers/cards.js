const path = require('path');
const fs = require('fs').promises;
const Card = require('../models/Card');
const ValidationError = 400; // переданы некорректные данные в методы создания карточки,
// пользователя, обновления аватара пользователя или профиля;
const NotFoundError = 404; // карточка или пользователь не найден.
const DefaultError = 500; // ошибка по-умолчанию.

const getCards = (_, res) => {
  Card.find({})
    .then(cards => {
      res.status(200).send({ cards });
    })
    .catch(() => {
      res.status(500).send({ message: 'Server error' });
    });
};

const createCard = (req, res) => {
  req.user = {
    _id: '6284e5caf459e18331bf63ad', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  const owner = req.user._id;
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(400).send({ message: 'переданы некорректные данные в методы создания карточки' });
  }

  Card.create({ name, link, owner })
    .then(card => {
      res.status(201).send(card);
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(ValidationError).send({ message: 'переданы некорректные данные в методы создания карточки' });
      }
      return res.status(DefaultError).send({ message: 'Server error' });
      // console.log('err ->', err);
    });
};

const removeCard = (req, res) => {
  // console.log('removeCard req.params -> ', req.params);
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      if (!card) {
        return res.status(NotFoundError).send({ message: 'карточка не найдена' });
      }

      return res.send({ data: card });
    })
    .catch ((err) => {
      if (err.name === 'CastError') {
        return res.status(ValidationError).send({ message: 'передан некорректный id в метод удаления карточки!' });
      }

      return res.status(DefaultError).send({ message: 'Server error' });
    });
};

const likeCard = (req, res) => {
  req.user = {
    _id: '6284e5caf459e18331bf63ad',
  };
  // console.log('req.params', req.params);
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => {
      if (!card) {
        return res.status(NotFoundError).send({ message: 'карточка не найдена' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ValidationError).send({ message: 'передан некорректный id в метод лайка карточки!' });
      }
    });
  return res.status(DefaultError).send({ message: 'Server error' });
};

const dislikeCard = (req, res) => {
  req.user = {
    _id: '6284e5caf459e18331bf63ad',
  };
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => {
      if (!card) {
        return res.status(NotFoundError).send({ message: 'карточка не найдена' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ValidationError).send({ message: 'передан некорректный id в метод дизлайка карточки!' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
