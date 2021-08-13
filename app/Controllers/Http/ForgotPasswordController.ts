import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import crypto from 'crypto'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import moment from 'moment'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'

export default class ForgotPasswordsController {
  async store({ request }: HttpContextContract) {
    await request.validate(ForgotPasswordValidator)
    const email = request.input('email')
    const user = await User.findByOrFail('email', email)
    user.token = crypto.randomBytes(10).toString('hex')
    user.token_created_at = DateTime.local()

    await user.save()

    await Mail.send((message) => {
      message
        .to(user.email)
        .from('henrique.vieira@luby.software', 'Henrique Vieira')
        .subject('Recuperação de senha')
        .htmlView('emails/forgot_password', {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`,
        })
    })
  }

  async update({ request, response }: HttpContextContract) {
    await request.validate(ResetPasswordValidator)
    const { token, password } = request.all()
    const user = await User.findByOrFail('token', token)

    const tokenExpired = moment().subtract('2', 'days').isAfter(user!.token_created_at)

    if (tokenExpired) return response.badRequest('Token expired')

    user.token = null
    user.token_created_at = null
    user.password = password

    await user.save()
  }
}
