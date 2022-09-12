import express from "express";

import {
  getProjects,
  newProject,
  getSingleProject,
  editProject,
  removeProject,
  searchCollaborator,
  addCollaborator,
  removeCollaborator,
} from "../controllers/projectController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.route("/").get(isAuth, getProjects).post(isAuth, newProject);

router.route("/:id").get(isAuth, getSingleProject).put(isAuth, editProject);

router
  .route("/:id")
  .get(isAuth, getSingleProject)
  .put(isAuth, editProject)
  .delete(isAuth, removeProject);

router
  .post("/collaborators", isAuth, searchCollaborator)
  .post("/collaborators/:id", isAuth, addCollaborator)
  .post("/delete-collaborator/:id", isAuth, removeCollaborator);

export default router;
