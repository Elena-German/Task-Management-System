import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Checkbox } from 'components';
import 'app/EditForm/EditForm.css';
import { todoApi, useGetOneTodoQuery } from 'redux/todoApi';

const useUpdateTodoMutation = todoApi.endpoints.updateTodo.useMutation; //useMutation - Это специальное внутреннее свойство RTK Query,
//  встроенное в каждый эндпоинт типа builder.mutation. Оно генерирует стандартный React-хук для этого эндпоинта.
//  можно просто импортировать хук useUpdateTodoMutation из todoApi.ts

//  Когда вы вызываете хук useUpdateTodoMutation в компоненте, он возвращает массив из двух элементов:
//  Первый элемент (updateTodo) — это функция-триггер. Пока вы её не вызовите, запрос на сервер не уйдет.
//  Второй элемент (объект) — содержит состояние этого конкретного запроса (идет ли отправка прямо сейчас — isLoading, успешна ли она — isSuccess` и т.д.).

export const EditForm: React.FC = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const isInvalidId = isNaN(numericId) || !id;

  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [important, setImportant] = useState(false);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: todoById, isLoading } = useGetOneTodoQuery(numericId, {
    skip: isInvalidId, // RTK Query не пошлет запрос на сервер с NaN
  });
  // Хук по умолчанию возвращает результат запроса в переменной с именем data/
  // isLoading: Это встроенный булевый флаг (true / false). Он равен true только один раз — когда запрос отправлен на сервер самый первый раз,
  // данных на клиенте еще нет, и компонент ждет ответа. Как только данные приходят, он навсегда становится false.
  //
  // Аргументы хука: useGetOneTodoQuery(numericId, ...)
  // Первый аргумент - numericId: Это идентификатор задачи (число), который хук автоматически подставит в URL-адрес запроса
  // Второй аргумент - Объект настроек: { skip: isInvalidId }

  const [updateTodo, updateResult] = useUpdateTodoMutation();
  const { data: updatedData, isLoading: isUpdating } = updateResult;
  const currentData = updatedData ?? todoById;

  // Функция, которая сбросит кэш списка на сервере и перенаправит на главную
  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault(); // Отменяем стандартный мгновенный переход ссылки
    dispatch(todoApi.util.invalidateTags([{ type: 'todo', id: 'list' }])); // Принудительно инвалидируем (очищаем) кэш списка задач в Redux-сторе
    navigate('/'); // Перенаправляем пользователя на главную
  };

  useEffect(() => {
    if (todoById) {
      setName(todoById.name);
      setInfo(todoById.info);
      setImportant(todoById.isImportant);
      setCompleted(todoById.isCompleted);
    }
  }, [todoById]); // Срабатывает строго при получении данных от сервера

  if (isInvalidId) {
    return (
      <>
        <div>Ошибка: Некорректный ID в ссылке</div>
        <p>
          <Link to="/">На главную</Link>
        </p>
      </>
    );
  }

  if (isLoading) {
    return <div>Загрузка данных задачи...</div>;
  }

  if (isUpdating) return <div>Идет запись задачи {id}...</div>;

  if (!todoById) {
    return (
      <>
        <div>Задача с ID {id} не найдена</div>
        <p>
          <Link to="/">На главную</Link>
        </p>
      </>
    );
  }

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

  return (
    <>
      <div className="edit-form">
        <input
          className={`${currentData.isImportant ? 'fw-bold' : ''}`}
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название"
          autoComplete="off"
        />{' '}
        {/* отключения автоматического заполнения полей ввода браузером */}
        <input
          className={`${currentData.isImportant ? 'fw-bold' : ''}`}
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
        <span>
          <a href="/" onClick={handleGoHome}>
            Вернуться к списку
          </a>
        </span>
      </div>
    </>
  );
};
