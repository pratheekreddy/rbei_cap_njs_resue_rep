const nodemailer=require('nodemailer')

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'rbei.node.js.forum@gmail.com',
			pass: 'Bosch@123'
		}
	})
//email content--> {to, subject, html}
const triggerEmail=async (emailContent)=>{
	console.log(emailContent.to)
	let mailOptions = {
		from: '"RBEI-SbS Forum <DO NOT REPLY> " <rbei.node.js.forum@gmail.com>',
		to: emailContent.to,
		subject: emailContent.subject,
		html: emailContent.html
	}
	
	let info = await transporter.sendMail(mailOptions);
	
	return info
}

module.exports=triggerEmail