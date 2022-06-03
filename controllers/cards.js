const Card = require('../models/Card');
/* const ValidationError = 400; // переданы некорректные данные в методы создания карточки,
// пользователя, обновления аватара пользователя или профиля;
const NotFoundError = 404; // карточка или пользователь не найден.
const DefaultError = 500; // ошибка по-умолчанию. */
const NotFoundError = require('../errors/not-found-err');
const DuplicateError = require('../errors/duplicate-err');
const ValidationError = require('../errors/validation-err');
const ForbiddenError = require('../errors/forbidden-err');
/* const {
  ValidationError,
  NotFoundError,
  DefaultError,
  Forbidden,
} = require('../errors/errors'); */

const getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200)
        .send({ cards });
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  /* if (!name || !link) {
    return res.status(ValidationError).send({ message: 'переданы некорректные данные в методы создания карточки' });
  } */
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные в методы создания карточки');
        // return res.status(ValidationError).send({ message: 'переданы некорректные данные в методы создания карточки' });
      }
    })
    .catch(next);
};

const removeCard = (req, res, next) => {
  // console.log('removeCard req.params -> ', req.params);
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('карточка не найдена');
        // return res.status(NotFoundError).send({ message: 'карточка не найдена' });
      }
      if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('Чужую карточку удалить низя!');
      }
      return res.send({ data: card });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFoundError('карточка с указанным id не найдена');
        // return res.status(NotFoundError).send({ message: 'карточка не найдена' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new ValidationError('Переданы некорректные данные в методы установки лайка');
        // return res.status(ValidationError).send({ message: 'Некореектные данные для установки лайка' });
      }
      next(err);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFoundError('карточка с указанным id не найдена');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные в методы отмены лайка');
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
