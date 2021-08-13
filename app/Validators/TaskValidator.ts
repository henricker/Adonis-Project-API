import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TaskValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string(),
    due_date: schema.date({ format: 'yyyy-MM-dd HH:mm:ss' }),
  })

  public messages = {}
}
