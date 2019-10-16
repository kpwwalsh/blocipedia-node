// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const msg = {
to: 'test@example.com',
 from: 'test@example.com',
  subject: 'Sending with Twilio SendGrid is Fun',
 text: 'and easy to do anywhere, even with Node.js',
 html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);