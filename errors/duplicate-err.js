// ошибка базы данных при попытке создать дубликат уникального поля.
class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = DuplicateError;
