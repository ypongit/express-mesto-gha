const express = require('express');
const mongoose = require('mongoose');
// const router = require('express').Router();
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
});*/

app.use(express.json());

app.use('/cards', cardsRouter);

app.use('/users', /* isAuthorized,  */userRouter);
// авторизация
app.post('/signin', login);

app.post('/signup', createUser);

app.use((err, req, res, _next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message || 'Что-то не так' });
  }

  res.status(500).send({ message: 'Что-то сломалось' });
});

app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
