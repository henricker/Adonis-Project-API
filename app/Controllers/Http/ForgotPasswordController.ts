import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import crypto from 'crypto'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import moment from 'moment'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'

import MailerService from '../../../resources/services/mail/mail'
import MailerData from 'resources/services/mail/mailer.interface'
import Bull from '@ioc:Rocketseat/Bull'
import Job from '../../Jobs/RegisterEmail'

export default class ForgotPasswordsController {
  async store({ request }: HttpContextContract) {
    await request.validate(ForgotPasswordValidator)
    const email = request.input('email')
    const user = await User.findByOrFail('email', email)
    user.token = crypto.randomBytes(10).toString('hex')
    user.token_created_at = DateTime.local()

    await user.save()

    const mailerOptions: MailerData = {
      to: user.email,
      from: {
        address: 'henrique.vieira@luby.software',
        name: 'Henrique Vieira',
      },
      subject: 'Reset password',
      htmlView: {
        template: 'emails/forgot_password',
        data: {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`,
        },
      },
    }

    Bull.add(new Job().key, { mailerOptions })
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
