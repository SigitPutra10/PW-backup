const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // menggunakan Gmail
    auth: {
        user: process.env.EMAIL_USER, // gunakan email pengirim dari .env
        pass: process.env.EMAIL_PASSWORD // gunakan password email pengirim dari .env
    }
});

const sendInvoiceEmail = async (customerEmail, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: subject,
        text: text,
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

module.exports = sendInvoiceEmail;
