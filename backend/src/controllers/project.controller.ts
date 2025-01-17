import {
  addUser,
  createProject,
  findProjects,
  getAllUsers,
  getProject,
} from "../services/project.services";
import { Request, response, Response } from "express";
import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";

export const projectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json({ errors: error.array() });
      return;
    }
    const { name }: { name: string } = req.body;
    console.log("name is coongin ", name);

    const { id } = req.user;

    const newProject = await createProject({ name, id });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).send("Interval Server Error");
  }
};

export const getAllProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.user;
    if (!id) res.status(401).send("User not Found");
    const projects = await findProjects({ id });
    if (projects.length === 0) {
      res.status(401).send("No Project Found");
      return;
    }
    res
      .status(200)
      .json({ message: "Projects found successfully ", data: projects });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

type addUser = {
  projectId: string;
  users: Array<ObjectId>;
  userId: ObjectId;
};

export const addUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { projectId, users, userId }: addUser = req.body;
    const reponse = await addUser({ projectId, users, userId });
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const findAllUsersController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const users = await getAllUsers(userId);

    res.status(200).json({ message: "User Found Successfully", data: users });
  } catch (error) {
    res.status(404).send(`${error}`);
  }
};

export const getProjectDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;
    console.log(projectId);
    if (!projectId) res.status(400).send("Please provide Project Id");

    const projectObjId = new ObjectId(projectId);

    const project = await getProject({ projectId: projectObjId });

    res
      .status(200)
      .json({ message: "Project found successfully", data: project });
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};
