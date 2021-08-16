import Mail from '@ioc:Adonis/Addons/Mail'
import { BelongsTo, LucidModel } from '@ioc:Adonis/Lucid/Orm'
import File from 'App/Models/File'
import MailerData from './mailer.interface'
import Application from '@ioc:Adonis/Core/Application'

export default class MailerService {
  static async sendMail(
    mailerData: MailerData,
    attachFile?: BelongsTo<typeof File, LucidModel>
  ): Promise<void> {
    await Mail.send((message) => {
      message
        .to(mailerData.to)
        .from(mailerData.from.address, mailerData.from.name)
        .subject(mailerData.subject)
        .htmlView(mailerData.htmlView.template, mailerData.htmlView.data)

      if (attachFile)
        message.attach(Application.tmpPath(`uploads/${attachFile.file}`), {
          filename: attachFile.name,
        })
    })
  }
}
