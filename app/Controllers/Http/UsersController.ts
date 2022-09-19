import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Category from "App/Models/Category";

export default class AuthController {
  //login e logout
  public async login({ request, auth }: HttpContextContract): Promise<string> {
    const data = request.only(["email", "password"]);
    const token = await auth.attempt(data.email, data.password);

    //o proprio adonis já valida se o usuário existe e se a senha está correta
    //retornar o token
    return token;
  }

  public async logout({ auth }: HttpContextContract) {
    //fazer o logout
    await auth.logout();
  }

  public async me({ auth }: HttpContextContract) {
    const user = auth.user!;
    //estamos usando ADONISJS
    /* await user.load("categories");
    await user.load("tasks"); */
    return user;
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const data = request.only(["name", "email", "password"]);
    //verificar se o email já existe
    /*  const userExists = await User.findBy("email", data.email);
    if (userExists) {
      return response.status(400).json({ error: "Email already exists" });
    } */
    //criar o usuário
    console.log(data);

    await User.create(data).catch(() => {
      return response
        .status(400)
        .json({ error: "O seu email, já foi cadastrado" });
    });
    //vamos criar uma categoria padrão para o usuário

    //fazer o login do usuário
    const token = await auth.attempt(data.email, data.password, {
      expiresIn: "30 days",
    });
    console.log(token);

    //criar a categoria padrão
    if (token) {
      const user = auth.user!;
      const category = await Category.create({
        title: "Sem categoria",
        color: "#000000",
        userId: user.id,
      });
      console.log(category);
    }
    return token;
  }
}
