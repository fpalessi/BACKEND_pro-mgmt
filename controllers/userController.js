import User from "../models/User.js";
import idGenerator from "../helpers/idGenerator.js";
import jwtGenerator from "../helpers/jwtGenerator.js";
import { emailRegister, emailForgotPassword } from "../helpers/email.js";
const register = async (req, res) => {
  const { email } = req.body;
  // .find() -brings every- vs .findOne()-finds one and brings it-
  // .findOne({email)
  const checkUser = await User.findOne({ email: email });
  if (checkUser) {
    const error = new Error(
      `Ya existe un usuario con el siguiente correo: ${email}`
    );
    return res.status(400).json({ msg: error.message });
  }
  try {
    // Create user and store it in db. -> req.body = {name, pass, email} we sending from Postman
    // Creating new instance of user model with that data
    const user = new User(req.body);
    user.token = idGenerator();

    // Confirmation-email -> {} object cause we sending it as an unique variable (data)
    // Le vamos a pasar el email, que viene de usuario.email, el nombre que viene de usuario.nombre...

    emailRegister({
      email: user.email,
      nombre: user.nombre,
      token: user.token,
    });

    await user.save();
    res.json({
      msg: "Usuario creado, revisa tu correo y confirma tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("No existe ningún usuario con ese correo");
    return res.status(404).json({ msg: error.message });
  }
  if (!user.confirmed) {
    const error = new Error(
      "Necesitas confirmar tu cuenta para iniciar sesión"
    );
    return res.status(403).json({ msg: error.message });
  }
  if (await user.passwordChecker(password)) {
    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: jwtGenerator(user._id),
    });
  } else {
    const error = new Error("La contraseña introducida no es correcta");
    return res.status(403).json({ msg: error.message });
  }
};

const confirm = async (req, res) => {
  // req.body -> Data we sent -> POST - POSTMAN - BODY
  // req.params -> Values on URL
  const { token } = req.params;
  // which user has that token?
  const confirmUser = await User.findOne({ token });
  // token does not exist ? invalid token
  // 1 use-token, once you use it, expires and we show error

  // if (!confirmUser) {
  //   const error = new Error("Token No Válido");
  //   return res.status(403).json({ msg: error.message });
  // }

  // token exists -> confirmed: true, token: "", save()
  try {
    confirmUser.confirmed = true;
    confirmUser.token = "";
    await confirmUser.save();
    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error(
      "No existe ningún usuario con el correo que has introducido"
    );
    return res.status(404).json({ msg: error.message });
  }
  try {
    user.token = idGenerator();
    await user.save();
    // Enviar el email
    // Tenemos una instancia de user disponible justo arriba asique...
    emailForgotPassword({
      email: user.email,
      nombre: user.nombre,
      token: user.token,
    });
    res.json({ msg: "Te hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};
const checkToken = async (req, res) => {
  const { token } = req.params;
  // validToken stores the 1st user with said token
  const validToken = await User.findOne({ token });
  if (validToken) {
    res.json({ msg: "Token Válido y el Usuario existe" });
  } else {
    const error = new Error("Token no Válido");
    return res.status(404).json({ msg: error.message });
  }
};
const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  // token valid?
  const user = await User.findOne({ token });
  if (user) {
    //Si el token es correcto, almacenamos el nuevo pass
    user.password = password;
    // Reseteamos el token
    user.token = "";
    // Lo guardamos en la db
    try {
      await user.save();
      res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no Válido");
    return res.status(404).json({ msg: error.message });
  }
};
const profile = async (req, res) => {
  // We read it from server side
  const { user } = req;
  res.json(user);
};

export {
  register,
  login,
  confirm,
  forgotPassword,
  checkToken,
  newPassword,
  profile,
};
