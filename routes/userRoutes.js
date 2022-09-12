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

import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/", register);
router.post("/login", login);
router.get("/confirm/:token", confirm);
router.post("/forgot-password", forgotPassword);
router.get("/forgot-password/:token", checkToken);
router.post("/forgot-password/:token", newPassword);
router.get("/profile", isAuth, profile);

export default router;
