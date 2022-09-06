import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Task from "./Task";
import Category from "./Category";

export default class User extends BaseModel {
  public static table: string = "users";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public email: string;

  //nunca vai ser chamado
  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken?: string;

  @hasMany(() => Task, { foreignKey: "userId" })
  public tasks: HasMany<typeof Task>;

  @hasMany(() => Category, { foreignKey: "userId" })
  public categories: HasMany<typeof Category>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  //gacho para incriptar a senha antes de salvar
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
