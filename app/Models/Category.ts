import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Task from "./Task";
import { DateTime } from "luxon";

export default class Category extends BaseModel {
  public static table: string = "categories";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public color: string;

  @column({ serializeAs: null })
  public userId: number;

  //foreign key user_id TESTE
  @belongsTo(() => User, { foreignKey: "user_id", localKey: "userId" })
  public user: BelongsTo<typeof User>;

  //no model task temos que criar a foreign key category_id e o local key é o id da categoria
  @hasMany(() => Task, { foreignKey: "categoryId", localKey: "id" })
  public tasks: HasMany<typeof Task>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
