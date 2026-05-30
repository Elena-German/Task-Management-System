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
import type { AnyAction, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import type { Todo } from 'types/todo'; //  import type - вы сообщаете компилятору, что импортируете сущность, которая нужна только для проверки типов.
//  Она гарантированно не содержит исполняемого JS-кода (классов или переменных).
import type { InitState } from 'types/initState';
import { AppDispatch, RootState } from 'redux/store';
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
    loadStarted(state) {
      state.loading = true;
      state.loadError = null;
    },
    loadSuccess(state, action) {
      state.loading = false;
      state.loadError = null;
      state.items = action.payload;
    },
    loadFailure(state, action) {
      state.loading = false;
      state.loadError = action.payload;
    },

    exchangeStarted(state) {
      state.error = null;
      state.status = 'Обмен данными с сервером, ждите...';
    },
    exchangeSuccess(state) {
      state.error = null;
      state.status = null;
    },
    exchangeFailure(state, action) {
      state.error = action.payload;
      state.status = null;
    },
  },
});

export const {
  createClient,
  toggleClient,
  removeClient,
  updateClient,
  loadStarted,
  loadSuccess,
  loadFailure,
  exchangeStarted,
  exchangeSuccess,
  exchangeFailure,
} = todoSlice.actions;
// это объект с функциями для отправки данных (генераторами действий).
// (Action Creator — это обычная функция, которая создает и возвращает объект action) с тем же именем
// Вместо того чтобы вручную писать объект-пустышку каждый раз, когда вы хотите изменить состояние:
// ❌ dispatch({ type: 'remove', payload: id })
// Вы вызываете генератор действия, который делает это за вас:
// ✅ dispatch(remove(2))

//---------------------------------------------------------------------------- псевдо-экшены (возвр. функцию, а не объект)------------------------------------------------------
export const loadProcess = () => {
  //загрузка списка задач
  return async (dispatch: AppDispatch) => {
    dispatch(loadStarted());
    // setTimeout(async () => {
    // для увеличения задержки, чтобы увидеть loader
    try {
      const response = await fetch(baseURL + 'todos');
      if (!response.ok) {
        throw new Error('Ошибка при получении списка задач');
      }
      const jsonData: Todo[] = await response.json();
      dispatch(loadSuccess(jsonData));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      dispatch(loadFailure(errorMessage));
    }
    // }, 2000);
  };
};

export const loadTodoByIdProcess = (id: number) => {
  //загрузка одной задачи по id
  return async (dispatch: AppDispatch) => {
    dispatch(loadStarted());
    try {
      const response = await fetch(`${baseURL}todos/${id}`);
      if (!response.ok) {
        throw new Error(`Задача с идентификатором ${id} не найдена`);
      }
      const jsonData: Todo = await response.json();
      dispatch(loadSuccess([jsonData]));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла непредвиденная ошибка';
      dispatch(loadFailure(errorMessage));
    }
  };
};

const createProcess = (data: Todo): ThunkAction<void, RootState, undefined, AnyAction> => {
  //создание задачи
  return async (dispatch: AppDispatch) => {
    dispatch(exchangeStarted());
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
      const newTodo = await response.json();
      dispatch(createClient(newTodo));
      dispatch(exchangeSuccess());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      dispatch(exchangeFailure(errorMessage));
    }
  };
};

const toggleProcess = (id: number): ThunkAction<void, RootState, undefined, AnyAction> => {
  // переключение задачи (завершено/незавершено)
  /*Тип ThunkAction в Redux — это описание того, как выглядит «асинхронный экшен» (функция, которую возвращает ваш создатель экшена).
  Разберем каждый параметр по порядку: ThunkAction<R, S, E, A>
  ---- void (R — ReturnType):Это то, что вернет сама функция после выполнения.Обычно здесь void, так как нам не нужно, чтобы dispatch(toggleProcess(1)) что-то возвращал в компонент.
  Но если вы напишете Promise<string>, то сможете написать в компоненте const result = await dispatch(toggleProcess(1)).
  ---- RootState (S — State):Это тип всего вашего глобального состояния (Store).
  Он нужен, чтобы внутри функции getState() знал, какие слайсы и поля доступны (например, state.todo.items).
  ---- undefined (E — ExtraArgument):Это тип «дополнительного аргумента», который можно внедрить в Thunk при настройке Store (например, экземпляр API или Axios).
  Если вы ничего специально не настраивали, здесь всегда пишется undefined (или unknown).
  ---- AnyAction (A — Action):Это типы обычных синхронных экшенов, которые этот Thunk может отправлять через dispatch.
  AnyAction — это стандартный интерфейс Redux, который разрешает любой объект с полем type.
  ===== Как это работает "под капотом":Когда вы вешаете этот тип на функцию, TypeScript понимает, что внутри этой функции:
  Первый аргумент (dispatch) — это не просто функция, а ThunkDispatch, который умеет принимать и объекты, и другие функции.
  Второй аргумент (getState) вернет вам объект типа RootState.
  Зачем это нужно?Без этого описания Redux будет думать, что вы пытаетесь отправить в dispatch обычную функцию вместо объекта с типом type,
  и выдаст ошибку: «Аргумент типа... нельзя назначить параметру типа AnyAction».
  */
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(exchangeStarted());

    const todo = getState().todos.items.find((todo: Todo) => todo.id === id);

    if (!todo) {
      dispatch(exchangeFailure('Задача не найдена в списке'));
      return;
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
      dispatch(exchangeSuccess());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      dispatch(exchangeFailure(errorMessage));
    }
  };
};

const removeProcess = (id: number): ThunkAction<void, RootState, undefined, AnyAction> => {
  //удаление задачи
  return async (dispatch: AppDispatch) => {
    dispatch(exchangeStarted());
    try {
      const response = await fetch(`${baseURL}todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Ошибка при удалении задачи');
      }
      dispatch(removeClient(id));
      dispatch(exchangeSuccess());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      dispatch(exchangeFailure(errorMessage));
    }
  };
};

const updateProcess = (updateTodo: Todo): ThunkAction<void, RootState, undefined, AnyAction> => {
  //редактирование задачи
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(exchangeStarted());
    const todo = getState().todos.items.find((todo: Todo) => todo.id === updateTodo.id); // находим в state задачу по id
    if (!todo) {
      dispatch(exchangeFailure('Задача не найдена в списке'));
      return;
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
      dispatch(exchangeSuccess());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      dispatch(exchangeFailure(errorMessage));
    }
  };
};

export { createProcess as create, toggleProcess as toggle, removeProcess as remove, updateProcess as update };

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
