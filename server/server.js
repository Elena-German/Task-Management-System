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

// GET-запрос на получение списка задач
app.get("/todos", (req, res) => {
    res.json(todos);
})

// GET-запрос задачи по идентификатору
app.get('/todos/:id', (req, res) => {
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
