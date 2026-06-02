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

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from 'types/todo'; //  import type - вы сообщаете компилятору, что импортируете сущность, которая нужна только для проверки типов.
//  Она гарантированно не содержит исполняемого JS-кода (классов или переменных).
import type { InitState } from 'types/initState';
import { RootState } from 'redux/store';
import { baseURL } from 'api/baseURL';

const initState: InitState = {
  items: [],
  loading: false, // процесс загрузки
  loadError: null, // ошибка загрузки
  status: null, // статус обмена
  error: null, // ошибка обмена
};

const todoSlice = createSlice({
  name: 'todo',
  initialState: initState,
  reducers: {
    // объект с обработчиками экшенов. Каждый обработчик принимает state и action = {type, payload}
    createClient(state, action: PayloadAction<Todo>) {
      // Для каждого редьюсера, определённого в reducers, createSlice генерирует соответствующий генератор действий
      state.items.push(action.payload); // мутация state.
      // Благодаря библиотеке Immer, которая встроена в Redux Toolkit на самом деле под капотом создается новая копия состояния, а исходное состояние остается неизменным.
    },
    toggleClient(state, action: PayloadAction<number>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.isCompleted = !item.isCompleted; // мутация state
      }
    },
    removeClient(state, action: PayloadAction<number>) {
      const items = state.items.filter((item) => item.id !== action.payload); // возврат нового state
      state.items = items;
    },
    updateClient(state, action: PayloadAction<Todo>) {
      const index = state.items.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder

      // загрузка списка задач с сервера
      .addCase(loadProcess.pending, (state) => {
        state.loading = true;
        state.loadError = null;
      })
      .addCase(loadProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.loadError = null;
        state.items = action.payload;
      })
      .addCase(loadProcess.rejected, (state, action) => {
        state.loading = false;
        state.loadError = action.payload ?? 'Неизвестная ошибка'; // Тип string | undefined
      })

      // загрузка задачи по id
      .addCase(loadTodoByIdProcess.pending, (state) => {
        state.loading = true;
        state.loadError = null;
      })
      .addCase(loadTodoByIdProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.loadError = null;
        state.items.push(action.payload);
      })
      .addCase(loadTodoByIdProcess.rejected, (state, action) => {
        state.loading = false;
        state.loadError = action.payload ?? 'Неизвестная ошибка'; // Тип string | undefined
      })

      // создание новой задачи
      .addCase(createProcess.pending, (state) => {
        state.error = null;
        state.status = 'Создание новой задачи, ждите...';
      })
      .addCase(createProcess.fulfilled, (state) => {
        state.error = null;
        state.status = null;
      })
      .addCase(createProcess.rejected, (state, action) => {
        state.error = action.payload ?? 'Неизвестная ошибка';
        state.status = null;
      })

      // изменение статуса задачи
      .addCase(toggleProcess.pending, (state) => {
        state.error = null;
        state.status = 'Изменение статуса задачи, ждите...';
      })
      .addCase(toggleProcess.fulfilled, (state) => {
        state.error = null;
        state.status = null;
      })
      .addCase(toggleProcess.rejected, (state, action) => {
        state.error = action.payload ?? 'Неизвестная ошибка';
        state.status = null;
      })

      // удаление задачи
      .addCase(removeProcess.pending, (state) => {
        state.error = null;
        state.status = 'Удаление задачи, ждите...';
      })
      .addCase(removeProcess.fulfilled, (state) => {
        state.error = null;
        state.status = null;
      })
      .addCase(removeProcess.rejected, (state, action) => {
        state.error = action.payload ?? 'Неизвестная ошибка';
        state.status = null;
      })

      // редактирование задачи
      .addCase(updateProcess.pending, (state) => {
        state.error = null;
        state.status = 'Обновление задачи, ждите...';
      })
      .addCase(updateProcess.fulfilled, (state) => {
        state.error = null;
        state.status = null;
      })
      .addCase(updateProcess.rejected, (state, action) => {
        state.error = action.payload ?? 'Неизвестная ошибка';
        state.status = null;
      });
  },
});

export const { createClient, toggleClient, removeClient, updateClient } = todoSlice.actions;
// это объект с функциями для отправки данных (генераторами действий).
// (Action Creator — это обычная функция, которая создает и возвращает объект action) с тем же именем
// Вместо того чтобы вручную писать объект-пустышку каждый раз, когда вы хотите изменить состояние:
// ❌ dispatch({ type: 'remove', payload: id })
// Вы вызываете генератор действия, который делает это за вас:
// ✅ dispatch(remove(2))

//---------------------------------------------------------------------------- псевдо-экшены (возвр. функцию, а не объект)------------------------------------------------------

