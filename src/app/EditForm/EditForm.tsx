import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Checkbox } from 'components';
import { todoApi, useGetOneTodoQuery } from 'redux/todoApi';
import 'app/EditForm/EditForm.css';

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
  const [searchParams] = useSearchParams();
  const returnPage = searchParams.get('returnPage') || '1';

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
  const { isLoading: isUpdating } = updateResult;

  // Функция, которая сбросит кэш списка на сервере и перенаправит на главную
  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault(); // Отменяем стандартный мгновенный переход ссылки
    dispatch(todoApi.util.invalidateTags([{ type: 'todo', id: 'list' }])); // Принудительно инвалидируем (очищаем) кэш списка задач в Redux-сторе
    navigate(`/?page=${returnPage}`); // Перенаправляем пользователя на ту страницу с которой пришел
  };

  useEffect(() => {
    if (todoById) {
      setName(todoById.name);
      setInfo(todoById.info);
      setImportant(todoById.isImportant);
      setCompleted(todoById.isCompleted);
    }
  }, [todoById]); // Срабатывает строго при получении данных от сервера

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
    // Если все проверки прошли успешно — рендерим форму.
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
