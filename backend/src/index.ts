import express from "express";
import morgan from "morgan";
import connect from "./db/connect";
import router from "./routes/user.route";

const app = express();

connect();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

export default app;
