import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { actions } from 'redux/actions';
import { Checkbox } from 'components';
import { RootState, useAppDispatch } from 'redux/store';
import { selectors } from 'redux/selectors';
import 'app/EditForm/EditForm.css';
import { loadTodoByIdProcess } from 'redux/todoSlice';

export const EditForm: React.FC = () => {
  const loading = useSelector((state: RootState) => state.todos.loading);
  const loadError = useSelector((state: RootState) => state.todos.loadError);
  const { id } = useParams();
  const todoById = useSelector((state: RootState) => selectors.todo.findById(state, Number(id))); //получаем задачу из стора

  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [important, setImportant] = useState(false);
  const [completed, setCompleted] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      if (!todoById) {
        dispatch(loadTodoByIdProcess(Number(id)));
      } else {
        setName(todoById.name);
        setInfo(todoById.info);
        setImportant(todoById.isImportant);
        setCompleted(todoById.isCompleted);
      }
    }
  }, [todoById]);

  const handleClick = () => {
    if (name.trim() && info.trim()) {
      const data = {
        id: Number(id),
        name: name.trim(),
        info: info.trim(),
        isImportant: important,
        isCompleted: completed,
      };
      dispatch(actions.todo.update(data));
      navigate('/');
    }
  };

  if (loading) return <p>Получение задачи с сервера...</p>;
  if (loadError)
    return (
      <>
        <p className="error">{loadError}</p>
        <p>
          <Link to="/">На главную</Link>
        </p>
      </>
    );

  return (
    <>
      <div className="edit-form">
        <input
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название"
          autoComplete="off"
        />{' '}
        {/* отключения автоматического заполнения полей ввода браузером */}
        <input
          name="info"
          type="text"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          placeholder="Описание"
          autoComplete="off"
        />
        <Checkbox label={'важная задача'} checked={important} onChange={() => setImportant(!important)} />
        <button onClick={handleClick}>Записать</button>
        <button type="button" onClick={() => navigate('/')}>
          Отмена
        </button>
      </div>
    </>
  );
};
