import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";

export default class CategoriesController {
  //retornar as categorias do usuário
  public async index({ auth }: HttpContextContract) {
    const user = auth.user!;
    const categories = await Category.query().where("user_id", user.id);
    return categories;
  }

  //criar uma categoria
  public async create({ request, auth }: HttpContextContract) {
    const data = request.only(["title", "color"]);
    if (!data.title || !data.color) {
      return {
        error: "Todos os campos são obrigatórios",
      };
    }
    if (!/^#[0-9A-F]{6}$/i.test(data.color)) {
      return {
        error: "A cor deve ser hexadecimal",
      };
    }
    const user = auth.user!;
    const category = await Category.create({ ...data, userId: user.id });
    return category;
  }

  //editar uma categoria
  public async update({ request, auth, params }: HttpContextContract) {
    const { id } = params;
    const data = request.only(["title", "color"]);
    /*  if (!data.title || !data.color) {
      return {
        error: "Todos os campos são obrigatórios",
      };
    } */
    //para o update, não preciso verificar dados obrigatórios
    //verificar se a cor é válida (hexadecimal) #000000
    if (data.color) {
      if (!/^#[0-9A-F]{6}$/i.test(data.color)) {
        return {
          error: "A cor deve ser hexadecimal",
        };
      }
    }
    const user = auth.user!;
    const category = await Category.find(id);
    if (!category) {
      return {
        error: "Categoria não encontrada",
      };
    }
    if (category.userId !== user.id) {
      return {
        error: "Usuário não autorizado",
      };
    }
    category.merge(data);
    await category.save();
    return category;
  }

  //deletar uma categoria
  public async delete({ auth, params }: HttpContextContract) {
    const { id } = params;
    const user = auth.user!;
    const category = await Category.find(id);
    if (!category) {
      return {
        error: "Categoria não encontrada",
      };
    }
    if (category.userId !== user.id) {
      return {
        error: "Usuário não autorizado",
      };
    }
    //const tasks = await Task.query().where("category_id", id);
    //verificar se a categoria está sendo usada em alguma tarefa
    //tenho que verificar pois se a categoria está sendo usada em alguma tarefa, ela não pode ser deletada
    //tenho que verificar quando as relações são 1:1 ou 1:n
    await category.load("tasks");
    if (category.tasks.length > 0) {
      return {
        error: "Categoria em uso",
      };
    }

    await category.delete();
    return {
      result: "success",
    };
  }
}
