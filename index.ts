import dotenv from "dotenv";
dotenv.config();

import app from "./app";

app.listen(3001, () => {
  console.log("server is running!");
});
