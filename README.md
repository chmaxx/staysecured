
# Основы проектной деятельности (Создание Web- сайта Защити свои данные в сети)

Backend-сторона проекта разработана с использованием среды выполнения JS **Node.JS**. Над исходным кодом работали:
- Максим Захаренков - разработка Backend-приложения
- Владимир Горшков - правки в некоторые исходники, системное администрирование


## Установка зависимостей Node.JS

Для установки зависимостей используйте команду:
```
npm install
```

## Конфигурация

Перед тем, как запустить приложение, необходимо создать `config.json` в папке `config`
Содержимое конфига:
```json
{
  "port": 8000,
  "ip" : "127.0.0.1",
  "https_enable" : false,
  "cert_path" : "cert/path_to_cert.pem",
  "key_path" : "cert/path_to_key.key",
  "api_version": "v1",

  "db_settings": {
    "url": "mongodb://<пользователь>:<пароль>@<сайт>/<база_данных>?retryWrites=true",
    "enabled": true, 
    "reconnect_delay": 4000
  },

  "jwt": {
    "access_token_lifetime": 86400,
    "access_token_secret": "секретный ключ для JWT Access Token", 

    "refresh_token_lifetime": 1209600,
    "refresh_token_secret": "секретный ключ для JWT Refresh Token"
  },

  "mailer": {
    "host": "SMTP-хост",
    "port": 587,
    "secure": false,

    "enabled": true,

    "user": "почта, с которой будет отправляться письмо",
    "password": "пароль от почты"
  }
}
```

Здесь:
- Пользователь - Пользователь базы данных, необязателен 
- Пароль - Пароль от пользователя, необязателен 
- Сайт - ссылка на сайт, на котором расположена база данных (включая порт)
- База данных - название базы данных. Рекомендуемое название - `donstu_project`

## Поддержка HTTPS

Для включения https протокола необходимо:
* Создать папку `cert` в корне проекта
* Переместить в неё ssl сертификат(`.pem` или `.crt`) и ключ(`.key`)
* Изменить в `config.json` значение `port` на `443`
* Изменить в `config.json` значение `https_enable` на `true`
* Изменить в `config.json` значение `cert_path` на относительный путь сертификата(`.pem` или `.crt`)
* Изменить в `config.json` значение `key_path` на относительный путь ключа(`.key`)
* Запустить сервер. При правильной настройки должно вывеститься сообщение об прослушивании порта 443 на HTTPS

## REST API Documentation

### Построение запроса

Запрос на API выглядит следующим образом:

```
<протокол>://api.domain.ru/<версия_апи>/<маршрут>
```
Здесь:
- Протокол - `http` или `https`
- Версия API - указывается в конфиге, на данный момент это `v1`
- Маршрут - необходимая нам часть API. Все возможные маршруты описаны ниже. 

### Маршруты 

На данный момент доступны следующие маршруты:
- Articles - используется для работы со статьями. [Документация по статьям](docs/articles.md)
