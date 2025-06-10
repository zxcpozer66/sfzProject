# Установка и запуск проекта

## Загрузка репозитория

```bash
git clone https://github.com/zxcpozer66/sfzProject.git
```

## Backend

### Установка, настройка и запуск

1. **Переходим в папку backend**

   ```bash
   cd ./backend
   ```

2. **Установка зависимостей**

   ```bash
   composer install
   ```

3. **Создание конфигурационного файла**

   ```bash
   copy .env.example .env
   ```

4. **Настройка базы данных**

   Отредактируйте файл `.env` и заполните настройки подключения к базе данных:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Генерация ключа приложения**

   ```bash
   php artisan key:generate
   ```

6. **Создание миграции**

   ```bash
   php artisan migrate
   ```

7. **Заполнение базы данных начальными данными**

   ```bash
   php artisan db:seed
   ```

8. **Запуск backend сервера**
   ```bash
   php artisan serve
   ```

## Frontend

### Установка, настройка и запуск

1. **Переходим в папку frontend**

   ```bash
   cd ./../frontend
   ```

2. **Установка зависимостей**

   ```bash
   npm install
   ```

3. **Настройка пути к api**

Отредактируйте файл `./src/config/index.ts` и заполните настройки подключения к api backend:

```index.ts
apiUrl: "http://127.0.0.1:8000/"
```

4. **Запуск сервера разработки**
   ```bash
   npm run dev
   ```
