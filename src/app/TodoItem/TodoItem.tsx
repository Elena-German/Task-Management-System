import { useDispatch, useSelector } from 'react-redux';
import { TodoItemProps } from 'app/TodoItem/TodoItem.types';
import { Checkbox } from 'components';
import { actions } from 'redux/actions';
import { selectors } from 'redux/selectors';
import type { RootState } from 'redux/store';
import 'app/TodoItem/TodoItem.css';

export const TodoItem: React.FC<TodoItemProps> = ({ id }) => {
  const todo = useSelector((state: RootState) => selectors.todo.findById(state, id));

  if (todo) {
    const { id, name, info, isImportant, isCompleted } = todo;

    const dispatch = useDispatch(); //просто возвращает функцию store.dispatch

    // создаем две функции для отправки экшенов в хранилище
    const toggle = () => dispatch(actions.todo.toggle(id));
    const remove = () => dispatch(actions.todo.remove(id));

    return (
      <div className="todo-item">
        <span className="fit-content">
          <Checkbox checked={isCompleted} onChange={toggle} />
        </span>
        <span
          className={`expand-content name ${isImportant ? 'fw-bold' : ''}`}
          style={isCompleted ? { textDecoration: 'line-through' } : {}}>
          {name}
        </span>
        <span
          className={`expand-content ${isImportant ? 'fw-bold' : ''}`}
          style={isCompleted ? { textDecoration: 'line-through' } : {}}>
          {info}
        </span>
        <span className="fit-content">
          <button className="btn-delete" onClick={remove}></button>
        </span>
      </div>
    );
  } else return <div className="error">Ошибка! Не найдена задача с идентификатором {id}</div>;
};
