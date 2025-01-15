import mongoose from "mongoose";

const porjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: [true, "Project name must be unique"],
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

const Project = mongoose.model("project", porjectSchema);

export default Project;
