import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import File from 'App/Models/File'


export default class FilesController {

  public async show({ params, response }: HttpContextContract) {
    try {
      const file = await File.findByOrFail('id', params.id)
      return response.download(Application.tmpPath(`uploads/${file.file}`))
    } catch(err) {
      return response.status(err.status).notFound({ error: 'File not found' })
    }
  }

  public async store ({ request, response }: HttpContextContract) {
    try {
      if(!request.file('file')) return response.status(400).send({ error: 'Unsent file' })
      
      const upload = request.file('file', { size: '2mb' })
      
      const filename = `${cuid()}.${upload!.subtype}`

      await upload!.move(Application.tmpPath('uploads'), {
        name: filename,
      })

      if(upload!.state !== 'moved')
        throw upload?.errors;
      
      const file = await File.create({
        file: filename,
        name: upload?.clientName,
        type: upload?.type,
        subtype: upload?.subtype
      })

      return file

    } catch(err) {
      return response.status(err.status).send({ error: err.message })
    }
  }
}
