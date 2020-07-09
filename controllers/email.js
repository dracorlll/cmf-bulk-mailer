const nodemailer = require("nodemailer")
const DB = require("./database")

module.exports = {

    send: async (title, subject, content, regex) => {
        //fetch the right receivers from database by regex
        let receivers = await DB.findReceivers(regex)
        receivers.forEach((val, i) => receivers[i] = val.studentMail)
        //get user from db
        let user = await DB.findUser()
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: user.host,
            port: user.port,
            auth: {
                user: user.mail,
                pass: user.pass,
            },
        })
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'Çorlu Mühendislik Fakültesi', // sender address
            bcc: receivers, // list of receivers
            subject: subject + ' Duyuru: ' + title, // Subject line
            html: content, // html body
        })

        console.log("Message sent: %s", info.messageId)
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        return info;

    },
    ghostMail: async () => {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let receivers = await DB.findReceivers([/[0-9]{3}((0606)|(0656))[0-9]{3}/])
        receivers.forEach((val, i) => receivers[i] = val.studentMail)
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'Çorlu Mühendislik Fakültesi Bilgisayar Mühendisliği', // sender address
            to: (receivers === []) ? (receivers) : ('deneme@nku.com'), // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        return nodemailer.getTestMessageUrl(info)

    },
    testMail: async () => {
        let user = await DB.findUser()

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: user.host,
            port: user.port,
            auth: {
                user: user.mail, // generated ethereal user
                pass: user.pass, // generated ethereal password
            },
        })

        // verify connection configuration
        return await transporter.verify()

    }

}