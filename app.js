/* eslint-disable consistent-return */
const express = require('express');
const mongoose = require('mongoose');
// const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-err');
const { validateURL } = require('./middlewares/url_validator');
const { userRouter } = require('./routes/users');
const { cardsRouter } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
const { isAuthorized } = require('./middlewares/auth');

/* app.use((req, _, next) => {
  req.user = {
    // вставьте сюда _id созданного в предыдущем пункте пользователя
    _id: '6291f02272c8bf27a4122b52',
  };

  next();
}); */

app.use(express.json());

app.use('/cards', isAuthorized, cardsRouter);

app.use('/users', isAuthorized, userRouter);
// авторизация
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
// добавление пользователя
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    avatar: Joi.string().custom(validateURL),
    // .pattern(/^https?:\/\/(w{3}\.)?[\w]*\.ru\/[-._~:/?#[]@!$&'()*\+,;=]*#?$/),
  }),
}), createUser);
// обработчики ошибок
app.use('*', isAuthorized, (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errors()); // обработчик ошибок celebrate

// мидлвэр для централизованной обработки ошибок

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message || 'Что-то пошло не так' });
  }

  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
