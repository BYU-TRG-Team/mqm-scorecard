const smtpConfig = require('../config/smtp.config');

class SmtpService {
  constructor(sgMail) {
    this.sgMail = sgMail;
    sgMail.setApiKey(smtpConfig.SENDGRID_API_KEY);
  }

  sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
      this.sgMail.send(mailOptions).then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }
}

module.exports = SmtpService;
