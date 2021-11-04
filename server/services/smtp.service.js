class SmtpService {
  constructor(transporter) {
    this.transporter = transporter;
  }

  sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions).then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }
}

module.exports = SmtpService;
