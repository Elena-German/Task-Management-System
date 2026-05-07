import { useSelector } from 'react-redux';
import { selectors } from 'redux/selectors';
import 'app/StatusBar/StatusBar.css';

export const StatusBar: React.FC = () => {
  const total = useSelector(selectors.todo.allLength);
  const completed = useSelector(selectors.todo.completedLength);
  const uncompleted = useSelector(selectors.todo.uncompletedLength);
  const important = useSelector(selectors.todo.importantLength);

  return (
    <div className="status-bar">
      <span className="text-decoration-underline"> Всего задач {total}</span>: не завершенных {uncompleted}, завершенных{' '}
      {completed}, <span className="fw-bold">важных {important} </span>
    </div>
  );
};
