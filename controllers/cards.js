const Card = require('../models/Card');
/* const ValidationError = 400; // переданы некорректные данные в методы создания карточки,
// пользователя, обновления аватара пользователя или профиля;
const NotFoundError = 404; // карточка или пользователь не найден.
const DefaultError = 500; // ошибка по-умолчанию. */

const {
  ValidationError,
  NotFoundError,
  DefaultError,
} = require('../errors/errors');

const getCards = (_, res) => {
  console.log('Errors:', DefaultError);
  Card.find({})
    .then(cards => {
      res.status(200).send({ cards });
    })
    .catch(() => {
      res.status(500).send({ message: 'Server error' });
    });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(ValidationError).send({ message: 'переданы некорректные данные в методы создания карточки' });
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
  Card.findByIdAndUpdate(
    req.params.cardId,
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
      console.log("likeCard -> ", err)
      if (err.kind == 'ObjectId') {
        return res.status(ValidationError).send({ message: 'Некореектные данные для установки лайка' });
      }
      return res.status(DefaultError).send({ message: 'Server error' });
    });
};

const dislikeCard = (req, res) => {
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
      return res.status(DefaultError).send({ message: 'Server error' });
    });
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
