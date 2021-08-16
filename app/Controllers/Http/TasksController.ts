import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import TaskValidator from 'App/Validators/TaskValidator'

export default class TasksController {
  public async index({ params }: HttpContextContract) {
    const tasks = await Task.query().preload('user').where('project_id', params.project_id)
    return tasks
  }

  public async store({ request, params }: HttpContextContract) {
    await request.validate(TaskValidator);
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'file_id'])

    const task = await Task.create({ ...data, project_id: params.project_id })

    return task
  }

  public async show({ params }: HttpContextContract) {
    const task = await Task.findByOrFail('id', params.id)

    return task
  }

  public async update({ request, params }: HttpContextContract) {
    await request.validate(TaskValidator)
    const task = await Task.findByOrFail('id', params.id)
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'file_id'])

    task.merge(data)

    await task.save()
    return task
  }

  public async destroy({ params }: HttpContextContract) {
    const task = await Task.findByOrFail('id', params.id)
    await task.delete()
  }
}
