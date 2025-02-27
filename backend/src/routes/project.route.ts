import { Router } from "express";
import { authUser } from "../middleware/auth.middleware";
// import { projectController } from "../controllers/project.controller";
import * as projectControllers from "../controllers/project.controller";
import { body } from "express-validator";

const router = Router();

router.post(
  "/create-project",
  authUser,
  body("name").isString().withMessage("Name is required"),
  projectControllers.projectController
);

router.get("/get-projects", authUser, projectControllers.getAllProjects);
router.put(
  "/add-users",
  authUser,
  body("projectId").isString().withMessage("Project ID is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array of strings")
    .bail()
    .custom((users) => users.every((user: any) => typeof user === "string"))
    .withMessage("Each user must be a string"),
  projectControllers.addUserController
);

router.get(
  "/get-all-user",
  authUser,
  projectControllers.findAllUsersController
);

router.get(
  "/get-project/:projectId",
  authUser,
  projectControllers.getProjectDetails
);

export default router;
