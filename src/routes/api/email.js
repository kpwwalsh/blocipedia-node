// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

module.exports={ 
    sendEmail(newUserEmail){ 
      const msg = {

    to: 'newUserEmail',
    from: 'test@no-reply.com',
     subject: 'Blocipedia account',
    html: '<p This email confirms successful Blocipedia sign-up/p>',
    };
    sgMail.send(msg);
    }
};
