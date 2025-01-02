import app from ".";
import http from "http";
import { configDotenv } from "dotenv";

configDotenv();

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
