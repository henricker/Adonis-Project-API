import { DateTime } from 'luxon'
import { afterCreate, BaseModel, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'
import User from './User'
import File from './File'
import Mail from '@ioc:Adonis/Addons/Mail'
import Application from '@ioc:Adonis/Core/Application';

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
    foreignKey: 'project_id',
  })
  public project: BelongsTo<typeof Project>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => File, {
    foreignKey: 'file_id',
  })
  public file: BelongsTo<typeof File>

  @afterCreate()
  @beforeUpdate()
  public static async sendNewTaskMail(task: Task) {
    if (!task.user_id && !task.$dirty.user_id) {
      return
    }

    await task.load('user')
    await task.load('project')
    await task.load('file')

    const { email, username } = task.user
    const titleProject = task.project.title
    const titleTask = task.title
    const file = task.file

    await Mail.send(message => {
      message
        .htmlView('emails/new_task', { username, titleTask, titleProject, hasAttachment: !!file })
        .to(email)
        .from('henrique.vieira@luby.software', 'Henrique Vieira')
        .subject(`New task of the ${titleProject} project`)

      if (file)
        message.attach(Application.tmpPath(`uploads/${file.file}`), { filename: file.name })
    })
  }

}
