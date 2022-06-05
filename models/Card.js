const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isUrl(v),
      message: 'Здесь должна быть ссылка',
    },
  },
  // owner — ссылка на модель автора карточки, тип ObjectId
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // likes — список лайкнувших пост пользователей, массив ObjectId,
  // по умолчанию — пустой массив (поле default);
  likes: {
    // type: mongoose.Schema.Types.ObjectId,
    type: [{
      type: String,
      ref: 'user',
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
