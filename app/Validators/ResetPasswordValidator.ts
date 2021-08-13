import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	token: schema.string({}, [
		rules.exists({ column: 'token', table: 'users' })
	]),
	password: schema.string({ trim: true }, [
		rules.confirmed()
	])
  })


  public messages = {
	  'required':'{{ field }} is required',
	  'token.exists': 'Token not found',
	  'password_confirmation.confirmed': 'Password and confirmed password does not match'
  }
}
