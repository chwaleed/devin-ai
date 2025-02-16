import { ObjectId } from "mongodb";

import Project from "../models/project.model";
import User from "../models/user.model";

export const createProject = async ({
  name,
  id,
}: {
  name: string;
  id: ObjectId;
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

export const findProjects = async ({
  id,
}: {
  id: ObjectId;
}): Promise<Array<object>> => {
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
}: addUser): Promise<any> => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!project.users.includes(userId)) {
      throw new Error("User not authorized to add users to this project");
    }

    const newUsers = users.filter((user) => !project.users.includes(user));
    if (newUsers.length > 0) {
      project.users.push(...newUsers);
      await project.save();
    }

    const updatedProject = await Project.findById(projectId).populate("users");
    return updatedProject;
  } catch (error: unknown) {
    throw new Error(`Unable to add users: ${error}`);
  }
};

export const getAllUsers = async (
  userId: ObjectId
): Promise<Array<object> | void> => {
  try {
    const users = await User.find({ _id: { $ne: userId } });
    if (users.length < 1) throw new Error("No User Found ");
    return users;
  } catch (error) {
    throw new Error(`Error in getting users : ${error}`);
  }
};

export const getProject = async ({
  projectId,
}: {
  projectId: ObjectId;
}): Promise<object> => {
  try {
    const project = await Project.findById(projectId).populate("users");
    if (!project) throw new Error("Project not found");

    return project;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
