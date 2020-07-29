console.log(process.env.SENDGRID_API_KEY);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'pablosolano61098@gmail.com',
  from: 'pablosolano61098@gmail.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg)
.then(function(result){
    console.log(result);
})
.catch(function(err){
    console.log(err);
});