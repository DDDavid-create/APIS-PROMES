// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function enviarCorreoMasivo(correos, asunto, contenido) {
    for (const email of correos) {
        try {
            const info = await transporter.sendMail({
                from: `"Tu Nombre" <${process.env.SMTP_USER}>`,
                to: email,
                subject: asunto,
                html: contenido
            });

            console.log(`Correo enviado a ${email}`);
            console.log(`Vista previa: ${nodemailer.getTestMessageUrl(info)}`);
        } catch (err) {
            console.error(`Error al enviar a ${email}:`, err.message);
        }
    }
}

module.exports = enviarCorreoMasivo;
