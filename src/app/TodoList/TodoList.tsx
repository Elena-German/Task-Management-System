import { useSelector, shallowEqual } from 'react-redux';
import { TodoItem } from 'app/TodoItem/TodoItem';
import { selectors } from 'redux/selectors';
import 'app/TodoList/TodoList.css';

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
  const ids = useSelector(selectors.todo.ids, shallowEqual); //используем функцию shallowEqual для сравнения массивов, исключаем тем самым лишний рендер

  return (
    <div className="todo-scroll-wrapper">
      <div className="todo-list">
        {ids.length > 0 ? ids.map((id: number) => <TodoItem key={id} id={id} />) : <p>Список задач пустой</p>}
      </div>
    </div>
  );
};
