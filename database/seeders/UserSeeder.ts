import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Database from "@ioc:Adonis/Lucid/Database";
import Hash from "@ioc:Adonis/Core/Hash";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    //função para encriptar a senha antes de salvar
    async function hashPassword(password: string) {
      return await Hash.make(password);
    }

    const users = {
      name: "Admin",
      email: "jvsdv@gmail.com",
      password: await hashPassword("123456"),
      created_at: new Date(),
      updated_at: new Date(),
    };
    /* await User.create(users); */
    await Database.table("users").insert(users);
  }
}
