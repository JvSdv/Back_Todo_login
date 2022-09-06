import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "categories";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      //relacionamento com a tabela users
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(["user_id"]);
    });
  }
}
