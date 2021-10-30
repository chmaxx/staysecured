# StaySecured

Данный репозиторий создан для совместной разработки Backend-части сайта **StaySecured**.
**StaySecured** - информационный портал, посвященный информационной безопасности. Идея сайта не возникла сама собой - разработчики являются студентами ДГТУ, которые 6-го сентября начали заниматься проектной деятельностью на интересном им направлении. Наши интересы - разработка Web-сайтов и безопасность.

Над исходным кодом работают:

- Максим Захаренков - ВМО11
- Владимир Горшков - ВПР12

## Установка зависимостей Node.JS

Для установки зависимостей используйте команду:

```
npm install
```

## Конфигурация

Перед тем, как запустить приложение, необходимо создать `config.json` в папке `config`

[Конфигурация по умолчанию](config/config_default.json)

_Поясненение к ссылке на базу данных:_

- Пользователь - Пользователь базы данных, необязателен
- Пароль - Пароль от пользователя, необязателен
- Сайт - ссылка на сайт, на котором расположена база данных (включая порт)
- База данных - название базы данных. Рекомендуемое название - `staysecured`

