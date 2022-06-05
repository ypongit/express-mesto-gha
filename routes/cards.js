const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { validateURL } = require('../middlewares/url_validator');

const {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('', getCards);

router.post('', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().custom(validateURL),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), removeCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

module.exports.cardsRouter = router;
