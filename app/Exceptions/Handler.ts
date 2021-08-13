import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    if (error.code === 'E_VALIDATION_FAILURE')
      return ctx.response.status(error.status).send(error.messages)

    if (error.code === 'E_UNAUTHORIZED_ACCESS')
      return ctx.response
        .status(error.status)
        .send({ errors: [{ name: error.code, message: 'Not authorized' }] })

    if (error.code === 'E_INVALID_AUTH_UID')
      return ctx.response
        .status(error.status)
        .send({ errors: [{ name: error.code, message: 'Invalid credentials' }] })

    return ctx.response
      .status(error.status)
      .send({ errors: [{ name: error.code, message: error.message }] })
  }
}
