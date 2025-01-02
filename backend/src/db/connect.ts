import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const dbUri = process.env.DB_URI || "";
async function connect() {
  mongoose
    .connect(dbUri)
    .then(() => {
      console.log("Connected to database");
    })
    .catch(() => {
      console.log("Error connecting to database");
    });
}

export default connect;
