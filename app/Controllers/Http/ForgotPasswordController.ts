import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import crypto from 'crypto'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import Mail from '@ioc:Adonis/Addons/Mail'
import moment from 'moment'

export default class ForgotPasswordsController {
    async store({ request, response }: HttpContextContract) {
        const email = request.input('email')
        try {
            const user = await User.findByOrFail('email', email)
            user.token = crypto.randomBytes(10).toString('hex')
            user.token_created_at = DateTime.local()

            await user.save()

            await Mail.send(message => {
                message
                    .to(user.email)
                    .from('henrique.vieira@luby.software', 'Henrique Vieira')
                    .subject('Recuperação de senha')
                    .htmlView('emails/forgot_password', {
                        email,
                        token: user.token,
                        link: `${request.input('redirect_url')}?token=${user.token}`
                    })
            })
        } catch (err) {
            response.status(err.status).send({ error: { message: 'Email dont exists' } })
        }
    }

    async update({ request, response }: HttpContextContract) {
        try {
            const { token, password } = request.all()
            const user = await User.findByOrFail('token', token)
            
            const tokenExpired = moment()
            .subtract('2', 'days')
            .isAfter(user!.token_created_at)
      
            if(tokenExpired) return response.badRequest("Token expired")
      
            user.token = null
            user.token_created_at = null
            user.password = password

            await user.save()
           
        } catch(err) {
            return response.status(err.status).send({ error: 'Invalid token' })
        }
    }
}
