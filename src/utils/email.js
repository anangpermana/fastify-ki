const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b880caad9b23ea",
      pass: "0cceefd6ad67be"
    }
})

const kirimEmail = (email, subject, text) => {
	const mailOptions = {
		from: 'Kuis Islami <noreply@kuisislami.com>',
		to: email,
		subject: subject,
		html:`<p>your code <b>${text}</b></p>`
	}

	return new Promise((resolve, reject) => {

		transporter.sendMail(mailOptions, (err, info) => {
			if(err){
				reject(err)
			}else{
				resolve(info)
			}
		})

	})
}

module.exports = kirimEmail