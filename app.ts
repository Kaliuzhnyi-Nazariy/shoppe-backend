import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://shoppe-8f1f.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use(routes);

export default app;
