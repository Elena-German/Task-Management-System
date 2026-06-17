import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Checkbox } from 'components';
import { todoApi, useGetOneTodoQuery, useUpdateTodoMutation } from 'redux/todoApi';
import 'app/EditForm/EditForm.css';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Form } from 'types/form';

export const EditForm: React.FC = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const isInvalidId = isNaN(numericId) || !id;
  const [searchParams] = useSearchParams();
  const returnPage = searchParams.get('returnPage') || '1';

  const navigate = useNavigate();
  const dispatch = useDispatch();
const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<Form>({
    defaultValues: {
      name: '',
      info: '',
      important: false,
      completed: false,
    }
  });
   // watch позволяет следить за значениями полей для динамических CSS классов 
  const isImportantWatch = watch('important');
  const isCompletedWatch = watch('completed');
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
      reset({
        name: todoById.name,
        info: todoById.info,
        important: todoById.isImportant,
        completed: todoById.isCompleted,
      });
    }
  }, [todoById, reset]); 

  const onSubmit: SubmitHandler<Form> = (data) => {
    const todo = {
      id: Number(id),
      name: data.name.trim(),
      info: data.info.trim(),
      isImportant: data.important,
      isCompleted: data.completed,
    };
    updateTodo(todo);
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
<form onSubmit={handleSubmit(onSubmit)} className="edit-form-content">
       
          <div className="form-group">
            <label className="form-label">Название</label>
            <input
              className={`form-input ${isImportantWatch ? 'fw-bold' : ''} ${isCompletedWatch ? 'text-decoration-line-through' : ''} ${errors.name ? 'input-error' : ''}`}
              {...register('name', { 
                required: 'Название обязательно', 
                minLength: { value: 3, message: 'Минимум 3 символа' } 
              })}
              type="text"
              placeholder="Название задачи"
              autoComplete="off"
              disabled={isUpdating}
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              className={`form-textarea ${isImportantWatch ? 'fw-bold' : ''} ${isCompletedWatch ? 'text-decoration-line-through' : ''} ${errors.info ? 'input-error' : ''}`}
              {...register('info', { 
                required: 'Описание обязательно', 
                minLength: { value: 3, message: 'Минимум 3 символа' } 
              })}
              rows={3}
              placeholder="Описание"
              autoComplete="off"
              disabled={isUpdating}
            />
            {errors.info && <span className="error-message">{errors.info.message}</span>}
          </div>

          <div className="checkbox-group-wrapper">
            <div className="checkbox-item">
             <Controller
                control={control}
                name="important"
                render={({ field: { onChange, value } }) => (
                  <Checkbox label={'важная задача'} checked={value} onChange={onChange} disabled={isUpdating} />
                )}
              />
            </div>
            <div className="checkbox-item">
               <Controller
                control={control}
                name="completed"
                render={({ field: { onChange, value } }) => (
                  <Checkbox label={'выполнена'} checked={value} onChange={onChange} disabled={isUpdating} />
                )}
              />
            </div>
          </div>

            <div className="group-btn">
            {/* Кнопка с типом submit автоматически вызовет функцию onSubmit */}
            <button
              type="submit"
              className={`btn-submit ${isImportantWatch ? 'important' : ''}`}
              disabled={isUpdating}
            >
              {isUpdating ? 'Ожидание' : 'Записать'}
            </button>
            <button type="button" className="btn-cancel" onClick={handleGoHome} disabled={isUpdating}>
              Вернуться к списку
            </button>
          </div>
        </form>
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
