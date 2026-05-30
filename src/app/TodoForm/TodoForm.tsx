import { useState } from 'react';
import { actions } from 'redux/actions';
import { Checkbox } from 'components';
import { useAppDispatch } from 'redux/store';
import 'app/TodoForm/TodoForm.css';

export const TodoForm: React.FC = () => {
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [important, setImportant] = useState(false);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (name.trim() && info.trim()) {
      const uuid = crypto.randomUUID();
      const data = {
        id: parseInt(uuid.replace(/-/g, '').substring(0, 13), 16), // Преобразуем hex-строку в number
        name: name,
        info: info,
        isImportant: important,
        isCompleted: false,
      };
      dispatch(actions.todo.create(data));
      setName('');
      setInfo('');
      setImportant(false);
    }
  };

  return (
    <div className="todo-form">
      <input
        name="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Название"
        autoComplete="off"
      />
      <input
        name="info"
        type="text"
        value={info}
        onChange={(e) => setInfo(e.target.value)}
        placeholder="Описание"
        autoComplete="off"
      />
      <Checkbox label={'важная задача'} checked={important} onChange={() => setImportant(!important)} />
      <button onClick={handleClick}>Добавить</button>
    </div>
  );
};
