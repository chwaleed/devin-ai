import express from "express";
import morgan from "morgan";
import connect from "./db/connect";
import router from "./routes/user.route";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

connect();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

export default app;
