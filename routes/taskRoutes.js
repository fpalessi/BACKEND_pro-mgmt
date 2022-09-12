import express from "express";

import {
  addTask,
  getTask,
  updateTask,
  removeTask,
  changeTaskState,
} from "../controllers/taskController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/", isAuth, addTask);

router
  .route("/:id")
  .get(isAuth, getTask)
  .put(isAuth, updateTask)
  .delete(isAuth, removeTask);

router.post("/state/:id", isAuth, changeTaskState);

export default router;
