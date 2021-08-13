import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionValidator from 'App/Validators/SessionValidator'

export default class SessionsController {
  async store({ request, auth }: HttpContextContract) {
    await request.validate(SessionValidator)
    const { email, password } = request.all()

    const token = await auth.use('api').attempt(email, password)
    return token
  }
}
