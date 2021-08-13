import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'
import User from './User'
import File from './File'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public project_id: number

  @column()
  public user_id: number

  @column()
  public file_id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public due_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Project, {
    foreignKey: 'project_id'
  })
  public project: BelongsTo<typeof Project>

  @belongsTo(() => User, {
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @hasOne(() => File, {
    foreignKey: 'file_id'
  })
  public file: HasOne<typeof File>
}
