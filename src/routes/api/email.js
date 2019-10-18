// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

module.exports={ 
    sendEmail(newUserMail){ 
      const msg = {

    to: 'test@example.com',
    from: 'test@example.com',
     subject: 'Sending with Twilio SendGrid is Fun',
     text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg);
    }
};
