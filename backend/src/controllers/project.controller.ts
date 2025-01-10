import Project from "../models/project.model";
import { createProject } from "../services/project.services";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const projectController = async (req: Request, res: Response) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const { name, userId }: { name: string; userId: string } = req.body;

    const newProject = await createProject({ name, userId });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).send("Interval Server Error");
  }
};
