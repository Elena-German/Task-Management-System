/*

Функция createSlice анализирует функции, определенные в поле reducers, и создает функцию-редюсер и генератор действия для каждого случая.
Поскольку в этом случае редюсеры и генераторы действия неразрывно связаны друг с другом, предусмотрено поле extraReducers,
которое позволяет реагировать на action (как правило, из другого среза), но не создает генератор действия.

В качестве входных параметров принимает объект со следующими полями:

name — имя среза (служит префиксом для экшенов, например todo/toggle)

initialState — начальное состояние среза состояния

reducers — объект с обработчиками экшенов. Каждый обработчик принимает state и action = {type, payload}
(reducer - чистая функция, которая на базе текущего состояния state и полученного action генерирует НОВОЕ состояние state)

extraReducers — объект, содержащий редюсеры другого среза, если нужно обновить другой срез


Результатом работы функции является объект, называемый «срез», со следующими полями:

name — имя среза состояния
reducer — атоматически созданная функция-редюсер, которую можно передать в combineReducers
actions — автоматически созданные с помощью createAction генераторы действий
caseReducers — те функции, которые мы передали в createSlice через поле reducers

*/

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from 'types/todo'; //  import type - вы сообщаете компилятору, что импортируете сущность, которая нужна только для проверки типов.
//  Она гарантированно не содержит исполняемого JS-кода (классов или переменных).

const initState: Todo[] = [
  { id: 1, name: 'Первая задача', info: 'описание задачи', isImportant: false, isCompleted: true },
  {
    id: 2,
    name: 'Вторая задача',
    info: 'длинное описание задачи ххххххххххххххххххххххх хххххххххххххххххххххх ххххххххххххххххххххххх',
    isImportant: false,
    isCompleted: false,
  },
  {
    id: 3,
    name: 'Третья задача',
    info: 'описание задачи',
    isImportant: true,
    isCompleted: true,
  },
  {
    id: 4,
    name: 'Четвертая задача длинное название хххххххххххххxx xxxxxxxxxxxxxxxxxxx',
    info: 'описание задачи',
    isImportant: false,
    isCompleted: false,
  },
];

const todoSlice = createSlice({
  name: 'todo',
  initialState: initState,
  reducers: {
    // объект с обработчиками экшенов. Каждый обработчик принимает state и action = {type, payload}
    create(state, action: PayloadAction<Todo>) {
      // Для каждого редьюсера, определённого в reducers, createSlice генерирует соответствующий генератор действий
      state.push(action.payload); // мутация state.
      // Благодаря библиотеке Immer, которая встроена в Redux Toolkit на самом деле под капотом создается новая копия состояния, а исходное состояние остается неизменным.
    },
    toggle(state, action: PayloadAction<number>) {
      const item = state.find((item) => item.id === action.payload);
      if (item) {
        item.isCompleted = !item.isCompleted; // мутация state
      }
    },
    remove(state, action: PayloadAction<number>) {
      return state.filter((item) => item.id !== action.payload); // возврат нового state
    },
  },
});

export const { create, toggle, remove } = todoSlice.actions; // это объект с функциями для отправки данных (генераторами действий).
// (Action Creator — это обычная функция, которая создает и возвращает объект action) с тем же именем
// Вместо того чтобы вручную писать объект-пустышку каждый раз, когда вы хотите изменить состояние:
// ❌ dispatch({ type: 'remove', payload: id })
// Вы вызываете генератор действия, который делает это за вас:
// ✅ dispatch(remove(2))

export default todoSlice.reducer; //  это одна большая функция, которую необходимо передать в Store
// (объединяет в себе все маленькие функции, которые вы написали внутри объекта reducers)
//  В файле store.js мы подключаем его:
// const store = configureStore({
//   reducer: {
//     todos: todoSlice.reducer // вот здесь он "оживает"
//   }
// });

/*

Extra reducers
Разделение данных по слайсам приводит к ситуациям, когда на одно действие нужно реагировать в разных частях хранилища.
Например, если удаляется пост, то нужно удалить и его комментарии, которые находятся в другом слайсе.

В Redux такая задача решается просто добавлением в switch реакции на нужное действие по его имени.
В Redux Toolkit так уже не получится из-за железной связи редюсеров с действиями. Это цена, которую мы платим за сокращение кода.

Для реакции на действия, происходящие в других слайсах, Redux Toolkit добавляет механизм дополнительных редюсеров extraReducers.
В слайс добавляется свойство extraReducers, через которое можно устанавливать реакцию (редюсеры) на внешние действия.

Импортируем из других слайсов действия, на которые нужно реагировать:

import { removePost } from './postSlice.js';

const commentSlice = createSlice({
    name: 'comment',
    initialState: [],
    reducers: {
       // обычные редюсеры
    },
    extraReducers: (builder) => { // При удалении поста нужно удалить все его комментарии
        builder.addCase(removePost, (state, action) => {
            const postId = action.payload;
            return state.filter((item) => item.postId !== postId);
        });
    },
});

// где-то в приложении...
dispatch(removePost(post.id));

*/
