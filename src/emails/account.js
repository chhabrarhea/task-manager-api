const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
console.log(process.env.PORT)
const sendWelcomeEmail=(email,name)=>{
    const msg = {
        to: email, // Change to your recipient
        from: 'rheachhabra11@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: `Hi ${name}. Hope you have fun with our app.` }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.log(error)
        })
}
const sendCancellationEmail=(email,name)=>{
    const msg = {
        to: email, // Change to your recipient
        from: 'rheachhabra11@gmail.com', // Change to your verified sender
        subject: 'Sorry to see you go!',
        text: `Hi ${name}. Hope you had fun with our app.` }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.log(error)
        })
}
module.exports={
    sendCancellationEmail,
    sendWelcomeEmail
}