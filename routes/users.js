const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { validateURL } = require('../middlewares/url_validator');

const {
  getUserById,
  // createUser,
  getUsers,
  profileUpdate,
  avatarUpdate,
  getProfile,
} = require('../controllers/users');
/* const User = require('../models/User');
const { isAuthorized } = require('../middlewares/auth'); */

// router.post('', createUser);

router.get('/', getUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), profileUpdate);

// роут для получения информации о пользователе
router.get('/me', getProfile);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  // pattern(/^https?:\/\/(w{3}\.)?[\w]*\.ru\/[-._~:/?#[]@!$&'()*\+,;=]*#?$/)
  }),
}), avatarUpdate);

module.exports.userRouter = router;