//загрузка списка задач
const loadProcess = createAsyncThunk<Todo[], void, { rejectValue: string }>(
  //createAsyncThunk<ТипУспешногоОтвета, ТипВходногоПараметра, НастройкиThunkAPI>
  /*  Этот код создает асинхронный экшен (Thunk) с помощью Redux Toolkit для загрузки списка задач с сервера.
  Он автоматически управляет состояниями запроса (загрузка, успех, ошибка). Функция, которая принимает строку с типом действия Redux и функцию обратного вызова,
  которая должна возвращать промис. Она генерирует типы действий жизненного цикла промиса на основе переданного префикса типа действия и возвращает создателя действий-функций,
  который запускает обратный вызов промиса и отправляет действия жизненного цикла на основе возвращенного промиса.
  */

  'todo/loadProcess',
  /*
   создаст следующие типы действий:

    pending: 'todo/loadProcess/pending'
    fulfilled: 'todo/loadProcess/fulfilled'
    rejected: 'todo/loadProcess/rejected'

*/
  async function (_, { rejectWithValue }) {
    /*
Функция payloadCreator будет вызвана с двумя аргументами:

arg: одно значение, содержащее первый параметр, переданный в функцию-обертку при отправке.
Это удобно для передачи таких значений, как идентификаторы элементов, которые могут понадобиться в запросе.
Если вам нужно передать несколько значений, передайте их вместе в виде объекта при отправке функции-обертки,
например dispatch(fetchUsers({status: 'active', sortBy: 'name'})).
_ (нижнее подчеркивание) — это первый аргумент, который обычно представляет собой входные параметры для запроса (например, лимит или id).
 Так как для загрузки всех задач параметры не нужны, вместо имени переменной используется _ (заглушка).

thunkAPI: объект, содержащий все параметры, которые обычно передаются в функцию-обертку Redux, а также дополнительные параметры:

dispatch: метод dispatch хранилища Redux

getState: метод getState хранилища Redux

extra: «дополнительный аргумент», передаваемый промежуточному программному обеспечению thunk при настройке, если он доступен

requestId: уникальное строковое значение идентификатора, автоматически сгенерированное для идентификации последовательности запросов

signal: AbortController.signalобъект, который можно использовать, чтобы узнать, не пометила ли другая часть логики приложения этот запрос как требующий отмены.

rejectWithValue(value, [meta]): rejectWithValue — это служебная функция, которую можно return (или throw) использовать в создателе действий
для возврата отклоненного ответа с определенной полезной нагрузкой и метаданными.
Она передаст любое указанное вами значение и вернет его в полезной нагрузке отклоненного действия.
Если вы также передадите meta, оно будет объединено с существующим rejectedAction.meta.

fulfillWithValue(value, meta): fulfillWithValue — это служебная функция, которую вы можете return использовать в своем конструкторе действий,
чтобы fulfill со значением, при этом имея возможность добавлять в fulfilledAction.meta.

Логика функции payloadCreator может использовать любое из этих значений для расчета результата.

 { rejectWithValue } — деструктуризация второго аргумента (thunkAPI).
  Метод rejectWithValue нужен для того, чтобы в случае ошибки вручную передать понятный текст ошибки в Redux-редюсер.
*/

    try {
      const response = await fetch(baseURL + 'todos');
      if (!response.ok) {
        throw new Error('Ошибка при получении списка задач');
      }
      const items = await response.json();
      return items;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      return rejectWithValue(errorMessage);
    }
  }
);

const loadTodoByIdProcess = createAsyncThunk<Todo, number, { rejectValue: string }>(
  'todo/loadTodoByIdProcess',
  async function (id, { rejectWithValue }) {
    try {
      const response = await fetch(`${baseURL}todos/${id}`);
      if (!response.ok) {
        throw new Error(`Задача с идентификатором ${id} не найдена`);
      }
      const jsonData: Todo = await response.json();
      return jsonData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      return rejectWithValue(errorMessage);
    }
  }
);

const createProcess = createAsyncThunk<void, Todo, { rejectValue: string }>(
  'todo/createProcess',
  async function (data, { rejectWithValue, dispatch }) {
    try {
      const response = await fetch(baseURL + 'todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Ошибка при добавлении новой задачи');
      }
      const newTodo: Todo = await response.json();
      dispatch(createClient(newTodo));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      return rejectWithValue(errorMessage);
    }
  }
);

const toggleProcess = createAsyncThunk<void, number, { state: RootState; rejectValue: string }>(
  'todo/toggleProcess',
  async function (id, { rejectWithValue, dispatch, getState }) {
    const todo = getState().todos.items.find((todo: Todo) => todo.id === id);
    if (!todo) {
      return rejectWithValue('Задача не найдена в локальном сторе');
    }
    try {
      const response = await fetch(`${baseURL}todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isCompleted: !todo.isCompleted,
        }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при изменении статуса задачи');
      }
      dispatch(toggleClient(id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      return rejectWithValue(errorMessage);
    }
  }
);

const removeProcess = createAsyncThunk<void, number, { rejectValue: string }>(
  'todo/removeProcess',
  async function (id, { rejectWithValue, dispatch }) {
    try {
      const response = await fetch(`${baseURL}todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Ошибка при удалении задачи');
      }
      dispatch(removeClient(id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      return rejectWithValue(errorMessage);
    }
  }
);

const updateProcess = createAsyncThunk<void, Todo, { rejectValue: string; state: RootState }>(
  'todo/updateProcess',
  async function (updateTodo, { rejectWithValue, dispatch, getState }) {
    const todo = getState().todos.items.find((todo: Todo) => todo.id === updateTodo.id);
    if (!todo) {
      return rejectWithValue('Задача не найдена в локальном сторе');
    }
    try {
      const response = await fetch(`${baseURL}todos/${updateTodo.id}`, {
        //обновляем на сервере задачу
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateTodo),
      });
      if (!response.ok) {
        throw new Error('Ошибка при обновлении задачи');
      }
      dispatch(updateClient(updateTodo)); //обновляем задачу в state
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      return rejectWithValue(errorMessage);
    }
  }
);

export {
  loadProcess,
  loadTodoByIdProcess,
  createProcess as create,
  toggleProcess as toggle,
  removeProcess as remove,
  updateProcess as update,
};

export default todoSlice.reducer;
//  это одна большая функция, которую необходимо передать в Store
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
