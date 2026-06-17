
## Технологии которые используются в проекте

React, React-router-dom, Typescript, Redux, Axios, React Hook Form, Yup, Webpack, Eslint, Prettier

## Что реализовано:

Кэширование данных, оптимистичные обновления, валидация форм, кастомные хуки для фильтрации.

## Версии проекта

 1 - самый простой локальный проект на js на пропсах<br>
 2 - локальный, на js, передача данных через useContext<br>
 3 - локальный, на js, на классическом Redux connect<br>
 4 - локальный, на js, Redux  на хуках<br>
 5 - локальный, на js, на Redux Toolkit<br>
 6 - локальный, на js, Redux Toolkit на слайсах<br>
 7 - локальный, перевод на TypeScript<br>
 8 - асинхронное приложение, перевод на клиент-сервер (запросы с fetch)<br>
 9 - реализация на createAsyncThunk <br>
10 - реализация на RTK Query, кэширование <br>
11 - добавлено оптимистичное обновление, фильтрация, пагинация </br>
12 - перевод на axios </br>
13 - перевод на Ract Hook Form </br>
14 - добавлена валидация на Yup </br>

## Структура

```
.
├── dist                                        # папка для билда
├── config
│   ├── constants.js                            # константные пути к файлам и папкам
│   ├── css.modules.config.js                   # конфигурация css modules
│   ├── jest.config.js                          # конфигурация jest
│   ├── postcss.config.js                       # конфигурация postcss
│   ├── svgo.config.js                          # конфигурация обработки svg
│   ├── test.config.js                          # конфигурация окружения Jest, React Testing Library
│   ├── webpack.config.cache.js                 # конфигурация кеширования окружения webpack
│   ├── webpack.config.dev.js                   # конфигурация dev окружения webpack
│   ├── webpack.config.env.js                   # парсинг .env и проброс переменных в webpack
│   ├── webpack.config.https.js                 # конфигурация dev сервера с https
│   ├── webpack.config.js                       # базовый конфиг webpack
│   ├── webpack.config.modules.js               # обработка путей к папкам из tsconfig для webpack
│   ├── webpack.config.prod.js                  # конфигурация сборки
│   └── webpack.config.styles.js                # конфигурация обработчиков css
├── src
|   ├── api                                    # папка для работы с сетью
│   ├── app                                    # основные компоненты с бизнес-логикой│
│   ├── components                             # папка для компонентов без бизнес-логики
│   ├── types                                  # интерфейсы для сущностей
│   ├── utils                                  # вспомогательные функции
│   ├── index.html                             # корневой html
│   ├── index.tsx                              # точка входа в приложение для webpack
│   ├── App.js                                 # точка входа в приложение, роутер
│   ├── react-app-env.d.ts                     # декларация модулей и переменных
├── .browserlistsrc                          # список браузеров для autoprefixer
├── .editorconfig                            # настройки для редакторов
├── .eslintignore                            # игнорирование eslint
├── .eslintrc                                # Конфиг Eslint
├── .gitignore                               # Игнор файл для гита
├── .prettierrc                              # Конфиг prettier
├── package.json
├── tsconfig.json                            # Конфиг тайпскрипта
└── README.md
```
