import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Categories extends BaseSchema {
  protected tableName = "categories";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("color").defaultTo("#ffffff");

      //alter table `categories` add constraint `categories_user_id_foreign` foreign key (`user_id`) references `users` (`id`) - ER_KEY_COLUMN_DOES_NOT_EXITS: Key column 'user_id' doesn't exist in table //aqui a tabela users não existe para ele.
      //O que acontece é que o campo user_id não tinha o mesmo TYPE do campo id da tabela users. então colocamos o unsigned para que o campo user_id seja um inteiro não negativo.
      table.integer("user_id").unsigned().notNullable();

      table.timestamp("created_at", { useTz: true }).notNullable();
      table.timestamp("updated_at", { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
