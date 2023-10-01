import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';

const ses = new AWS.SES({ region: 'ap-southeast-1' });

const handler = async (event) => {
    const bodyobject = JSON.parse(event.body);
    const {email, name} = bodyobject.data.object.billing_details
    const price = bodyobject.data.object.amount;

    const transporter = nodemailer.createTransport({
        host: 'smtp.ionos.de', // SMTP server address
        port: 587, // SMTP server PORT 
        secure: false, // Set 'true' if use SSL/TLS
        auth: {
            user: '', // SMTP login
            pass: '', // SMTP password
        },
    });

    const mailOptions = {
        from: 'support@talentinsight-europe.com', // Sender email
        to: email, // Reciever email
        subject: 'Proof of payment',
        text: `Hi, ${name}! Your payment in the amount of $${price / 100} has been successfully processed. Payment details: ${bodyobject.data.object.    }`,
    };
    try {
        const info = await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sended', info })
        };
    } catch (error) {
        console.error('Fail email sending', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Fail email sending' })
        };
    }
};

export { handler };