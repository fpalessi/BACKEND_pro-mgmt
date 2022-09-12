import express from "express";

import {
  addTask,
  getTask,
  updateTask,
  removeTask,
  changeTaskState,
} from "../controllers/taskController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", checkAuth, addTask);
router
  .route("/:id")
  .get(checkAuth, getTask)
  .put(checkAuth, updateTask)
  .delete(checkAuth, removeTask);

router.post("/state/:id", checkAuth, changeTaskState);

export default router;
