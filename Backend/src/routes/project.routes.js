// src/routes/project.routes.js
import express from "express";
import {
  createProject,
  getProjectsByWorkspace,
  getProjectMembers,
  UpdateProjectStatus,
  UpdateProjectDetails,
  DeleteProjectDetails,
  getProjectById,
  addComment,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", createProject);

router.get("/:workspaceId", getProjectsByWorkspace);

router.get("/members/:projectId", getProjectMembers);

router.put("/:projectId/status", UpdateProjectStatus);

router.put("/:projectId/details", UpdateProjectDetails);

router.delete("/:projectId/delete", DeleteProjectDetails);

router.post("/:projectId/getProjectById", verifyToken, getProjectById);

router.post("/:projectId/comment", verifyToken, addComment);

export default router;
