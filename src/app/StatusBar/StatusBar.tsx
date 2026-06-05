import { useGetAllTodoQuery } from 'redux/todoApi';
import 'app/StatusBar/StatusBar.css';
import { Todo } from 'types/todo';

export const StatusBar: React.FC = () => {
  const { total, completed, uncompleted, important, isLoading, isError } = useGetAllTodoQuery(null, {
    // первый аргумент null — это аргумент, который передается в сам запрос (например, ID или параметры поиска).
    // Поскольку для получения всех задач параметры не нужны, мы передаем null.
    // Второй аргумент {...} — объект конфигурации хука, где мы и переопределяем поведение с помощью функции selectFromResult.
    //
    // По умолчанию хук возвращает огромный объект, содержащий { data: [...], isLoading: true, status: 'fulfilled', ... }.
    // Свойство selectFromResult позволяет вам перехватить этот стандартный ответ до того, как он попадет в компонент, и пересобрать его.
    selectFromResult: ({ data, isLoading, isError }) => {
      const todos: Todo[] = data || [];
      return {
        isLoading,
        isError,
        total: todos.length,
        completed: todos.filter((todo) => todo.isCompleted).length,
        uncompleted: todos.filter((todo) => !todo.isCompleted).length,
        important: todos.filter((todo) => todo.isImportant).length,
      };
    },
  });

  if (isLoading) return <div className="status-bar">Загрузка статистики...</div>;
  if (isError) return <div className="status-bar">Ошибка загрузки данных</div>;

  return (
    <div className="status-bar">
      <span className="text-decoration-underline"> Всего задач {total}</span>: не завершенных {uncompleted}, завершенных{' '}
      {completed}, <span className="fw-bold">важных {important} </span>
    </div>
  );
};
