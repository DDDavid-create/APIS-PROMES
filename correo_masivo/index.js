// index.js
const enviarCorreoMasivo = require('./mailer');

const listaCorreos = [
    "correo1@ejemplo.com",
    "correo2@ejemplo.com",
];

const asunto = "🎉 ¡Promoción especial!";
const contenido = `
    <h1>Hola 👋</h1>
    <p>Gracias por participar en nuestra campaña.</p>
    <p>xoxoxo.</p>
`;

enviarCorreoMasivo(listaCorreos, asunto, contenido);
