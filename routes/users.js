const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  // getUser,
  // createUser,
  getUsers,
  profileUpdate,
  avatarUpdate,
  getProfile,
} = require('../controllers/users');
/* const User = require('../models/User');
const { isAuthorized } = require('../middlewares/auth'); */

// router.get('/:id', /* isAuthorized,  */getUser);

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

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), avatarUpdate);

module.exports.userRouter = router;
