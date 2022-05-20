const router = require('express').Router();
const {
  getUser,
  createUser,
  getUsers,
  profileUpdate,
  avatarUpdate,
} = require('../controllers/users');

router.get('/:id', getUser);

router.post('', createUser);

router.get('/', getUsers);

router.patch('/me', profileUpdate);

router.patch('/me/avatar', avatarUpdate);

module.exports.userRouter = router;
