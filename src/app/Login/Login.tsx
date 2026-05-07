import { useSelector, useDispatch } from 'react-redux';
import { actions } from 'redux/actions';
import { selectors } from 'redux/selectors';
import 'app/Login/Login.css';

export const Login: React.FC = () => {
  const auth = useSelector(selectors.user.auth); // извлекаем их хранилища данные по авторизации (да,нет)

  // создаем две функции для отправки экшенов в хранилище
  const dispatch = useDispatch();
  const login = () => dispatch(actions.user.login());
  const logout = () => dispatch(actions.user.logout());

  return (
    <div className="user-login">
      <span> {auth ? '* Пользователь авторизован' : '* Пользователь не авторизован'}</span>
      <button onClick={auth ? logout : login}>{auth ? 'Выйти' : 'Войти'}</button>
    </div>
  );
};
