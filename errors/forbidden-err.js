// Обновление чужого профиля, чужого аватара, удаление чужой карточки
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
