const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mpkumar.87@gmail.com',
    pass: 'Lavanyaambika90!'
  }
});

const sendWelcomeEmail = async (email, name) => {
	const mailOptions = {
	  from: 'mpkumar.87@gmail.com',
	  to: email,
	  subject: 'Welcome to node js',
	  text: 'Welcome to task app, ' + name
	};
	var mail_response = await transporter.sendMail(mailOptions);
	return mail_response;
}

const sendCancelEmail = async (email, name) => {
	const mailOptions = {
	  from: 'mpkumar.87@gmail.com',
	  to: email,
	  subject: 'Cancel from task app',
	  text: 'U have been deleted your account, ' + name
	};
	var mail_response = await transporter.sendMail(mailOptions);
	return mail_response;
}

module.exports = {
	sendWelcomeEmail,
	sendCancelEmail
}