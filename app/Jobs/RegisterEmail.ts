import { JobContract } from '@ioc:Rocketseat/Bull'
import MailerService from '../../resources/services/mail/mail'
import MailerData from 'resources/services/mail/mailer.interface'

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

interface HandleMailer {
  data: {
    mailerOptions: MailerData
  }
}

export default class RegisterEmail implements JobContract {
  public key = 'RegisterEmail'

  public async handle({ data }: HandleMailer) {
    console.log(data.mailerOptions)
    await MailerService.sendMail(data.mailerOptions)
    return data
  }

  public async onFailed(job, err): Promise<void> {
    console.log(err)
  }
}
