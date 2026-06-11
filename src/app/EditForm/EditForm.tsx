import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Checkbox } from 'components';
import { todoApi, useGetOneTodoQuery } from 'redux/todoApi';
import 'app/EditForm/EditForm.css';

const useUpdateTodoMutation = todoApi.endpoints.updateTodo.useMutation; 

export const EditForm: React.FC = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const isInvalidId = isNaN(numericId) || !id;
  const [searchParams] = useSearchParams();
  const returnPage = searchParams.get('returnPage') || '1';

  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [important, setImportant] = useState(false);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: todoById, isLoading } = useGetOneTodoQuery(numericId, {
    skip: isInvalidId, 
  });
  
  const [updateTodo, updateResult] = useUpdateTodoMutation();
  const { isLoading: isUpdating } = updateResult;
  
  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault(); 
    dispatch(todoApi.util.invalidateTags([{ type: 'todo', id: 'list' }])); 
    navigate(`/?page=${returnPage}`); 
  };

  useEffect(() => {
    if (todoById) {
      setName(todoById.name);
      setInfo(todoById.info);
      setImportant(todoById.isImportant);
      setCompleted(todoById.isCompleted);
    }
  }, [todoById]); 

  const handleClick = () => {
    if (name.trim() && info.trim()) {
      const todo = {
        id: Number(id),
        name: name.trim(),
        info: info.trim(),
        isImportant: important,
        isCompleted: completed,
      };
      updateTodo(todo);
    }
  };

  let contentEditForm;

  if (isInvalidId) {
    contentEditForm = (
      <>
        <div className="status">Ошибка: Некорректный ID в ссылке</div>
        <p>
          <Link to="/">На главную</Link>
        </p>
      </>
    );
  } else if (isLoading) {
    contentEditForm = <div className="status">Загрузка данных задачи...</div>;
  } else if (!todoById) {
    contentEditForm = (
      <>
        <div className="status">Задача с ID {id} не найдена</div>
        <p>
          <Link to="/">На главную</Link>
        </p>
      </>
    );
  } else {
  
    contentEditForm = (
      <>
        <div className="status save_status_container">{isUpdating && <div>Сохранение изменений...</div>}</div>

        <div className="edit-form-content">
          <div className="form-group">
            <label className="form-label">Название</label>
            <input
              className={`form-input ${important ? 'fw-bold' : ''} ${completed ? 'text-decoration-line-through ' : ''}`}
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название задачи"
              autoComplete="off"
              disabled={isUpdating}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              className={`form-textarea ${important ? 'fw-bold' : ''} ${
                completed ? 'text-decoration-line-through ' : ''
              }`}
              name="info"
              rows={3}
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="Описание"
              autoComplete="off"
              disabled={isUpdating}
            />
          </div>

          <div className="checkbox-group-wrapper">
            <div className="checkbox-item">
              <Checkbox label={'важная задача'} checked={important} onChange={() => setImportant(!important)} />
            </div>
            <div className="checkbox-item">
              <Checkbox label={'выполнена'} checked={completed} onChange={() => setCompleted(!completed)} />
            </div>
          </div>

          <div className="group-btn">
            <button
              className={`btn-submit ${important ? 'important' : ''}`}
              onClick={handleClick}
              disabled={isUpdating}>
              {isUpdating ? 'Ожидание' : 'Записать'}
            </button>
            <button className="btn-cancel" onClick={handleGoHome} disabled={isUpdating}>
              Вернуться к списку
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Редактирование</h1>
      <div className="conteiner-content_edit_form">{contentEditForm}</div>
    </>
  );
};
