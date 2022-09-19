import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
/* import Database from "@ioc:Adonis/Lucid/Database"; */
import Category from "App/Models/Category";
import Task from "App/Models/Task";
import { Knex } from "knex";

//qual o PDO do node.js
//o pdo do node é o knex pois ele é o mais usado.

export default class TasksController {
  public async index({ auth, request, response }: HttpContextContract) {
    //pegar o usuário logado
    const user = auth.user!;
    //vamos usar paginação para retornar apenas as tarefas que o usuário logado criou
    const { page, date } = request.qs();
    let perPage = 5;
    const dateOnly = date;
    //vou receber a data assim: 2022-08-06 sem a hora e vamos ter que retornar as tarefas do dia que foi passado
    /* const dateOnly = date?.split("T")[0]; já estamos recebendo só a data */
    // no banco de dados, a data é armazenada como 2020-08-06T00:00:00.000-03:00

    const tasks = await Task.query()
      .where("user_id", user.id)
      .where("datetime", "like", `%${dateOnly}%`)
      .orderBy("datetime", "desc")
      .preload("category")
      .paginate(page, perPage);

    const tasksSql = Task.query()
      .where("user_id", user.id)
      .where("datetime", "like", `%${dateOnly}%`)
      .orderBy("datetime", "desc")
      .preload("category")
      .toSQL();

    function format(sql: Knex.Sql) {
      for (let i = 0; i < sql.bindings.length; i++) {
        //trocar o ? pelo valor do binding
        sql.sql = sql.sql.replace(/\?/, sql.bindings[i] as string);
      }
      return sql.sql;
    }
    console.log(format(tasksSql));

    //usando knex para fazer a consulta no banco de dados
    /* const tasksKnex = await Database.query()
      .select("*")
      .from("tasks")
      .where("user_id", user.id)
      .where("datetime", "like", `%${dateOnly}%`)
      .orderBy("datetime", "desc")
      .paginate(page, perPage);

    //usando rawQuery para fazer a consulta no banco de dados
    const tasksRaw: [any] = await Database.rawQuery(
      "select * from tasks where user_id = ? and datetime like ? order by datetime desc limit ? offset ?",
      [user.id, `%${dateOnly}%`, perPage, (page - 1) * perPage]
    ); */

    //sql tasks
    /* dentro do sql: select * from tasks where user_id = 1 and datetime like '%2020-08-06%' order by datetime desc limit 2 offset 0 */
    /* const sqlTasks = await Database.rawQuery(
      ` SELECT * FROM tasks WHERE user_id = ${user.id} AND datetime LIKE '%${dateOnly}%' ORDER BY datetime DESC`
    ); */
    /* const sqlCategory = await Database.rawQuery(
      ` SELECT * FROM categories WHERE user_id = ${user.id}`
    ); */

    return response.status(200).json({
      tasks /*sql: format(tasksSql),  tasksKnex, tasksRaw: tasksRaw[0] */,
    });
    // desse modo pegamos as tarefas do dia que foi passado e fazemos paginação
    // .where("datetime", "<", `${dateOnly}`) mostra as tarefas anteriores a data passada
    /* 
    No adonis, só passamos a página como parâmetro, e o adonis já faz a paginação. 
    No next.js, iria ser necessário saber quantos itens pular para retornar. usando o skip e take, usando o offset.
    let offset = 0;
    if (page) {
      offset = (parseInt(page) - 1) * perPage;
    } 
    */
    //pegar as tarefas do usuário
    //aonde o user_id na tabela Tasks é igual ao id do usuário logado
    //carregar as categorias junto tem que usar preload quando for usar query builder
    /* const tasks = await Task.query()
      .where("user_id", user.id)
      .orderBy("datetime", "desc")
      .preload("category"); */
    /* return tasks; */
  }

  public async create({ request, auth, response }: HttpContextContract) {
    const data = request.only([
      "title",
      "datetime",
      "description",
      "category_id",
    ]);

    //verifcar se os campos estão preenchidos e se a categoria existe

    if (
      !data.title ||
      !data.datetime ||
      !data.description ||
      !data.category_id
    ) {
      return response.status(400).json({ error: "All fields are required" });
    }

    const category = await Category.find(data.category_id);
    if (!category) {
      return response.status(400).json({ error: "Category not found" });
    }

    const user = auth.user!;
    await Task.create({ ...data, userId: user.id });
    //task.load("category");
    return response.status(201).json({ result: "success" });
    /* 
    json para requisição:
    {
      "title": "tarefa 1",
      "datetime": "2020-01-01T13:00:00.000-03:00",
      "description": "descrição da tarefa 1",
      "category_id": 1
    }
    */
  }

  public async done({ auth, response, params }: HttpContextContract) {
    const { id } = params;
    const user = auth.user!;
    const task = await Task.find(id);
    if (!task) {
      return response.status(404).json({ error: "Task not found" });
    }
    if (task.userId !== user.id) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    //se tarefa estiver como não concluída, setar como concluída, e vice-versa
    task.isDone = !task.isDone;
    //task.load("category");
    await task.save();
    return response.status(200).json({ result: "success" });
  }

  //prettier-ignore
  public async update({ auth, response, params, request }: HttpContextContract) {
    const { id } = params;
    const user = auth.user!;
    const task = await Task.find(id);
    //verificar se a tarefa existe
    if (!task) {
      return response.status(404).json({ error: "Task not found" });
    }
    //verificar se o usuário logado é o mesmo que criou a tarefa
    if (task.userId !== user.id) {
      return response.status(401).json({ error: "Unauthorized" });
    }
    const data = request.only([
      "title",
      "datetime",
      "description",
      "category_id",
    ]);
    //prettier-ignore
    //não precisamos verificar se os campos estão preenchidos, devemos verrificar o tipo de cada dado e se ele existe separadamente
    //TEM VALIDATOR NO ADONIS
    if (!data.category_id
    ) {
      return response.status(400).json({ error: "O id da categoria é obrigatório" });
    }
    //validar se o titulo tem menos de 40 caracteres
    if(data.title) {
    if (data.title.length > 40) {
      return response.status(400).json({ error: "Title must have less than 40 characters" });
    }
    }
    //validar se a data é uma data válida (2020-01-01T13:00:00.000-03:00) usando regex
    if(data.datetime) {
      if (data.datetime.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}-\d{2}:\d{2}$/)) {
        return response.status(400).json({ error: "Invalid date" });
      }
    }
    //validar se a descrição é maior que 10 caracteres e menor que 100
    if(data.description) {
      if (data.description.length < 10 || data.description.length > 100) {
        return response.status(400).json({ error: "Description must be between 10 and 100 characters" });
      }
    }
    //validar se a categoria existe
    const category = await Category.find(data.category_id);
    if (!category) {
      return response.status(400).json({ error: "Category not found" });
    }
    task.merge(data);
    await task.save();
    return response.status(200).json({ result: "success" });
  }

  public async delete({ auth, response, params }: HttpContextContract) {
    const { id } = params;
    const user = auth.user!;
    const task = await Task.find(id);
    if (!task) {
      return response.status(404).json({ error: "Task not found" });
    }
    if (task.userId !== user.id) {
      return response.status(401).json({ error: "Unauthorized" });
    }
    await task.delete();
    return response.status(200).json({ result: "success" });
  }
}
