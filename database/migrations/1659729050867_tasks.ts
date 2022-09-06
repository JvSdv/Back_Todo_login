import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Tasks extends BaseSchema {
  protected tableName = "tasks";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.datetime("datetime").notNullable();
      table.text("description").notNullable();
      table.boolean("is_done").notNullable().defaultTo(false);

      table.integer("user_id").notNullable().unsigned();
      table.integer("category_id").notNullable().unsigned();

      table.timestamp("created_at", { useTz: true }).notNullable();
      table.timestamp("updated_at", { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
