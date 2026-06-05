import { Link } from 'react-router-dom';
import { Checkbox } from 'components';
import 'app/TodoItem/TodoItem.css';
import { useRemoveTodoMutation, useUpdateTodoMutation } from 'redux/todoApi';
import { Todo } from 'types/todo';

export const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const [updateTodo, { data: updatedData, isLoading: isUpdating }] = useUpdateTodoMutation();
  const [removeTodo, { isLoading: isRemoving, isSuccess: isRemoved }] = useRemoveTodoMutation();

  const currentData = updatedData ?? todo;
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
      id: currentData.id,
      isCompleted: !currentData.isCompleted,
    });
  };

  if (isRemoving) return <p>Идет удаление задачи {currentData.id}...</p>;
  if (isRemoved) return <p>Задача {currentData.id} была удалена</p>;
  if (isUpdating) return <p>Идет обновление задачи {currentData.id}...</p>;

  return (
    <>
      <div className="todo-item">
        <span className="fit-content">
          <Checkbox checked={currentData.isCompleted} onChange={handleToggle} disabled={isUpdating} />
        </span>
        <span
          className={`expand-content name ${currentData.isImportant ? 'fw-bold' : ''}`}
          style={currentData.isCompleted ? { textDecoration: 'line-through' } : {}}>
          {currentData.name}
        </span>
        <span
          className={`expand-content ${currentData.isImportant ? 'fw-bold' : ''}`}
          style={currentData.isCompleted ? { textDecoration: 'line-through' } : {}}>
          {currentData.info}
        </span>
        <span className="fit-content">
          <Link to={`edit_todo/${currentData.id}`}>
            <button className="btn-edit"></button>
          </Link>
        </span>
        <span className="fit-content">
          <button className="btn-delete" onClick={() => removeTodo(currentData.id)}></button>
        </span>
      </div>
    </>
  );
};
