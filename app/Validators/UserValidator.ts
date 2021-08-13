import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username' })]),
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string({ trim: true }, [
      rules.confirmed(),
      rules.unique({ table: 'users', column: 'password' }),
    ]),
  })

  public messages = {
    'required': '{{ field }} is required',
    'username.unique': 'Username already exists',
    'email.unique': 'Email already exists',
    'emal.email': 'Email is invalid',
    'password.maxLength': 'Password too short',
    'password_confirmation.confirmed': 'Password and confirmed password does not match',
  }
}
