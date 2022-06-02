const ValidationError = 400; // переданы некорректные данные в методы создания карточки,
// пользователя, обновления аватара пользователя или профиля;
const AuthError = 401; // проблемы с аутентификацией или авторизацией на сайте
const Forbidden = 403; // Обновление чужого профиля, чужого аватара, удаление чужой карточки
const NotFoundError = 404; // карточка или пользователь не найден.
const DuplicateError = 409; // ошибка базы данных при попытке создать дубликат уникального поля.
const DefaultError = 500; // ошибка по-умолчанию.

module.exports = {
  ValidationError, NotFoundError, DefaultError, DuplicateError, AuthError, Forbidden,
};
