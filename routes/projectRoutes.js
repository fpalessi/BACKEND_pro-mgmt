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

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getProjects).post(checkAuth, newProject);

router
  .route("/:id")
  .get(checkAuth, getSingleProject)
  .put(checkAuth, editProject);

router
  .route("/:id")
  .get(checkAuth, getSingleProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, removeProject);

router
  .post("/collaborators", checkAuth, searchCollaborator)
  .post("/collaborators/:id", checkAuth, addCollaborator)
  .post("/delete-collaborator/:id", checkAuth, removeCollaborator);

export default router;
