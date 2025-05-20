// utils/crearCuentaTest.js
const nodemailer = require('nodemailer');

(async () => {
    const testAccount = await nodemailer.createTestAccount();
    console.log("Cuenta de prueba creada:");
    console.log(testAccount);
})();
