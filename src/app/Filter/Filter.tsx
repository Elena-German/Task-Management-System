import { useSearchParams } from 'react-router-dom';
import { FilterProps, FilterType } from 'app/Filter/Filter.types';
import 'app/Filter/Filter.css';

export const Filter: React.FC<FilterProps> = ({ currentFilter, setCurrentFilter }) => {
  const [, setSearchParams] = useSearchParams();

  // общий обработчик для кликов по кнопкам
  const handleFilterChange = (filterType: FilterType) => {
    setCurrentFilter(filterType); // Меняем стейт самого фильтра
    setSearchParams({ page: '1' }); // Принудительно сбрасываем страницу на первую в URL
  };
  return (
    <div className="todo-filter-container">
      <div className="todo-filter-wrapper">
        <button
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}>
          Все
        </button>

        <button
          className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
          onClick={() => handleFilterChange('active')}>
          Не выполненные
        </button>

        <button
          className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('completed')}>
          Завершенные
        </button>

        <button
          className={`filter-btn btn-important ${currentFilter === 'important' ? 'active' : ''}`}
          onClick={() => handleFilterChange('important')}>
          Важные
        </button>
      </div>
    </div>
  );
};
