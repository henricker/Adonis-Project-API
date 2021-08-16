export default interface MailerData {
  to: string
  from: {
    address: string
    name?: string | undefined
  }
  htmlView: {
    template: string
    data?: {}
  }
  subject: string
}
