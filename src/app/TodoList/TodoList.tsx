import { useSelector, shallowEqual } from 'react-redux';
import { useEffect } from 'react';
import { TodoItem } from 'app/TodoItem/TodoItem';
import { selectors } from 'redux/selectors';
import { RootState, useAppDispatch } from 'redux/store';
import { loadProcess } from 'redux/todoSlice';
import 'app/TodoList/TodoList.css';
import { StatusBar } from 'app/StatusBar/StatusBar';
import { TodoForm } from 'app/TodoForm/TodoForm';
import { Login } from 'app/Login/Login';

/* ДО ОПТИМИЗАЦИИ

// Функцию-селектор лучше вынести за пределы компонента, чтобы при каждом новом рендере не создавать ее заново.
// В документации сказано, что хук может вернуть кэшированный результат без повторного запуска селектора,
// если это та же ссылка на функцию, что и при предыдущем рендере компонента.

const todos = (state) => state.todos;

export function TodoList() {

  const items = useSelector(todos);

  //useSelector принимает функцию-селектор, которая извлекет из хранилища какие-то данные.
  // Функция-селектор получает на вход state и будет вызываться при рендере компонента или при изменении состояния хранилища.
  // При отправке экшена useSelector выполнит сравнение предыдущего и текущего значений, полученных от функции-селектора.
  // Если они отличаются — это приведет к принудительному рендеру компонента. Если они совпадают — повторного рендера не будет.
  // По умолчанию useSelector использует строгую проверку === равенства.
  // Если функция-селектор возвращает объект или массив, сравнение может вернуть false, хотя по значениям полей объекты идентичные.
  // Это можно изменить с помощью второго аргумента useSelector: const selectedData = useSelector(selectorReturningObject, shallowEqual);

*/

// ПОСЛЕ ОПТИМИЗАЦИИ

export const TodoList: React.FC = () => {
  const ids = useSelector(selectors.todo.ids, shallowEqual); //используем функцию shallowEqual для сравнения массивов ids, исключаем тем самым лишний рендер
  const loading = useSelector((state: RootState) => state.todos.loading);
  const loadError = useSelector((state: RootState) => state.todos.error);
  const status = useSelector((state: RootState) => state.todos.status);
  const error = useSelector((state: RootState) => state.todos.error);

  const dispatch =
    useAppDispatch(); /* useDispatch — это способ "связаться" с Redux из вашего компонента, чтобы изменить в нем данные.
  В Redux действует правило: вы не можете менять состояние напрямую. Чтобы что-то произошло (например, удалилась задача), вы должны отправить "сообщение" (action) в хранилище.
  Как это работает:Вызов хука: const dispatch = useDispatch(); дает вам доступ к функции отправки.
  Отправка экшена: Когда вы вызываете dispatch(remove(id)), вы буквально говорите Redux: "Эй, выполни действие 'remove' с вот этим ID".
  Результат: Redux получает это сообщение, находит нужный редьюсер, меняет состояние, и ваши компоненты обновляются.
  Зачем сохранять в const dispatch?
  Хуки в React можно вызывать только на верхнем уровне компонента. Вы не можете вызвать useDispatch() прямо внутри функции клика по кнопке.
  Поэтому мы сначала получаем эту функцию и сохраняем ее в переменную, чтобы использовать потом где угодно в этом компоненте */

  useEffect(() => {
    // получить список задач с сервера
    dispatch(loadProcess()); //отправляем пседо-экшн
  }, []);

  if (loading) return <p className="todo-scroll-wrapper">Получение списка задач с сервера...</p>;
  if (loadError) return <p className="todo-scroll-wrapper">{loadError}</p>;

  return (
    <>
      <StatusBar />
      <div className="todo-scroll-wrapper">
        <div className="todo-list">
          {status && <p>{status}</p>}
          {error && <p>{error}</p>}
          {ids.length > 0 ? ids.map((id: number) => <TodoItem key={id} id={id} />) : <p>Список задач пустой</p>}
        </div>
      </div>
      <TodoForm />
      <Login />
    </>
  );
};
