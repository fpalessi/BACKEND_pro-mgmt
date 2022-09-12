import User from "../models/User.js";
import idGenerator from "../helpers/idGenerator.js";
import jwtGenerator from "../helpers/jwtGenerator.js";
import { emailRegister, emailForgotPassword } from "../helpers/email.js";

const register = async (req, res) => {
  const { email } = req.body;
  const checkUser = await User.findOne({ email: email });
  if (checkUser) {
    const error = new Error(
      `Ya existe un usuario con el siguiente correo: ${email}`
    );
    return res.status(400).json({ msg: error.message });
  }
  try {
    // Create user and store it in db.
    const user = new User(req.body);
    user.token = idGenerator();
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
  const { token } = req.params;
  const confirmUser = await User.findOne({ token });
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
  const user = await User.findOne({ token });
  if (user) {
    user.password = password;
    user.token = "";
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
