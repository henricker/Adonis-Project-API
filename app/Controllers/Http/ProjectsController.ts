import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'

export default class ProjectsController {
  public async index ({}: HttpContextContract) {
    const projects = await Project.query().preload('user')

    return projects
  }

  public async store ({ request, auth }: HttpContextContract) {
    const data = request.only(['title', 'description'])
    const project = await Project.create({  ...data, user_id: auth.user?.id })

    return project
  }

  public async show ({ params }: HttpContextContract) {
    const project = await Project.findByOrFail('id', params.id)

    await project.load('user')
    await project.load('tasks')

    return project
  }

  public async update ({ request, params }: HttpContextContract) {
    const project = await Project.findByOrFail('id', params.id)
    const data = request.only(['title', 'description'])

    project.merge(data)

    await project.save()

    return project
  }

  public async destroy ({ params }: HttpContextContract) {
    const project = await Project.findByOrFail('id', params.id)
    await project.delete()
  }
}
