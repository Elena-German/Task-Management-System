import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const todoApi = createApi({
  /* createApi — главный инструмент RTK Query.
   Он создает единую структуру для всех сетевых запросов, связанных с одной сущностью (в данном случае с задачами).
   «под капотом» RTK Query автоматически сгенерирует готовые React-хуки на основе имен эндпоинтов.
    Они именуются по правилу: use + ИмяЭндпоинта + Query/Mutation с заглавной буквы:
    useGetAllTodoQuery,
    useGetOneTodoQuery,
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useRemoveTodoMutation
*/

  reducerPath: 'todo', // Имя редюсера в глобальном Redux-сторе
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  tagTypes: ['todo', 'user'], //Регистрация названий тегов.
  // Теги — это «метки» для кэша. Они нужны, чтобы RTK Query понимал, какие данные устарели после того, как пользователь что-то изменил или удалил,
  // и когда нужно автоматически сделать новый запрос к серверу.
  endpoints: (builder) => ({
    // конечные точки API
    //Внутри объекта endpoints все запросы делятся на два типа:
    // builder.query (Запросы) — используются строго для получения данных от сервера (GET-запросы). Они автоматически кэшируют данные.
    // builder.mutation (Мутации) — используются для изменения данных на сервере (POST, PUT, PATCH, DELETE-запросы). Они изменяют состояние на бэкенде.
    getUser: builder.query({
      query: () => `user`,
      providesTags: ['user'],
    }),
    toggleAuth: builder.mutation<{ auth: boolean }[], void>({
      query: () => ({
        url: 'user',
        method: 'PATCH',
      }),
      invalidatesTags: ['user'],
    }),
    getAllTodo: builder.query({
      query: () => '/todos',
      providesTags: [{ type: 'todo', id: 'list' }], // Вешает на результат этого запроса метку общего списка задач ({ type: 'todo', id: 'list' }).
      //  Пока эта метка валидна, RTK Query будет отдавать данные из кэша, не дергая сервер повторно.
    }),
    getOneTodo: builder.query({
      query: (id) => `/todos/${id}`,
      providesTags: (res, err, arg) => [{ type: 'todo', id: arg }], //Здесь используется функция.
      //  Параметр arg — это тот самый id, который пришел на вход.
      //  Если мы вызвали хук для задачи с ID 5, кэш этого запроса пометится персональным тегом { type: 'todo', id: 5 }
    }),
    createTodo: builder.mutation({
      query: (data) => ({
        url: '/todos',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'todo', id: 'list' }], //Аннулирует тег списка id: 'list'.
      // Как только новая задача создана, RTK Query видит, что тег id: 'list' стал невалидным, и автоматически перезапускает запрос getAllTodo в фоне.
      // Экран пользователя обновляется сам!
    }),
    updateTodo: builder.mutation({
      query: (data) => {
        const { id, ...rest } = data;
        return {
          url: `/todos/${id}`,
          method: 'PATCH',
          body: rest,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: 'todo', id: arg.id }], //На вход функции приходит arg — это переданный объект data.
      //  Мы берем arg.id и аннулируем тег конкретно этой задачи.
      //  Хук getOneTodo(5) тут же увидит, что его данные устарели, и мгновенно скачает обновленную задачу с сервера.
    }),
    removeTodo: builder.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'todo', id: 'list' }], // Снова сжигает тег списка id: 'list'.
      //  Родителю (списку задач) дается команда: «Перезапроси данные, одной задачи больше нет».
    }),
  }),
});

export const {
  useGetAllTodoQuery,
  useGetOneTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useRemoveTodoMutation,
  useGetUserQuery,
  useToggleAuthMutation,
} = todoApi;
