const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'bhaskarchetty22@gmail.com',
    subject: 'Thanks for joining Task Manager!',
    text: `Welcome ${name}. Let us know how you get along with the application.`
  }).then(() => {
    console.log('Welcome email sent')
  }).catch((err) => {
    console.log(err)
  })
}

const sendCancellationMail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'bhaskarchetty22@gmail.com',
    subject: 'Goodbye from Task Manager!',
    text: `Farewell ${name}. Let us know how we can improve our application.`
  }).then(() => {
    console.log('Cancellation email sent!')
  }).catch((err) => {
    console.log(err)
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationMail
}