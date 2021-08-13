import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  async store({ request }: HttpContextContract) {
    await request.validate(UserValidator)
    const data = request.only(['username', 'email', 'password'])
    const user = await User.create(data)

    return user
  }
}
