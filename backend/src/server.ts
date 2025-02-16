import app from ".";
import http from "http";
import { configDotenv } from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import mongoose from "mongoose";
import Project from "./models/project.model";
import { send } from "process";
import { generateAiResponse } from "./services/gemnai";

configDotenv();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

const port = process.env.PORT || 3000;

declare module "socket.io" {
  interface Socket {
    user: {
      id: string;
      email: string;
    };
    project?: any;
    roomId: string;
  }
}

io.use(async (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    const projectId = socket.handshake.query.projectId;
    if (!cookies) {
      return next(new Error("Authentication cookies are missing"));
    }

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId as string)) {
      return next(new Error("Invalid Project"));
    }

    socket.project = await Project.findById(projectId);

    const parsedCookies = cookie.parse(cookies);

    const token = parsedCookies.token;
    if (!token) {
      return next(new Error("Authentication token is missing in cookies"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "object" && decoded !== null) {
      socket.user = decoded as { id: string; email: string };
      next();
    } else {
      return next(new Error("Invalid authentication token"));
    }
  } catch (error: any) {
    next(error);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  socket.join(socket?.roomId);

  socket.on("project-message", async (message) => {
    if (message.trim().startsWith("@ai")) {
      const prompt = message.trim().slice(3);

      const res = await generateAiResponse({
        prompt,
        io,
        roomId: socket.roomId,
      });
    } else {
      socket.broadcast.to(socket.roomId).emit("project-message", {
        message: message,
        sender: socket.user.email,
      });
    }
  });

  socket.on("disconnect", () => {
    socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
