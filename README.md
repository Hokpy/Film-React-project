# CineScope — Movie Browser

SPA-приложение для просмотра информации о фильмах на React + TypeScript с использованием [Kinopoisk Dev API](https://kinopoisk.dev/).

## Функционал

- 📋 Каталог фильмов с бесконечным скроллом (по 50 за запрос)
- 🔍 Фильтрация по жанру, рейтингу и году выпуска (синхронизация с URL)
- 🎬 Страница детального просмотра фильма
- ❤️ Избранное с сохранением в localStorage (подтверждение через модальное окно)
- ⚖️ Режим сравнения двух фильмов

## Стек

- React 18 + TypeScript
- React Router v6
- Axios
- Vite
- CSS Modules

## Запуск

### 1. Клонировать репозиторий

```bash
git clone <repo-url>
cd movie-app
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить переменные окружения

Скопируйте `.env.default` в `.env` и вставьте ваш API-ключ с [kinopoisk.dev](https://kinopoisk.dev/):

```bash
cp .env.default .env
```

Откройте `.env` и замените значение:

```
VITE_KINOPOISK_API_KEY=ваш_ключ_здесь
```

### 4. Запустить в режиме разработки

```bash
npm run dev
```

### 5. Сборка для продакшена

```bash
npm run build
npm run preview
```

## Переменные окружения

| Переменная                | Описание                      |
|---------------------------|-------------------------------|
| `VITE_KINOPOISK_API_KEY`  | API-ключ с kinopoisk.dev      |
