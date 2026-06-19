import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./redux/store";
import { TodoList } from "app/TodoList/TodoList";
import { PageContainer } from "components/PageContainer";
import { NotFoundPage } from "app/NotFoundPage/NotFoundPage";
import { EditForm } from "app/EditForm/EditForm";

function App() {
  return (
    <Provider store={store}>
      {/* делает хранилище Redux доступным для всех вложенных компонентов */}
      <PageContainer>
        <div className="App">
          <BrowserRouter basename="/Task-Management-System">
            <Routes>
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/" element={<TodoList />} />
              <Route path="edit_todo/:id" element={<EditForm />} />
            </Routes>
          </BrowserRouter>
        </div>
      </PageContainer>
    </Provider>
  );
}

export default App;
