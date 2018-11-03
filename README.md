## Перед началом работы с проектом
Устанавливаем зависимости из package-lock.json
```
npm install
```
## Настройка Sequelize
Далее создаём базу данных с названием, прописанным в config/config.json
```
npx sequelize db:create
```

Чтобы создать модель, воспользуемся командой sequelize model:create
```
npx sequelize model:create --name <ИмяМодели> --attributes <атрибуты через запятую без пробелов с указанием типа>
```
Пример:
```
npx sequelize model:create --name user --attributes name:String,age:Integer
```
Будет создан файл модели в папке models и файл миграции в migrations.

Делаем миграции в базу данных
```
npx sequelize db:migrate
```
Для добавления имеющихся данных создадим seed-файл
```
npx sequelize seed:generate --name <название>
```
Будет создан файл в папке seeders (если не существует, папка будет создана)
После изменения seed-файла, чтобы добавить изменения в базу данных, запустим
```
npx sequelize db:seed:all
```

#### Команды для сброса миграций/сидов/базы данных
Удаление базы данных
```
npx sequelize db:drop
```

Сброс всех миграций
```
npx sequelize db:migrate:undo:all
```
Сброс всех сидов
```
npx sequelize db:seed:undo:all
```

## Настройка Express
Чтобы запустить сервер Express с помощью nodemon (для обновления содержимого без перезапуска сервера), введём
```
DEBUG=:* npx nodemon start
```
Сервер будет запущен по адресу http://localhost:3000/