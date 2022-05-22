const ValidationError = 400; // переданы некорректные данные в методы создания карточки,
// пользователя, обновления аватара пользователя или профиля;
const NotFoundError = 404; // карточка или пользователь не найден.
const DefaultError = 500; // ошибка по-умолчанию.

module.exports = { ValidationError, NotFoundError, DefaultError };
