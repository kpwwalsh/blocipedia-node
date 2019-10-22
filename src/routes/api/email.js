// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
