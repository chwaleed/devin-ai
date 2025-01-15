import express from "express";
import morgan from "morgan";
import connect from "./db/connect";
import * as userRouter from "./routes/user.route";
import * as projectRouter from "./routes/project.route";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

connect();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", userRouter.default);
app.use("/api", projectRouter.default);

export default app;
