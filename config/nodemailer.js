const nodemailer = require('nodemailer');


const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    debug: true,
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
})

const sendMail = async (email, token, mode) => {
    try {
        if (mode === 'account-verification') {

            return await transport.sendMail({
                from: process.env.GMAIL_USERNAME,
                to: email,
                subject: "Account verification for idea deployer",
                html: `
        <h1>Welcome</h1>
        <p> Here is your otp to verify your account ${token} </p>
      `
            })
        }
        if (mode === 'forgot-password') {
            return await transport.sendMail({
                from: process.env.GMAIL_USERNAME,
                to: email,
                subject: "Forgot Password for idea deployer",
                html: `
        <h1>Reset Password</h1>
        <p> Here is your otp ${token} </p>
      `
            })
            
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = sendMail  