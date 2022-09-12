// este archivo soporta POST, GET, PUT, PATCH, ETC.
// se va a ir agrupando a este endpoint ("/api/usuarios")
import express from "express";
import {
  register,
  login,
  confirm,
  forgotPassword,
  checkToken,
  newPassword,
  profile,
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", register);
router.post("/login", login);
router.get("/confirm/:token", confirm);
router.post("/forgot-password", forgotPassword);
router.get("/forgot-password/:token", checkToken);
router.post("/forgot-password/:token", newPassword);
// Primero va a entrar a este endpoint (/perfil), luego ejecuta el middleware checkAuth
// en checkAuth realizaremos una serie de comprobaciones {verificar JWT sea valido, exista, este enviado via headers...}
// y si todo esta bien, ejecutaremos perfil
// De este modo, estamos previniendo el acceso al usuario a su perfil hasta que esté autenticado
router.get("/profile", checkAuth, profile);
// router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);
export default router;
