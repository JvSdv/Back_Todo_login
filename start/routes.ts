import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

//login e logout
Route.post("/login", "UsersController.login");
Route.post("/logout", "UsersController.logout");
//mostrar os dados do usuário
Route.get("/me", "UsersController.me").middleware("auth");
/* 
//editar usuário
Route.patch("/users/:id", "UsersController.update").middleware("auth");
//deletar usuário
Route.delete("/users/:id", "UsersController.destroy").middleware("auth"); */
//cadastrar usuário
Route.post("/singup", "UsersController.store");

//ToDo list com login, tendo usuaário, categorias e tarefas
//vamos precisar mostrar as tarefas de cada usuário, e cada tarefa tem uma categoria, e cada categoria tem um usuário, e cada usuário tem uma lista de tarefas e categorias

//criar uma rota para criar uma tarefa, com autenticação
Route.post("/tasks", "TasksController.create").middleware("auth");
//criar uma rota para listar todas as tarefas
Route.get("/tasks", "TasksController.index").middleware("auth");
//criar uma rota para editar uma tarefa
Route.put("/tasks/:id", "TasksController.update").middleware("auth");
//criar um rota para definir uma tarefa como concluída
Route.put("/tasks/:id/done", "TasksController.done").middleware("auth");
//criar uma rota para deletar uma tarefa
Route.delete("/tasks/:id", "TasksController.delete").middleware("auth");
//criar uma rota para listar uma tarefa específica
Route.get("/tasks/:id", "TasksController.show").middleware("auth");

//criar uma rota para criar uma categoria, com autenticação
Route.post("/categories", "CategoriesController.create").middleware("auth");
//criar uma rota para listar todas as categorias
Route.get("/categories", "CategoriesController.index").middleware("auth");
//criar uma rota para editar uma categoria
Route.put("/categories/:id", "CategoriesController.update").middleware("auth");
//criar uma rota para deletar uma categoria
Route.delete("/categories/:id", "CategoriesController.delete").middleware(
  "auth"
);

//criar uma rota para listar uma categoria específica
Route.get("/categories/:id", "CategoriesController.show").middleware("auth");
