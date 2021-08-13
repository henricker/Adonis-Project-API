import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.exists({ column: 'email', table: 'users' })]),
    redirect_url: schema.string({}, [rules.url()]),
  })

  public messages = {
    'required': '{{ field }} is required',
    'email.email': 'Email is invalid',
    'email.exists': 'Email not found',
    'redirect_url.url': 'Url is invalid',
  }
}
