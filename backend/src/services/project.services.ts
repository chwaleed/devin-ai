import { ObjectId } from "mongodb";

import Project from "../models/project.model";

export const createProject = async ({
  name,
  id,
}: {
  name: string;
  id: string;
}) => {
  if (!name) throw new Error("Name is required");
  if (!id) throw new Error("User Id is required");

  try {
    const project = await Project.create({ name, users: [id] });
    return project;
  } catch (error) {
    throw new Error("Database Error");
  }
};

export const findProjects = async (id: string): Promise<Array<object>> => {
  try {
    const projects = await Project.find({ users: id });
    return projects;
  } catch (error: unknown) {
    throw new Error("Error in Finding Project");
  }
};

type addUser = {
  projectId: string;
  users: Array<ObjectId>;
  userId: ObjectId;
};

export const addUser = async ({
  projectId,
  users,
  userId,
}: addUser): Promise<string> => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!project.users.includes(userId)) {
      throw new Error("User not authorized to add users to this project");
    }

    project.users.push(...users);
    await project.save();
    return "User added successfully";
  } catch (error: unknown) {
    throw new Error(`Unable to add users: ${error}`);
  }
};
