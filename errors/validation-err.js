// переданы некорректные данные в методы создания карточки,
// пользователя, обновления аватара пользователя или профиля;
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
