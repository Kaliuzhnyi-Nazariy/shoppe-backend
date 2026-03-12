import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);

app.use(routes);

export default app;
