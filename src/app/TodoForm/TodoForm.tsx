import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Form } from 'types/form';
import { Checkbox } from 'components';
import { useCreateTodoMutation } from 'redux/todoApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { formSchema } from 'utils/formSchema';
import 'app/TodoForm/TodoForm.css';



export const TodoForm: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false); // хранит состояние показа уведомления о добавлении задачи 
  const [createTodo, { isSuccess }] = useCreateTodoMutation();  // достаем триггер мутации и объект состояния, откуда берем флаг успеха isSuccess
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<Form>({
     resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
      info: '',
      important: false,
    }
  });

  useEffect(() => {
    if (isSuccess) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const onSubmit: SubmitHandler<Form> = (data) => {
    const uuid = crypto.randomUUID();
    const safeHexSnippet = uuid.replace(/-/g, '').substring(0, 12);
    const safeNumberId = parseInt(safeHexSnippet, 16);
    const todoData = {
      id: safeNumberId,
      name: data.name,
      info: data.info,
      isImportant: data.important,
      isCompleted: false,
    };
    createTodo(todoData);
    reset();
  };

  return (
    <div className="todo-form-container">
      {showNotification && (
        <div className="todo-notification animate-fade-in">
          Задача успешно добавлена в конец списка!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="todo-form" >
        <div className="form-field">
          <input
            {...register('name')}
            type="text"
            placeholder="Название"
            autoComplete="off"
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>
        <div className="form-field">
          <input
            {...register('info')}
            type="text"
            placeholder="Описание"
            autoComplete="off"
          />
          {errors.info && <span className="error-message">{errors.info.message}</span>}
        </div>
        {/*специальный инструмент от React Hook Form — компонент Controller. Он служит «переводчиком» между библиотекой и кастомными компонентами.*/}
        <Controller
          control={control}
          name="important"
          render={({ field: { onChange, value } }) => (
            <Checkbox label={'важная задача'} checked={value} onChange={onChange} />
          )}
        />
        <button type="submit" disabled={showNotification}>Добавить</button>
      </form>
    </div>
  );
};
