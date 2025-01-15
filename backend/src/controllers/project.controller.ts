import {
  addUser,
  createProject,
  findProjects,
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
    const { name, id }: { name: string; id: string } = req.body;

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

    const { id }: { id: string } = req.body;
    if (!id) res.status(401).send("User not Found");
    const projects = await findProjects(id);
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
    const reponse = addUser({ projectId, users, userId });
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send("Internal Server Error");
    return;
  }
};
