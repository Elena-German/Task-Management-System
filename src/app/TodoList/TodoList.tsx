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

export const TodoList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  const page = Number(searchParams.get('page')) || 1;

  const { data, isFetching, isSuccess, isError } = useGetAllTodoQuery({ page, filter: currentFilter });
  
  const total = data?.counters?.total ?? 0;
  const completed = data?.counters?.completed ?? 0;
  const uncompleted = data?.counters?.uncompleted ?? 0;
  const important = data?.counters?.important ?? 0;

  const filteredTodos = data?.items || [];
  const hasMore = data?.hasMore ?? false;
  
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
          disabled={page === 1 || isFetching} 
          aria-label="Назад">
          <span className="arrow-icon left"></span>
        </button>
        <div className="page-info-orange">
          <span className="page-number-accent">{page}</span>
        </div>
        <button
          className="pagination-btn-round"
          onClick={handleNextPage}
          disabled={isEndPage || isFetching} 
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
