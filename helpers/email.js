import nodemailer from "nodemailer";
// Función que va a enviar el email
export const emailRegister = async (data) => {
  const { email, name, token } = data;
  //todo pasar a .env
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //   Informacion del email
  const info = await transport.sendMail({
    from: '"pro-mgmt", <cuentas@pro-mgmt.com>',
    to: email,
    subject: "pro-mgmt - Verifica tu cuenta",
    text: "Confirma tu cuenta en pro-mgmt",
    html: `<p> Bievenido. Estamos encantados con tenerte aquí.</p>
    <br>
    <p> Verifica tu cuenta en pro-mgmt </p>
    <p> Tu cuenta ya está casi lista, solo debes validarla siguiendo el siguiente enlace</p>
    <br>
    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirmar cuenta</a>
    <br>
    <p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>    
    `,
  });
};
// Función que va a enviar el email
export const emailForgotPassword = async (data) => {
  const { email, token } = data;
  //TODO: mover hacia variables de entorno
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //   Informacion del email
  const info = await transport.sendMail({
    from: '"pro-mgmt", <cuentas@pro-mgmtit.com>',
    to: email,
    subject: "pro-mgmt - Reestablece tu contraseña",
    text: "Reestablece tu contraseña",
    html: `<p> Has solicitado reestablecer tu contraseña </p>
    <p> Sigue el siguiente enlace para generar una nueva:</p>
    <br>
    <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Recuperar contraseña</a>
    <br>
    <p>Si no solicitaste este email, puedes ignorar este mensaje</p>    
    `,
  });
};
