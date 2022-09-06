import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Category from "./Category";

export default class Task extends BaseModel {
  public static table: string = "tasks";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public datetime: DateTime;

  @column()
  public description: string;

  @column()
  public isDone: boolean;

  @column({ serializeAs: null })
  public userId: number;

  //TESTE foreign key user_id, primeiro criamos os belongsTo e depois os hasMany
  @belongsTo(() => User, { foreignKey: "id", localKey: "userId" })
  public user: BelongsTo<typeof User>;

  @column({ serializeAs: null })
  public categoryId: number;

  //prettier-ignore
  @belongsTo(() => Category, { foreignKey: "categoryId", localKey: "id" })
  public category: BelongsTo<typeof Category>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
