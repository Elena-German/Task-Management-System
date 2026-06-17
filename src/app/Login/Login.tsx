import { useGetUserQuery, useToggleAuthMutation } from "redux/todoApi";
import "app/Login/Login.css";

export const Login: React.FC = () => {
  const { isAuth, isError, isLoading } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      isLoading,
      isError,
      isAuth: data && data[0] ? data[0].auth : false,
    }),
  });

  const [toggleAuth, { isLoading: isUpdating }] = useToggleAuthMutation();

  if (isLoading)
    return <div className="status-bar">Загрузка статуса аутентификации</div>;
  if (isError)
    return (
      <div className="status-bar">
        Ошибка загрузки статуса аутентификации пользователя
      </div>
    );

  return (
    <div className="user-login">
      <span>
        {" "}
        {isAuth
          ? "* Пользователь авторизован"
          : "* Пользователь не авторизован"}
      </span>
      <button onClick={() => toggleAuth()} disabled={isUpdating}>
        {isUpdating ? "Ожидание..." : isAuth ? "Выйти" : "Войти"}
      </button>
    </div>
  );
};
