import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TodoItem } from 'app/TodoItem/TodoItem';
import { useGetAllTodoQuery } from 'redux/todoApi';
import { Todo } from 'types/todo';
import { TodoForm } from 'app/TodoForm/TodoForm';
import 'app/TodoList/TodoList.css';
import { StatusBar } from 'app/StatusBar/StatusBar';
import { Login } from 'app/Login/Login';
import { FilterType } from 'app/Filter/Filter.types';
import { Filter } from 'app/Filter/Filter';

/*При создании компонентов для получения данных с сервера мы можем использовать несколько хуков:

useQuery — Компонует useQuerySubscription и useQueryState и является основным хуком.
Автоматически запускает получение данных с конечной точки, «подписывает» компонент на кэшированные данные и считывает статус запроса и кэшированные данные из хранилища Redux.

useQueryState — Возвращает состояние запроса и принимает skip и selectFromResult.
Считывает статус запроса и кэшированные данные из хранилища Redux.

useQuerySubscription — Возвращает функцию refetch и принимает все параметры хука.
Автоматически запускает получение данных с конечной точки и «подписывает» компонент на кэшированные данные.

---------------------------------------
Хуки запросов принимают два параметра: (queryArg?, queryOptions?).

Параметр queryArg будет передан в базовый обратный вызов query для формирования URL.
Объект queryOptions принимает несколько дополнительных параметров, которые можно использовать для управления процессом получения данных:

skip — позволяет 'пропустить' выполнение запроса для данного рендеринга. По умолчанию false
pollingInterval — позволяет автоматически обновлять запрос через указанный интервал в миллисекундах. По умолчанию 0 (выключено)
selectFromResult — позволяет изменить возвращаемое значение хука, чтобы получить подмножество результата, оптимизированное для рендеринга.
refetchOnMountOrArgChange — позволяет принудительно обновлять запрос при монтировании (если указан true). Позволяет принудительно выполнить повторную выборку данных по запросу, если с момента последнего запроса к тому же кэшу прошло достаточно времени (в секундах) (при наличии number). По умолчанию false
refetchOnFocus — позволяет принудительно выполнить повторную выборку данных по запросу, когда окно браузера снова становится активным. По умолчанию false
refetchOnReconnect — позволяет принудительно выполнить повторную выборку данных по запросу при восстановлении сетевого подключения. По умолчанию false

---------------------------------------

Часто используемые возвращаемые значения хука запроса
Перехватчик запроса возвращает объект, содержащий такие свойства, как последний data запрос, а также логические значения состояния текущего запроса.
Ниже приведены некоторые из наиболее часто используемых свойств. Полный список всех возвращаемых свойств см. в useQuery

data - Последний возвращенный результат, независимо от аргумента хука, если таковой имеется.
currentData - Последний возвращенный результат для текущего аргумента хука, если таковой имеется.
error - Результат ошибки, если таковой имеется.
isUninitialized - Если значение true, это означает, что запрос еще не запущен.
isLoading - Если значение true, это означает, что запрос выполняется впервые и данных еще нет. Это значение будет true для первого отправленного запроса, но не для последующих запросов.
isFetching - Если значение равно true, это означает, что запрос в данный момент выполняется, но в нем могут быть данные из предыдущего запроса. Это будет true как для первого, так и для последующих запросов.
isSuccess - Если значение равно true, это означает, что в запросе есть данные из успешного запроса.
isError - Если значение равно true, это означает, что запрос находится в состоянии error
refetch - Функция для принудительной повторной выборки данных из запроса
---------------------------------------
Хук useQueryState не получает данные с сервера, а только берет их из кэша (хранилища Redux).
Список задач с сервера мы еще не получали, в кэше этого списка нет— поэтому получаем сообщение об ошибке «Не удалось загрузить список».
И на этом работа нашего приложения завершается.
Но мы знаем, что можем запросить данные с сервера с помощью хука useQuerySubscription.
Кроме того, хук подпишет компонент на изменение данных кэша — то есть, при изменении состояния запроса будет вызван новый рендер.
В процессе загрузки списка с сервера мы сначала увидим сообщение «Получение списка задач», а уже потом — сам список.
-------------------
const useGetAllTodoQueryState = todoApi.endpoints.getAllTodo.useQueryState;
const useGetAllTodoQuerySubscription = todoApi.endpoints.getAllTodo.useQuerySubscription;


можно вместо двух использовать один:

const useGetAllTodoQuery = todoApi.endpoints.getAllTodo.useQuery;
*/

