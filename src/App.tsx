import { Provider } from 'react-redux';
import { TodoList } from 'app/TodoList/TodoList';
import { TodoForm } from 'app/TodoForm/TodoForm';
import { StatusBar } from 'app/StatusBar/StatusBar';
import { PageContainer } from 'components/PageContainer';
import { store } from './redux/store';
import { Login } from 'app/Login/Login';

function App() {
  return (
    <Provider store={store}> {/* делает хранилище Redux доступным для всех вложенных компонентов */}
      <PageContainer>
        <div className="App">
          <h1>Список задач</h1>
          <StatusBar />
          <TodoList />
          <TodoForm />
          <Login />
        </div>
      </PageContainer>
    </Provider>
  );
}

export default App;
