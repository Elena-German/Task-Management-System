import { Link } from 'react-router-dom';

export function NotFoundPage(): any {
  return (
    <div>
      <h1 style={{ color: 'red', fontSize: 100 }}>404</h1>
      <h3>Страница не найдена</h3>
      <p>
        <Link to="/">На главную</Link>
      </p>
    </div>
  );
}
