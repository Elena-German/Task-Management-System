import "app/StatusBar/StatusBar.css";

export const StatusBar: React.FC<{
  total: number;
  completed: number;
  uncompleted: number;
  important: number;
}> = ({ total, completed, uncompleted, important }) => {
  return (
    <div className="status-bar">
      <span className="text-decoration-underline"> Всего задач {total}</span>:
      не завершенных {uncompleted}, завершенных {completed},{" "}
      <span className="fw-bold">важных {important} </span>
    </div>
  );
};
