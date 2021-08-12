import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SessionsController {
    async store({ request, auth, response }: HttpContextContract ) {
        const { email, password } = request.all()

        try {
            const token = await auth.use('api').attempt(email, password)
            return token
        } catch(err) {
            console.log(err)
            return response.badRequest('Invalid credentials')
        }
    }
}
