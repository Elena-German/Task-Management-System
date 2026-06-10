const express = require("express")
const cors = require("cors");

const app = express()

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json()); //добавляет встроенное промежуточное ПО (middleware) для обработки данных в формате JSON из входящих запросов

let todos = [
  { id: 1, name: 'Первая задачаss', info: 'описание задачи', isImportant: false, isCompleted: true },
  {
    id: 2,
    name: 'Вторая задачаss',
    info: 'длинное описание задачи ххххххххххххххххххххххх хххххххххххххххххххххх ххххххххххххххххххххххх',
    isImportant: false,
    isCompleted: false,
  },
  {
    id: 3,
    name: 'Третья задачаss',
    info: 'описание задачи',
    isImportant: true,
    isCompleted: true,
  },
  {
    id: 4,
    name: 'Четвертая задача длинное название хххххххххххххxx xxxxxxxxxxxxxxxxxxx ss',
    info: 'описание задачи',
    isImportant: false,
    isCompleted: false,
  },
];

let user = [{
  auth: false,
}];

const delay = (ms) => {
  let current = Date.now();
  const future = current + ms;
  while (current < future) {
    current = Date.now();
  }
};

const PAGE_SIZE = 3; // максимум 3 задачи на странице

app.get("/todos", (req, res) => {
  delay(1000); // задержка для имитации сети

  // 1. Получаем параметры из query-строки
  const page = req.query.page && /^\d+$/.test(req.query.page) ? parseInt(req.query.page) : 1;
  const filter = req.query.filter || 'all';

  // 2. СНАЧАЛА ФИЛЬТРУЕМ весь массив задач для пагинации
  let filteredTodos = todos;

  if (filter === 'active') {
    filteredTodos = todos.filter((todo) => !todo.isCompleted);
  } else if (filter === 'completed') {
    filteredTodos = todos.filter((todo) => todo.isCompleted);
  } else if (filter === 'important') {
    filteredTodos = todos.filter((todo) => todo.isImportant);
  }

  // 3. Считаем количество страниц НА ОСНОВЕ ОТФИЛЬТРОВАННЫХ данных
  const pages = filteredTodos.length > 0 ? Math.ceil(filteredTodos.length / PAGE_SIZE) : 1;

  // 4. Заранее готовим объект счетчиков (чтобы не дублировать код в if и else)
  const counters = {
    total: todos.length,
    completed: todos.filter(t => t.isCompleted).length,
    uncompleted: todos.filter(t => !t.isCompleted).length,
    important: todos.filter(t => t.isImportant).length
  };

  // 5. Нарезаем отфильтрованные задачи на страницы
  if (page <= pages) {
    const start = (page - 1) * PAGE_SIZE;
    const part = filteredTodos.slice(start, start + PAGE_SIZE);
    const hasMore = page < pages;

    res.json({
      items: part,
      hasMore: hasMore,
      totalCount: filteredTodos.length,
      counters: counters // Передаем наши счетчики
    });
  } else {
    // ИСПРАВЛЕНИЕ: Если страница исчезла (например, после удаления),
    // возвращаем безопасные дефолтные значения, которые не сломают фронтенд!
    res.json({
      items: [],        // отдаем пустой список задач
      hasMore: false,   // дальше страниц точно нет
      totalCount: filteredTodos.length,
      counters: counters // счетчики все равно отдаем, чтобы StatusBar не пропадал
    });
  }
});



app.get("/user", (req, res) => {
  delay(1000);
  res.json(user);
})

const updateUser = (req, res) => {
  delay(1000);
  console.log(req)
  user[0].auth = !user[0].auth;
  res.json(user);
};

app.put('/user', updateUser);
app.patch('/user', updateUser);

// GET-запрос задачи по идентификатору
app.get('/todos/:id', (req, res) => {
  delay(1000);
  const todo = todos.find((item) => item.id === Number(req.params.id));
  if (todo) {
    res.json(todo);
  } else {
    console.log(todo)
    res.status(404).json({ message: "Задача не найдена" });
  }
});

// POST-запрос на добавление задачи
app.post('/todos', (req, res) => {
  delay(1000);
  const uuid = crypto.randomUUID();
  const newTodo = {
    id: parseInt(uuid.replace(/-/g, '').substring(0, 13), 16), // Преобразуем hex-строку в number,
    name: req.body.name,
    info: req.body.info,
    isImportant: req.body.isImportant || false,
    isCompleted: req.body.isCompleted || false,
  };
  todos.push(newTodo);
  res.json(newTodo);
});

// PUT и PATCH запросы на обновление задачи
const update = (req, res) => {
  delay(1000);
  const todo = todos.find((item) => item.id === Number(req.params.id));
  if (todo) {
    if (req.body.name !== undefined) todo.name = req.body.name;
    if (req.body.info !== undefined) todo.info = req.body.info;
    if (req.body.isImportant !== undefined) todo.isImportant = req.body.isImportant;
    if (req.body.isCompleted !== undefined) todo.isCompleted = req.body.isCompleted;
    res.json(todo);
  } else {
    res.status(404).json({ message: "Не удалось обновить" });
  }
};
app.put('/todos/:id', update);
app.patch('/todos/:id', update);

// DELETE-запрос на удаление
app.delete('/todos/:id', (req, res) => {
  delay(1000);
  const index = todos.findIndex((item) => item.id === Number(req.params.id));
  if (index >= 0) {
    const deleted = todos.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ message: "Не удалось удалить" });
  }
});


app.listen(4000, () => {
  console.log("Сервер запущен на порту 4000")
  //приложение ожидает входящие сообщения на определенном порту (4000) на хосте
  // (доменное имя, при запуске на нашем компьютере это будет «localhost», что является псевдонимом для 127.0.0.1
})