export const TodoList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  const page = Number(searchParams.get('page')) || 1;

  const { data, isFetching, isSuccess, isError } = useGetAllTodoQuery({ page, filter: currentFilter });
  // Достаем счетчики из ответа сервера. Если данных еще нет — ставим 0.
  const total = data?.counters?.total ?? 0;
  const completed = data?.counters?.completed ?? 0;
  const uncompleted = data?.counters?.uncompleted ?? 0;
  const important = data?.counters?.important ?? 0;

  const filteredTodos = data?.items || [];
  const hasMore = data?.hasMore ?? false;
  /* автогенерируемый хук

  Хук возвращает объект, содержащий состояние запроса и сами данные.
  Из него извлекаются 4 важные переменные:
  data: Сюда придут данные от сервера (массив ваших задач), когда запрос завершится успешно. До первой загрузки здесь будет undefined.
  isError: true, если запрос завершился ошибкой (например, упал сервер или пропал интернет).
  isFetching:  true каждый раз, когда отправляется запрос на сервер.
  isSuccess:  true, когда запрос хотя бы один раз успешно выполнился и данные data уже доступны для отображения.
  isLoading: равен true только самый первый раз, когда данных еще вообще нет и приложение ждет первый ответ.

    // первый аргумент null — это аргумент, который передается в сам запрос (например, ID или параметры поиска).
    // Поскольку для получения всех задач параметры не нужны, мы передаем null.
    // Второй аргумент {...} — объект конфигурации хука, где мы и переопределяем поведение с помощью функции selectFromResult.
    //
    // По умолчанию хук возвращает огромный объект, содержащий { data: [...], isLoading: true, status: 'fulfilled', ... }.
    // Свойство selectFromResult позволяет вам перехватить этот стандартный ответ до того, как он попадет в компонент, и пересобрать его.

  */

  //  Если мы не на первой странице, но сервер вернул пустой массив,
  // мы плавно откатываемся назад, перезаписывая URL через { replace: true }.
  useEffect(() => {
    if (page > 1 && isSuccess && filteredTodos.length === 0) {
      setSearchParams({ page: String(page - 1) }, { replace: true });
    }
  }, [filteredTodos, page, isSuccess, setSearchParams]);

  const handlePrevPage = () => {
    if (page > 1) {
      setSearchParams({ page: String(page - 1) });
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setSearchParams({ page: String(page + 1) });
    }
  };

  // Проверяем, последняя ли это страница
  const isEndPage = isFetching || !hasMore;

  let contentTodoList;

  if (isFetching && !isSuccess) contentTodoList = <p>Получение списка задач с сервера...</p>;
  else if (isError || (!isFetching && !isSuccess)) contentTodoList = <p>Не удалось загрузить список</p>;
  else
    contentTodoList = (
      <>
        {filteredTodos.length > 0 ? (
          filteredTodos.map((item: Todo) => (
            <TodoItem key={item.id} todo={item} page={page} currentFilter={currentFilter} />
          ))
        ) : (
          <p>Список задач пустой</p>
        )}
      </>
    );

  return (
    <>
      <h1>Система управления задачами</h1>
      <StatusBar total={total} completed={completed} uncompleted={uncompleted} important={important} />
      <Filter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />
      <div className="todo-scroll-wrapper">
        <div className="todo-list">{contentTodoList}</div>
      </div>
      <div className="pagination-container">
        <button
          className="pagination-btn-round"
          onClick={handlePrevPage}
          disabled={page === 1 || isFetching} // Запрещаем «Назад» во время загрузки
          aria-label="Назад">
          <span className="arrow-icon left"></span>
        </button>
        <div className="page-info-orange">
          <span className="page-number-accent">{page}</span>
        </div>
        <button
          className="pagination-btn-round"
          onClick={handleNextPage}
          disabled={isEndPage || isFetching} // Запрещаем «Вперед» во время загрузки
          aria-label="Вперед">
          <span className="arrow-icon right"></span>
        </button>
      </div>
      <div className="status_update">{isFetching && <>Обновление списка задач...</>}</div>
      <TodoForm />
      <Login />
    </>
  );
};
