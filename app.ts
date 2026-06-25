import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  }),
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shoppe-8f1f.vercel.app",
      "https://shoppe-iota.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(limiter);

app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/checkout/webhook") {
    return next();
  }
  express.json({ limit: "5mb" })(req, res, next);
});
// app.use(express.json({ limit: "5mb" }));

app.use(routes);

export default app;
