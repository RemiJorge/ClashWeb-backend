require('dotenv').config();
const nodemailer = require('nodemailer');

const email = process.env.EMAIL_ADDRESS;
const password = process.env.EMAIL_PASSWORD;

async function sendEmail(to, subject, html) {

    console.log('test1', email, password)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        transportMethod: "SMTP",
        secureConnection: true,
        auth: {
        user: email,
        pass: password
        }
     });

    let mailOptions = {
        from: email,
        to: to,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 
}

module.exports = sendEmail;