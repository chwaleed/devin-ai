import Project from "../models/project.model";

export const createProject = async ({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) => {
  if (!name) throw new Error("Name is required");
  if (!userId) throw new Error("User Id is required");

  try {
    const project = await Project.create({ name, users: [userId] });
    return project;
  } catch (error) {
    throw new Error("Database Error");
  }
};
