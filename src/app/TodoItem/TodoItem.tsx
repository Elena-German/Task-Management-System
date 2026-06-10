import { Link } from 'react-router-dom';
import { Checkbox } from 'components';
import 'app/TodoItem/TodoItem.css';
import { useRemoveTodoMutation, useUpdateTodoMutation } from 'redux/todoApi';
import { Todo } from 'types/todo';
import { FilterType } from 'app/Filter/Filter.types';

export const TodoItem: React.FC<{ todo: Todo; page: number; currentFilter: FilterType }> = ({
  todo,
  page,
  currentFilter,
}) => {
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [removeTodo, { isLoading: isRemoving, isSuccess: isRemoved }] = useRemoveTodoMutation();
  /*автогенерируемый хук

  Хук возвращает объект, содержащий состояние запроса и сами данные.
  Из него извлекаются 4 важные переменные:
  data: Сюда придут данные от сервера (массив ваших задач), когда запрос завершится успешно. До первой загрузки здесь будет undefined.
  isError: Булевый флаг (true / false). Становится true, если запрос завершился ошибкой (например, упал сервер или пропал интернет).
  isFetching: Булевый флаг. Становится true каждый раз, когда отправляется запрос на сервер.
  isSuccess: Булевый флаг. Становится true, когда запрос хотя бы один раз успешно выполнился и данные data уже доступны для отображения.
  isLoading: равен true только самый первый раз, когда данных еще вообще нет и приложение ждет первый ответ.

  */

  const handleToggle = () => {
    updateTodo({
      id: todo.id,
      isCompleted: !todo.isCompleted,
      page: page, // Передаем страницу, чтобы RTK Query мгновенно нашел нужный кэш
      filter: currentFilter,
    });
  };

  const handleRemove = () => {
    removeTodo({
      id: todo.id,
      page: page,
      filter: currentFilter, // Передаем страницу и фильтр в мутацию удаления
    });
  };

  if (isRemoving) return <p>Идет удаление задачи {todo.id}...</p>;
  if (isRemoved) return <p>Задача {todo.id} была удалена</p>;

  return (
    <>
      <div className="todo-item">
        <span className="fit-content">
          <Checkbox checked={todo.isCompleted} onChange={handleToggle} disabled={isUpdating} />
        </span>
        <span
          className={`expand-content name ${todo.isImportant ? 'fw-bold' : ''}`}
          style={todo.isCompleted ? { textDecoration: 'line-through' } : {}}>
          {todo.name}
        </span>
        <span
          className={`expand-content ${todo.isImportant ? 'fw-bold' : ''}`}
          style={todo.isCompleted ? { textDecoration: 'line-through' } : {}}>
          {todo.info}
        </span>
        <span className="fit-content">
          <Link to={`/edit_todo/${todo.id}?returnPage=${page}`}>
            <button className="btn-edit"></button>
          </Link>
        </span>
        <span className="fit-content">
          <button className="btn-delete" onClick={handleRemove} disabled={isRemoving}></button>
        </span>
      </div>
    </>
  );
};
