//Глобальное хранилище приложения

import { configureStore } from '@reduxjs/toolkit';
import todoReducer from 'redux/todoSlice';
import userReducer from 'redux/userSlice';
import { useDispatch } from 'react-redux';

/* метод создания хранилища Redux.

Он использует низкоуровневый метод createStore из ядра Redux, но дополняет его настройками по умолчанию для удобства разработки

configureStore({
 reducer:                     - Одна функция, она будет напрямую использоваться в качестве корневого редьюсера для хранилища
                                Если передать в configureStore объект с редьюсерами срезов (slice reducers),
                                функция автоматически вызовет combineReducers для создания корневого редьюсера

 middleware?:                 - Обратный вызов, который получает getDefaultMiddleware в качестве аргумента и должен возвращать массив промежуточных обработчиков.

                                Если этот параметр указан, он должен возвращать все функции промежуточного обработчика, которые вы хотите добавить в хранилище.
                                configureStore автоматически передаст их в applyMiddleware.
                                Если этот параметр не указан, configureStore вызовет getDefaultMiddleware и использует возвращаемый им массив функций промежуточного обработчика.

devTools?:                   - Логический параметр, позволяющий включить расширение Redux DevTools. Значение по умолчанию равно true

duplicateMiddlewareCheck?:   - Если эта функция включена, хранилище проверит итоговый массив промежуточного программного обеспечения на наличие повторяющихся ссылок.
                               Это позволит избежать таких проблем, как случайное добавление одного и того же промежуточного программного обеспечения RTK Query API дважды
                               Значение по умолчанию равно true

preloadedState?:             - Необязательное значение начального состояния, которое будет передано функции Redux createStore

enhancers?:                  - Функция обратного вызова для настройки массива усилителей.
                               Усилители, возвращенные этим обратным вызовом, будут переданы в функцию compose, а комбинированный усилитель будет передан в createStore
})

*/
export const store = configureStore({
  reducer: {
    todos: todoReducer,
    user: userReducer,
  },
});

// Выведим типы `RootState` и `AppDispatch` из самого хранилища

// Тип самого стора (нужен для селекторов)
export type RootState = ReturnType<typeof store.getState>;
/* store.getState: Это метод Redux-хранилища, который возвращает текущее состояние (весь объект state)
   typeof store.getState: TypeScript смотрит на функцию getState и определяет её сигнатуру (какие аргументы принимает и что возвращает)
   ReturnType<...>: Встроенная утилита TypeScript, которая берет тип функции и извлекает только тип того, что эта функция возвращает
   export type RootState: Создает и экспортирует тип, который полностью описывает структуру вашего хранилища
   Теперь, если вы добавите новый слайс (slice) в configureStore, тип RootState обновится автоматически.
*/

// Тип диспатча (чтобы он понимал асинхронные экшены)
export type AppDispatch = typeof store.dispatch;
/* Определяет тип AppDispatch, основываясь на настройках конкретного store
   Стандартный тип Dispatch из библиотеки Redux «из коробки» не знает о middleware.
   Если вы используете асинхронные экшны (например, createAsyncThunk), обычный dispatch будет выдавать ошибку в TypeScript,
   так как он ожидает только простые объекты-экшны.
   typeof store.dispatch извлекает тип метода dispatch прямо из вашего настроенного хранилища, включая поддержку всех установленных middleware (например, Thunk).
*/
export const useAppDispatch = () => useDispatch<AppDispatch>();
